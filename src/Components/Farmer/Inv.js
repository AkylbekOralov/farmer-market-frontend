// Components/Farmer/Inv.js
import React, { useEffect, useState } from "react";
import "../../Styles/Inventory.css"; // Ensure Inventory.css exists and is styled
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inventory = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query

  useEffect(() => {
    // Fetch data from the mock inventory.json file
    axios
      .get("/inventory.json")
      .then((response) => setInventoryData(response.data))
      .catch((error) => console.error("Error fetching inventory data:", error));
  }, []);

  // Filtered data based on the search query
  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inventory-container">
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

      <h1 className="page-title-container">
        <span className="page-title">Inventory</span>
        <button
          className="manage-inventory-button"
          onClick={() => alert("Manage Inventory Clicked")}
        >
          Manage Inventory
        </button>
      </h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Quick search"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
        <button className="status-button">Status</button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>Inventory</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <span
                  className={`status ${
                    item.inStock ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
