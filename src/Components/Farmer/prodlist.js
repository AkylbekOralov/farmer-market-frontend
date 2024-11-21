// Components/Farmer/prodlist
import React, { useState, useEffect } from "react";
import "../../Styles/ProdList.css"; // Create CSS file similar to style in your image
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProdList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({}); // Track current image index for each product

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/farmer/products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data.products); // Assuming API returns a `products` array

        // Initialize current image indexes for each product
        const imageIndexes = {};
        response.data.products.forEach((product) => {
          imageIndexes[product.id] = 0; // Start with the first image
        });
        setCurrentImageIndexes(imageIndexes);
      } catch (error) {
        console.error("Error fetching the product data:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch farmer profile
        const profileResponse = await axios.get(
          "http://localhost:8383/api/farmer/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Pre-select crops from the profile
        setCategories(["All", ...(profileResponse.data.crops || [])]); // Add "All" as the first category
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    loadProducts();
  }, []);

  // Handle switching to the next image
  const handleNextImage = (productId) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = { ...prevIndexes };
      const product = products.find((p) => p.id === productId);
      if (product && product.images) {
        newIndexes[productId] =
          (newIndexes[productId] + 1) % product.images.length; // Loop back to the first image
      }
      return newIndexes;
    });
  };

  // Handle switching to the previous image
  const handlePreviousImage = (productId) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = { ...prevIndexes };
      const product = products.find((p) => p.id === productId);
      if (product && product.images) {
        newIndexes[productId] =
          (newIndexes[productId] - 1 + product.images.length) %
          product.images.length; // Loop back to the last image
      }
      return newIndexes;
    });
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" ||
      (product.category_name &&
        product.category_name.toLowerCase().trim() ===
          filterCategory.toLowerCase().trim());

    return matchesSearchTerm && matchesCategory;
  });

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

      <div className="search-filters">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Quick search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
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

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-slider">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:8383/${
                      product.images[currentImageIndexes[product.id]]
                    }`}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="image-controller">
                    <button
                      className="prev-image-button"
                      onClick={() => handlePreviousImage(product.id)}
                    >
                      &lt;
                    </button>
                    <div className="image-indicators">
                      {product.images.map((_, index) => (
                        <span
                          key={index}
                          className={`indicator ${
                            currentImageIndexes[product.id] === index
                              ? "active"
                              : ""
                          }`}
                        >
                          ●
                        </span>
                      ))}
                    </div>
                    <button
                      className="next-image-button"
                      onClick={() => handleNextImage(product.id)}
                    >
                      &gt;
                    </button>
                  </div>
                </>
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">
                ${product.price} / {product.unit_of_measure}
              </p>
              <p className="product-category_name">{product.category_name}</p>
              <p className="product-quantity">
                {product.quantity} {product.unit_of_measure}
              </p>
              <p className="product-status">{product.inventory_status}</p>
              <button
                className="edit-button"
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={async () => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this product?"
                  );
                  if (confirmDelete) {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(
                        `http://localhost:8383/api/farmer/product/${product.id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      alert("Product deleted successfully");
                      setProducts(products.filter((p) => p.id !== product.id)); // Remove deleted product from UI
                    } catch (error) {
                      console.error("Error deleting product:", error);
                      alert("Failed to delete product");
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-button">Chat</div>
    </div>
  );
};

export default ProdList;
