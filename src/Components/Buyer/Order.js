import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "../../Styles/Buyer/Order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/buyer/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`); // Navigate to the order details page
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="order">
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
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} onClick={() => handleOrderClick(order.id)}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ${order.total_amount}</p>
              <p>
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
