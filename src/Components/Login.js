// Components/Login.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Using AuthContext to manage authentication state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // Send login request to the backend
      const response = await fetch("http://localhost:8383/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save token and role in context and localStorage
      login(data.token, data.role);

      // Redirect user based on their role
      if (data.role === "buyer") {
        navigate("/buyer-main");
      } else if (data.role === "farmer") {
        navigate("/farmer-main");
      } else if (data.role === "admin") {
        navigate("/admin-main");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
