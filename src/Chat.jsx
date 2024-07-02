import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "./APIRoutes";
import ChatContainer from "./chatContainer";
import Contacts from "./contacts";
import Welcome from "./welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        if (!user) {
          navigate("/login");
        } else {
          setCurrentUser(user);
          setIsLoading(true);
        }
      } catch (error) {
        console.error("Error retrieving user from localStorage:", error);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser && !currentUser.isAvatarImageSet) {
      navigate("/avatar");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      return () => {
        socket.current.disconnect(); // Cleanup socket on unmount
      };
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentUser && currentUser.isAvatarImageSet) {
          const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(response.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? <Welcome /> : <ChatContainer currentChat={currentChat} socket={socket} />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
