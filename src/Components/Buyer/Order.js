// components/Buyer/Orders.js
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
    <div className="order-container">
      <div className="header buyer">{/* Header content */}</div>
      <div className="orders-content">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li
                key={order.id}
                className="order-item"
                onClick={() => handleOrderClick(order.id)}
              >
                <p>
                  <span>Order ID:</span> {order.id}
                </p>
                <p>
                  <span>Status:</span>{" "}
                  <span className="order-status">{order.status}</span>
                </p>
                <p>
                  <span>Total Amount:</span>{" "}
                  <span className="order-total-amount">
                    ${order.total_amount}
                  </span>
                </p>
                <p className="order-date">
                  Order Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
