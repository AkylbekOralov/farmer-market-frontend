// Components/Farmer/Account.js
import React, { useEffect, useState } from "react";
import "../../Styles/Account.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import edit from "../../Assets/edit.svg";

const Account = () => {
  const [userData, setUserData] = useState({});
  const [farmData, setFarmData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [cropTypes, setCropTypes] = useState([]); // Store available crop types as names
  const [selectedCrops, setSelectedCrops] = useState([]); // Track selected crop names
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch farmer profile
        const profileResponse = await axios.get(
          "http://localhost:8383/api/farmer/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData({
          username: profileResponse.data.username,
          email: profileResponse.data.email,
          phone: profileResponse.data.phone,
        });

        setFarmData({
          farmAddress: profileResponse.data.farmAddress,
          farmSize: profileResponse.data.farmSize,
        });

        // Pre-select crops from the profile
        setSelectedCrops(profileResponse.data.crops || []);
        setProfilePicture(profileResponse.data.profilePicture);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchCropTypes = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch crop types from categories
        const cropResponse = await axios.get(
          "http://localhost:8383/api/farmer/crop-types",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCropTypes(cropResponse.data.categories.map((crop) => crop.name)); // Use names
      } catch (error) {
        console.error("Error fetching crop types:", error);
      }
    };

    fetchProfile();
    fetchCropTypes();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8383/api/farmer/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleCropSelection = (cropName) => {
    // Toggle crop selection by name
    setSelectedCrops(
      (prevCrops) =>
        prevCrops.includes(cropName)
          ? prevCrops.filter((name) => name !== cropName) // Remove if already selected
          : [...prevCrops, cropName] // Add if not selected
    );
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8383/api/farmer/profile",
        {
          username: userData.username,
          phone: userData.phone,
          farmAddress: farmData.farmAddress,
          farmSize: farmData.farmSize,
          crops: selectedCrops, // Send updated crop names
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="account container">
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
            onClick={() => navigate("/farmer-main")}
          >
            Main
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>

      <div className="account-container farmer">
        {/* User Info */}
        <div className="user-info">
          <h2>About account</h2>
          <div className="profile-pic-section">
            <img
              src={
                profilePicture
                  ? `http://localhost:8383/${profilePicture}`
                  : "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="profile-pic"
            />
            <label for="file-upload" class="custom-file-upload">
              <img src={edit} />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="user-details">
            <label>
              Name:{" "}
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </label>
            <label>Email: {userData.email}</label>
            <label>
              Phone:{" "}
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        {/* Farm Info */}
        <div className="farm-info">
          <h2>About farm</h2>
          <div className="farm-details">
            <label>
              Farm Address:{" "}
              <input
                type="text"
                value={farmData.farmAddress}
                onChange={(e) =>
                  setFarmData({ ...farmData, farmAddress: e.target.value })
                }
              />
            </label>
            <label>
              Farm Size:{" "}
              <input
                type="text"
                value={farmData.farmSize}
                onChange={(e) =>
                  setFarmData({ ...farmData, farmSize: e.target.value })
                }
              />
            </label>
            <label>Crops:</label>
            <div className="crop-types">
              {cropTypes.map((cropName) => (
                <div key={cropName} className="crop-type">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCrops.includes(cropName)} // Pre-select crops
                      onChange={() => handleCropSelection(cropName)}
                    />
                    {cropName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        className="update-button"
        disabled={loading}
        onClick={handleProfileUpdate}
      >
        {loading ? <span className="loader"></span> : "Update Profile"}
      </button>
    </div>
  );
};

export default Account;
