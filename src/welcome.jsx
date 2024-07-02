import React, { useEffect, useState } from "react";
import styled from "styled-components";
import robot from "./robot.gif";

function Welcome() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (storedUser) {
        const user = await JSON.parse(storedUser);
        setUsername(user.username);
      }
    };
    fetchUsername();
  }, []);

  return (
    <Container>
      <img src={robot} alt="Robot" />
      <h1>
        Welcome, <span>{username}</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #3ef5d4;
  }
`;

export default Welcome;
