// Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOrPass: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8383/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.nameOrPass,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // Store token (optional)
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "buyer") {
        navigate("/buyer-main");
      } else if (data.role === "farmer") {
        navigate("/farmer-main");
      } else if (data.role === "administrator") {
        navigate("/admin-main");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        Login
        <input
          name="nameOrPass"
          placeholder="Username / Email"
          type="email"
          required
          value={formData.nameOrPass}
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
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
        <button type="submit">Login</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
      <div className="btn reg-btn" onClick={() => navigate("/register")}>
        Register
      </div>
    </>
  );
};

export default Login;
