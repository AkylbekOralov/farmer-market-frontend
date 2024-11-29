// Components/Buyer/Account1.js
import React, { useEffect, useState } from "react";
import "../../Styles/Account.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import edit from "../../Assets/edit.svg";

const Account = () => {
  const [userData, setUserData] = useState({});
  const [buyerProfile, setBuyerProfile] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user and buyer profile details
        const userResponse = await axios.get(
          "http://localhost:8383/api/buyer/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData({
          username: userResponse.data.username,
          email: userResponse.data.email,
          phone: userResponse.data.phone,
        });

        setBuyerProfile({
          deliveryAddress: userResponse.data.delivery_address,
        });

        setPaymentInfo({
          cardNumber: userResponse.data.payment?.card_number || "",
          expireDate: userResponse.data.payment?.expire_date || "",
          ownerName: userResponse.data.payment?.owner_name || "",
          cvc: userResponse.data.payment?.cvc || "",
        });

        setProfilePicture(userResponse.data.profile_picture);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8383/api/buyer/profile-picture",
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

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8383/api/buyer/profile",
        {
          username: userData.username,
          phone: userData.phone,
          deliveryAddress: buyerProfile.deliveryAddress,
          payment: {
            cardNumber: paymentInfo.cardNumber,
            expireDate: paymentInfo.expireDate,
            ownerName: paymentInfo.ownerName,
            cvc: paymentInfo.cvc,
          },
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
      <div className="header buyer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Buyer Icon"
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
            onClick={() => navigate("/buyer-main")}
          >
            Main
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>

      <div className="account-container buyer">
        {/* User Info */}
        <div className="user-info">
          <h2>About Account</h2>
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

        <div className="right">
          {/* Buyer Info */}
          <div className="buyer-info">
            <h2>Delivery Information</h2>
            <label>
              Delivery Address:{" "}
              <input
                type="text"
                value={buyerProfile.deliveryAddress}
                onChange={(e) =>
                  setBuyerProfile({
                    ...buyerProfile,
                    deliveryAddress: e.target.value,
                  })
                }
              />
            </label>
          </div>

          {/* Payment Info */}
          <div className="payment-info">
            <h2>Payment Information</h2>
            <label>
              Card Number:{" "}
              <input
                type="text"
                maxLength="16"
                value={paymentInfo.cardNumber}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                }
              />
            </label>
            <label>
              Expire Date:{" "}
              <input
                type="date"
                value={paymentInfo.expireDate}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, expireDate: e.target.value })
                }
              />
            </label>
            <label>
              Owner Name:{" "}
              <input
                type="text"
                value={paymentInfo.ownerName}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, ownerName: e.target.value })
                }
              />
            </label>
            <label>
              CVC:{" "}
              <input
                type="text"
                maxLength="3"
                value={paymentInfo.cvc}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, cvc: e.target.value })
                }
              />
            </label>
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
