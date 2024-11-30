// Components/Farmer/Order.js
import React, { useEffect, useState } from "react";
import "../../Styles/Farmer/order.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/farmer/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data.orders || []);
        setFilteredOrders(response.data.orders || []); // Initialize filtered orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on the search term
    const results = orders.filter(
      (order) =>
        order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toString().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term on input change
  };

  // Function to handle status update
  const handleStatusChange = async (orderItemId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8383/api/farmer/order-item/${orderItemId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          return {
            ...order,
            items: order.items.map((item) => {
              if (item.orderItemId === orderItemId) {
                return { ...item, status: newStatus };
              }
              return item;
            }),
          };
        })
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

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
            onClick={() => navigate("/farmer-main")}
          >
            Main
          </button>
          <button
            className="account-button"
            onClick={() => navigate("/farmer-account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>
      <div className="ordersss">
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
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Order Date</th>
              <th>Item Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) =>
              order.items.map((item) => (
                <tr key={item.orderItemId}>
                  <td>{`#${order.orderId}`}</td>
                  <td>{order.buyerName}</td>
                  <td>{item.productName}</td>
                  <td>{`${item.quantity} ${item.unitOfMeasure || "kg"}`}</td>
                  <td>{`$${item.totalPrice.toFixed(2)}`}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.orderItemId, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
