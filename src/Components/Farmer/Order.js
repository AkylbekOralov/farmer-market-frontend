// Components/Farmer/Order.js
import React, { useEffect, useState } from "react";
import "../Styles/order.css";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Fetch order data from the JSON file
    fetch("/order.json")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data); // Initialize filtered orders with all orders
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, []);

  useEffect(() => {
    // Filter orders based on the search term
    const results = orders.filter(
      (order) =>
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((product) =>
          product.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term on input change
  };

  return (
    <div className="order-container">
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
      <h2>Orders</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Quick search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Client Name</th>
            <th>Product(s)</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.orderId}</td>
              <td>{order.clientName}</td>
              <td>{order.products.join(", ")}</td>
              <td>
                {Object.entries(order.quantity).map(([product, qty]) => (
                  <div key={product}>{`${product}: ${qty}`}</div>
                ))}
              </td>
              <td>{order.totalPrice}</td>
              <td>{order.orderDate}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
