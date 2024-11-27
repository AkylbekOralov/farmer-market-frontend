// Components/Admin/AdminMain.js
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../Styles/Admin/AdminMain.css";

const AdminMain = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-main">
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
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <button onClick={() => navigate("/farmers-list")}>
        Unverified farmers list
      </button>

      <button onClick={() => navigate("/category-control")}>
        Category Control
      </button>
    </div>
  );
};

export default AdminMain;
