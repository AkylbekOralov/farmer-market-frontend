// Components/Buyer/BuyerMain.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/BuyerMain.css";

const BuyerMain = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await fetch(
          "http://localhost:8383/api/buyer/products",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleOrderClick = (productId) => {
    navigate(`/buyer/order/${productId}`); // Navigate to order page with product ID
  };

  return (
    <div className="buyer-main-container">
      <h1>Welcome, Buyer!</h1>
      <h2>Available Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category?.name || "Uncategorized"}</p>
            <button onClick={() => handleOrderClick(product.id)}>
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerMain;
