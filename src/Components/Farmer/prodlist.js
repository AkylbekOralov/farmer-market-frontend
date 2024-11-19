// Components/Farmer/prodlist.js
import React, { useState, useEffect } from "react";
import "../../Styles/ProdList.css"; // Create CSS file similar to style in your image
import { useNavigate } from "react-router-dom";
const ProdList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/prod.json"); // Fetches prod.json from the public directory
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching the product data:", error);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="prod-list-container">
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

      <div className="title-add-button">
        <h1 className="product-list-title">Product listing</h1>
        <button
          className="add-product-button"
          onClick={() => navigate("/add-product")}
        >
          Add New Product
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Quick search"
          className="search-input"
          value={searchTerm} // Bind input value to searchTerm state
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm when typing
        />
      </div>

      <div className="product-grid">
        {filteredProducts.map(
          (
            product,
            index // Use filteredProducts instead of products
          ) => (
            <div className="product-card" key={index}>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">
                  ${product.price} / {product.unit}
                </p>
                <button className="edit-button">Edit</button>
              </div>
            </div>
          )
        )}
      </div>

      <div className="chat-button">Chat</div>
    </div>
  );
};

export default ProdList;
