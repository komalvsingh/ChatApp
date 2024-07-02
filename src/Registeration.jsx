import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from "./APIRoutes";


function Registration() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const toastoption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleValidation = () => {
    const { username, email ,password, confirmPassword} = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same", toastoption);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", toastoption);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be at least 8 characters", toastoption);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastoption);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, data.token);
          navigate("/");
        } else {
          toast.error(data.message, toastoption);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", toastoption);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <h1>Chatter</h1>
          </div>
          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
          <span>
            Already have an account? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  body {
    overflow: hidden;
    background-size: cover;
  }
  .brand {
    align-items: center;
    justify-content: center;
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 2rem 4rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #3ef5d4;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #a1f3e4;
      outline: none;
    }
  }
  button {
    background-color: #3ef5d4;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    width: 300px;
    text-transform: uppercase;
    &:hover {
      background-color: #34e2c8;
    }
  }
  span {
    font-size: 15px;
    color: white;
    text-transform: uppercase;
    a {
      color: #3ef5d4;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Registration;
