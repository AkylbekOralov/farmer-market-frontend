import React, { useState } from "react";
import "../Styles/AdminReg.css";

const AdminReg = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:8383/api/auth/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setSuccess(true);
      } else {
        setErrors(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrors("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-reg-container">
      <h2>Register New Admin</h2>
      {errors && <p className="error-message">{errors}</p>}
      {success && <p className="success-message">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            name="phone"
            placeholder="Phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <div className="show-pass">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AdminReg;
