// Components/Farmer/Inv.js
import React, { useEffect, useState } from "react";
import "../../Styles/Inventory.css"; // Ensure this CSS file exists
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inventory = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    // Fetch inventory and categories
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch inventory data
        const inventoryResponse = await axios.get(
          "http://localhost:8383/api/farmer/products", // Backend endpoint for products
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const products = inventoryResponse.data.products || [];
        setInventoryData(products);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:8383/api/farmer/crop-types", // Backend endpoint for crop types
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(["All", ...categoriesResponse.data.categories.map(c => c.name)]);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchInventory();
  }, []);

  // Filtered inventory data
  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || item.category_name?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
          <button className="account-button" onClick={() => navigate("/account")}>
            My Account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log Out
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

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by Name"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>
                {item.quantity} {item.unit_of_measure}
              </td>
              <td>
                <span
                  className={`status ${
                    item.inventory_status === "In Stock" ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {item.inventory_status}
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

