// Components/Farmer/Account.js
import React, { useEffect, useState } from "react";
import "../Styles/Account.css";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [farmData, setFarmData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching random JSON data
    fetch("randomData.json") // Replace with your JSON file path
      .then((response) => response.json())
      .then((data) => {
        // Update the user and farm data from JSON
        setUserData(data.user); // Assuming JSON has "user" key for user info
        setFarmData(data.farm); // Assuming JSON has "farm" key for farm info
      })
      .catch((error) => console.error("Error fetching JSON data:", error));
  }, []);

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
            onClick={() => navigate("/account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>

      {/* Account and Farm Details */}
      <div className="account-container">
        {/* User Info Section */}
        <div className="user-info">
          <h2>About account</h2>
          <div className="profile-pic-section">
            <img
              src={userData?.profilePic || "https://via.placeholder.com/100"}
              alt="Profile"
              className="profile-pic"
            />
            <button className="change-photo">Change photo</button>
          </div>
          <div className="user-details">
            <label>Name: {userData?.name || "N/A"}</label>
            <label>Surname: {userData?.surname || "N/A"}</label>
            <label>Email: {userData?.email || "N/A"}</label>
            <label>About you: {userData?.about || "N/A"}</label>
            <label>Phone number: {userData?.phone || "N/A"}</label>
          </div>
        </div>

        {/* Farm Info Section */}
        <div className="farm-info">
          <h2>About farm</h2>
          <div className="farm-image-section">
            <img
              src={farmData?.farmImage || "https://via.placeholder.com/100"}
              alt="Farm"
              className="farm-image"
            />
            <button className="change-photo">Change photo</button>
          </div>
          <div className="farm-details">
            <p>
              <strong>Farm size:</strong> {farmData?.size || "N/A"}
            </p>
            <p>
              <strong>Area:</strong> {farmData?.area || "N/A"}
            </p>
            <p>
              <strong>Fields:</strong> {farmData?.fields || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {farmData?.address || "N/A"}
            </p>
            <p>
              <strong>Opened:</strong> {farmData?.opened || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
