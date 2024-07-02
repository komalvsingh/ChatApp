import React from "react";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoutRoute } from "./APIRoutes";

function Loader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (!user || !user._id) {
        throw new Error("User ID not found in localStorage.");
      }

      const response = await axios.get(`${logoutRoute}/${user._id}`);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      } else {
        throw new Error("Logout request failed.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error, e.g., show an error message or retry logic
    }
  };

  return (
    <Button onClick={handleLogout}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #90efed;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
    color: #d7f0f3;
  }
`;

export default Loader;
