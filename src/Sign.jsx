import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {ToastContainer,toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from "./APIRoutes";
function Sign(){
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: ""});
  const toastoption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validatform = () =>{
    const {password,username} = values;
    if(password === "" || username === ""){
      toast.error("Please fill all the fields",toastoption);
      return false;
  }
  return true;
};

const handlesubmit = async (event) =>{
  event.preventDefault();
  if(validatform()){
    const {username,password} = values;
    const {data} = await axios.post(loginRoute,{username,password});
    if(data.status === false){
      toast.error(data.msg,toastoption);
    }
    if(data.status === true){
      localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,JSON.stringify(data.user));
      navigate("/");
    }
  }
}
  return (
    <>
      
      
      <FormContainer>
      <form onSubmit={(event) => handlesubmit(event)}>
        <div className="brand">
        <h1>Chatter</h1>
        </div>
      
        
          <input type="text" name="username" placeholder="Username" min="3" onChange={(e) => handleChange(e)} />
          
        
       
          <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
        
        
        <button type="submit">Log In</button>
        <span>
          Don't have an account ? <Link to="/register">Create One.</Link>
        </span>
      </form>
      
      </FormContainer>
      <ToastContainer/>
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
export default Sign;