import React, { useState } from "react";
import axiosInstance from "../../axiosconfig";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true); //  Start loading

    try {
      const response = await axiosInstance.post("/user/forgot-password", {
        email,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <p>Enter your email and we'll send you an OTP.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {message && (
        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;
