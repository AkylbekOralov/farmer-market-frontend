import React, { useEffect, useState } from "react";
import "../../Styles/Farmer/Inventory.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inventory = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [quantityInputs, setQuantityInputs] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const inventoryResponse = await axios.get(
          "http://localhost:8383/api/farmer/inventory",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInventoryData(inventoryResponse.data.products || []);

        const categoriesResponse = await axios.get(
          "http://localhost:8383/api/farmer/crop-types",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories([
          "All",
          ...categoriesResponse.data.categories.map((c) => c.name),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchInventory();
  }, []);

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" ||
      item.category_name?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (productId, value) => {
    setQuantityInputs({
      ...quantityInputs,
      [productId]: value,
    });
  };

  const handleAddQuantity = async (productId) => {
    const quantityToAdd = parseFloat(quantityInputs[productId]);
    if (isNaN(quantityToAdd)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8383/api/farmer/inventory/${productId}/quantity`,
        { quantity: quantityToAdd },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local inventory data
      setInventoryData((prevData) =>
        prevData.map((item) => {
          if (item.id === productId) {
            const newQuantity = parseFloat(item.quantity) + quantityToAdd;
            let inventory_status = "In Stock";
            if (newQuantity <= 0) {
              inventory_status = "Out of Stock";
            } else if (newQuantity < 10) {
              inventory_status = "Low Stock";
            }

            return {
              ...item,
              quantity: newQuantity,
              inventory_status,
            };
          }
          return item;
        })
      );

      // Clear the input field
      setQuantityInputs({
        ...quantityInputs,
        [productId]: "",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  return (
    <div className="inventory-container">
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="main-logo"
        />
        <div className="right-section">
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
            My Account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log Out
          </button>
        </div>
      </div>

      <div className="inven">
        <h1 className="page-title-container">
          <span className="page-title">Inventory</span>
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
              <th>ID</th>
              <th>Inventory</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Add Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category_name}</td>
                <td>
                  {item.quantity} {item.unit_of_measure}
                </td>
                <td>
                  <span
                    className={`status ${
                      item.inventory_status === "In Stock"
                        ? "in-stock"
                        : item.inventory_status === "Low Stock"
                        ? "low-stock"
                        : "out-of-stock"
                    }`}
                  >
                    {item.inventory_status}
                  </span>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={quantityInputs[item.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => handleAddQuantity(item.id)}
                    className="add-quantity-button"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
