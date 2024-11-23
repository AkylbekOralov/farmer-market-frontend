import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../Styles/Buyer/EditInventory.css";

const EditInventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [quantity, setQuantity] = useState(state?.quantity || 0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const updateQuantity = async () => {
    try {
      const token = localStorage.getItem("token");
      const productId = location.pathname.split("/").pop();
      const response = await axios.put(
        `http://localhost:8383/api/farmer/product/${productId}/quantity`,
        { quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Quantity updated successfully!");
        navigate("/inventory");
      }
    } catch (error) {
      console.error("Error updating quantity:", error.message);
      setErrorMessage(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  };

  return (
    <div className="edit-inventory-container">
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
      <h1>Edit Inventory</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
      </label>
      <div className="buttons-container">
        <button onClick={updateQuantity} className="save-button">
          Save Changes
        </button>
        <button
          onClick={() => navigate("/inventory")}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditInventory;
