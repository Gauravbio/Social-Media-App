import { Avatar } from "@mui/material";
import { Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import "./Register.css";
import { registerUser } from "../../Actions/User";
import {useAlert} from "react-alert";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [password, setPassword] = useState("");

  const dispatch=useDispatch();
  const alert=useAlert();
  const {loading, error}=useSelector((state)=> state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
    Reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(registerUser(name,email,password,avatar));
  };

  useEffect(()=> {
    if(error) {
      alert.error(error);
      dispatch({type:"clearErrors"})
    }
  },[dispatch,error,alert])

  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Media App
        </Typography>

      <Avatar
          src={avatar}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />

        <input type="file" accept="image/" onChange={handleImageChange} />

        <input
          type="text"
          value={name}
          required
          placeholder="Name"
          className="registerInputs"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="registerInputs"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="registerInputs"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/">
          <Typography>Already signed up? login now</Typography>
        </Link>

        <Button type="submit" disabled={loading}>Sign Up</Button>
      </form>
    </div>
  );
};

export default Register;
