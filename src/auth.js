const express = require('express');
const router = express.Router();

const {
  login,
  register,
  getalluser,
  setavtar,
  logout,
} = require("./userController");



router.post("/login", login);
router.post("/register", register);
router.get("/alluser", getalluser);
router.post("/setavtar/:id", setavtar);
router.get("/logout/:id", logout);

module.exports = router;