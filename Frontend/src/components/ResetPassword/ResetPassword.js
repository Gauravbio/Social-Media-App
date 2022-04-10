import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useAlert } from "react-alert";
import "./ResetPassword.css";
import { resetPassword } from "../../Actions/User";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();

  const { error, loading, message } = useSelector((state) => state.like);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(params.token, newPassword));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, alert, message, error]);

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social Media App
        </Typography>

        <input
          type="password"
          className="resetPasswordInputs"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Link to="/">
          <Typography>Login</Typography>
        </Link>
        <Typography>Or</Typography>

        <Link to="/forgot/password">
          <Typography>Request Another Token!</Typography>
        </Link>

        <Button type="submit" disabled={loading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
