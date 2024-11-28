import React, { useState } from "react";
import "../Styles/Registration.css"; // Use the same stylesheet

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

    if (loading) return;

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
    <div className="container reg">
      <form onSubmit={handleSubmit}>
        <h2 className="title">Register Admin</h2>
        <input
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <div className="show-pass">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Register"}
        </button>
      </form>
      {errors && <p className="error-message">{errors}</p>}
      {success && (
        <div className="success-overlay">
          <div className="success-message">
            <p>
              Registration successful!
              <br />
              <br />
              <span>
                Admin account has been created. You can now log in to the admin
                panel.
              </span>
            </p>
            <button onClick={() => window.location.replace("/")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReg;
