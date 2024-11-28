import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      // If already loading, do nothing
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8383/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.role); // Save token and role in AuthContext
        if (data.role === "farmer") {
          navigate("/farmer-main");
        } else if (data.role === "buyer") {
          navigate("/buyer-main");
        } else if (data.role === "admin") {
          navigate("/admin-main");
        } else {
          setError("Unauthorized role for this application.");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container login">
      <div className="login-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="farm-icon"
        />
        <h1 className="title">FARMER MARKET</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="btn reg-btn" onClick={() => navigate("/register")}>
        Don't you have an account? <span>Sign up</span>
      </div>
    </div>
  );
};

export default Login;
