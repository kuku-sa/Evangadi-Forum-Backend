import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import "./Login.css";
import { Appstate } from "../Appstate";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(Appstate);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Add these states for readonly
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [passwordReadonly, setPasswordReadonly] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        user_password: password,
        rememberMe: rememberMe,
      });

      const { token, message, username, userid } = response.data;

      setSuccess(message || "Login successful!");

      // Save token
      localStorage.setItem("token", token);

      // Save user in context
      setUser({ username, userid });

      localStorage.setItem("username", JSON.stringify(username));

      // Redirect to home
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to your account</h2>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="link-highlight">
          Create a new account
        </Link>
      </p>

      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          placeholder="Email address"
          name="user-email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailReadonly(false)}
          readOnly={emailReadonly}
          autoComplete="off"
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="user-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordReadonly(false)}
            readOnly={passwordReadonly}
            autoComplete="new-password"
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="remember-forgot">
          <div className="remember-me">
           
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
