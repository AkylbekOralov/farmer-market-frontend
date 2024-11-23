// Components/Farmer/FarmerMain.js
import React, { useEffect, useState, useContext } from "react";
import "../../Styles/Farmer/FarmerMain.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const FarmerMain = () => {
  const navigate = useNavigate();
  const [farmerName, setFarmerName] = useState("Farmer"); // Placeholder for the farmer's name
  const { logout } = useContext(AuthContext); // Access the logout function from context

  // Fetch farmer's data (e.g., name) from backend
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await fetch(
          "http://localhost:8383/api/farmer/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token for authentication
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFarmerName(data.username || "Farmer"); // Set farmer's name
        } else {
          console.error("Failed to fetch farmer data");
        }
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      }
    };

    fetchFarmerData();
  }, []);

  // Handlers for navigation
  const handleProductListingClick = () => {
    navigate("/prodlist"); // This should match the route path in your router setup
  };

  const handleReportClick = () => {
    navigate("/report"); // This will navigate to the report page
  };

  const handleInventoryClick = () => {
    navigate("/inventory"); // This will navigate to the inventory page
  };

  const handleOrderClick = () => {
    navigate("/order"); // Navigate to the order page
  };

  const handleChatClick = () => {
    navigate("/chat"); // Navigate to the chat page
  };

  const handleLogout = () => {
    logout(); // Clear token and role from localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="main-logo"
        />
        <div className="right-section">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="Mail Icon"
            className="mail-icon"
          />
          <button
            className="account-button"
            onClick={() => navigate("/farmer-account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <h1 className="welcome-message">Welcome back, {farmerName}!</h1>

      {/* Button Grid */}
      <div className="button-grid">
        <button className="action-button" onClick={handleProductListingClick}>
          Product listing
        </button>
        <button className="action-button" onClick={handleReportClick}>
          Reports & Analytics
        </button>
        <button className="action-button" onClick={handleInventoryClick}>
          Inventory
        </button>
        <button className="action-button" onClick={handleOrderClick}>
          View Orders
        </button>
      </div>

      {/* Chat Button */}
      <div className="chat-button" onClick={handleChatClick}>
        Chat
      </div>
    </div>
  );
};

export default FarmerMain;
