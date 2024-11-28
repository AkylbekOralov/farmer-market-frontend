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
    <div className="order">
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
      <div className="ordersss">
        <h2>Order Details</h2>
        <p>Order ID: {order.id}</p>
        <p>Status: {order.status}</p>
        <p>Total Amount: ${order.total_amount}</p>
        <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>

        <h3>Items</h3>
        <ul>
          {order.OrderItems.map((item) => (
            <li key={item.id}>
              <img
                src={`http://localhost:8383/${item.Product.images[0]}`}
                alt={item.Product.name}
                style={{ width: "50px", height: "50px" }}
              />
              <p>Product: {item.Product.name}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>

        <button onClick={() => navigate("/buyer-order")}>Back to Orders</button>
      </div>
    </div>
  );
};

export default OrderDetails;
