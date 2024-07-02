const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require("./src/auth");
const messageRouter = require("./src/messages");
const bodyParser = require('body-parser');
const socket = require("socket.io");
const app = express();
require("dotenv").config();

const PORT = 5000;
const mongourl = "mongodb://localhost:27017/chats";

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

app.use(bodyParser.json());

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Initial connection error:", err);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Initialize socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust origin to match your client's address
    credentials: true,
  },
});

// Map to store online users
const onlineUsers = new Map();

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("add-user", (userId) => {
    console.log("User connected:", userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.msg);
    } else {
      console.log(`User ${data.to} is offline`);
      // Optionally handle offline user scenario
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    // Remove user from onlineUsers map on disconnect
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
    // Handle socket errors
  });
});
