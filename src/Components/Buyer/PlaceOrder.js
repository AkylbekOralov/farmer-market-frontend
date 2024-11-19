// Components/Buyer/PlaceOrder.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { productId } = useParams(); // Extract product ID from the route
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOrderSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8383/api/buyer/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      alert("Order placed successfully!");
      navigate("/buyer-main"); // Redirect to buyer dashboard
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      <p>Product ID: {productId}</p>
      <label>
        Quantity:
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <button onClick={handleOrderSubmit}>Submit Order</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default PlaceOrder;
