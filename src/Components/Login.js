// Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css"; // Importing the Login.css for consistent styling

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOrPass: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update form data when user types
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

      // Store token (if needed)
      localStorage.setItem("token", data.token);

      // Redirect based on user role
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

  return (<>
    <div className="icon-wrapper">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png" 
        alt="Farm Icon" 
        className="farm-icon" 
      />
    </div>
    <h1 className="title">FARMER MARKET</h1>
    
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          name="nameOrPass"
          placeholder="Username / Email"
          type="email"
          required
          value={formData.nameOrPass}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}


        <div
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            I forgot my password
          </div>

          <hr className="divider-line" />


          <div
            className="btn reg-btn"
            onClick={() => navigate("/register")}
          >
            Don't you have an account? <span>Sign up</span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;