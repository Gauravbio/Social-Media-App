import React from 'react'
import {Link} from "react-router-dom";
import {Typography} from "@mui/material";

const User = ({userId,name,avatar}) => {
  return (
    <Link className='homeUser' to ={`/user/${userId}`}>
        <img src={avatar} alt={name}/>
        <Typography>{name}</Typography>
    </Link>
  );
};

export default User