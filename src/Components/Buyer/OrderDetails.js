// components/Buyer/OrderDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "../../Styles/Buyer/OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8383/api/buyer/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="order-details-container">
      <div className="header buyer">
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
            onClick={() => navigate("/buyer-account")}
          >
            My account
          </button>
          <button
            className="account-button"
            onClick={() => navigate("/buyer-main")}
          >
            Main
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <div className="order-details-content">
        <h2>Order Details</h2>
        <div className="order-info">
          <p>
            <span>Order ID:</span> {order.id}
          </p>
          <p>
            <span>Status:</span>{" "}
            <span className="order-status">{order.status}</span>
          </p>
          <p>
            <span>Total Amount:</span>{" "}
            <span className="order-total-amount">${order.total_amount}</span>
          </p>
          <p className="order-date">
            Order Date: {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="order-items">
          <h3>Items</h3>
          <ul className="order-items-list">
            {order.OrderItems.map((item) => (
              <li key={item.id}>
                <img
                  src={`http://localhost:8383/${item.Product.images[0]}`}
                  alt={item.Product.name}
                />
                <div className="order-item-details">
                  <p>
                    <span>Product:</span> {item.Product.name}
                  </p>
                  <p>
                    <span>Price:</span> ${item.price}
                  </p>
                  <p>
                    <span>Quantity:</span> {item.quantity}{" "}
                    {item.Product.unit_of_measure}
                  </p>
                  <p>
                    <span>Total Cost:</span> $
                    {(
                      parseFloat(item.quantity) * parseFloat(item.price)
                    ).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="back-to-orders-btn"
          onClick={() => navigate("/buyer-order")}
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
