// components/Buyer/BuyerMain.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Buyer/BuyerMain.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const BuyerMain = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { logout } = useContext(AuthContext);
  const [limit, setLimit] = useState(8);

  // Track the quantity for each product
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchRecommendations = () => {
      if (products.length > 0) {
        const randomSelection = products
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setRecommendedProducts(randomSelection);
      }
    };

    fetchRecommendations();
  }, [products]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8383/api/buyer/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/buyer/products?category=${categoryId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8383/api/buyer/products?sortBy=created_at&order=desc",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        setDisplayedProducts(data.slice(0, 8));
        initializeQuantities(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/buyer/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCart(response.data.cart || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const initializeQuantities = (products) => {
    const initialQuantities = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 1; // Default to 1
    });
    setQuantities(initialQuantities);
  };

  const handleQuantityChange = (productId, action) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (action === "increment") {
        newQuantities[productId] = Math.min(
          newQuantities[productId] + 1,
          products.find((p) => p.id === productId).quantity // Limit by available quantity
        );
      } else if (action === "decrement") {
        newQuantities[productId] = Math.max(newQuantities[productId] - 1, 1);
      }
      return newQuantities;
    });
  };

  const handleOrderClick = (productId) => {
    const quantity = quantities[productId];
    navigate(`/buyer/order/${productId}?quantity=${quantity}`);
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id];
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8383/api/buyer/cart",
        {
          product_id: product.id,
          quantity: quantity,
          price: product.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart((prevCart) => [...prevCart, response.data.cartItem]);
      alert(
        `${product.name} (Quantity: ${quantity}) has been added to your cart.`
      );
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const showMoreProducts = () => {
    setLimit((prevLimit) => prevLimit + 8);
    setDisplayedProducts(products.slice(0, limit + 8));
  };

  const hideProducts = () => {
    setLimit(8);
    setDisplayedProducts(products.slice(0, 8));
  };

  return (
    <div className="buyer-main-container">
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
          <button className="cart-button" onClick={() => navigate("/cart")}>
            Cart ({cart.length})
          </button>
          <button
            className="account-button"
            onClick={() => navigate("/buyer-account")}
          >
            My account
          </button>
          <button
            className="account-button"
            onClick={() => navigate("/buyer-order")}
          >
            Orders
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="mainsss">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              className="category-card"
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon">
                {category.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>

        <h2>Available Products</h2>
        <div className="products-grid">
          {displayedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={`http://localhost:8383/${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>
                Available: {product.quantity} {product.unit_of_measure}
              </p>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product.id, "decrement")}
                >
                  -
                </button>
                <span>{quantities[product.id]}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product.id, "increment")}
                >
                  +
                </button>
              </div>
              <button onClick={() => handleOrderClick(product.id)}>
                Order Now
              </button>
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        {products.length > 10 && (
          <div className="pagination-buttons">
            {limit < products.length && (
              <button className="show-more-button" onClick={showMoreProducts}>
                Show More
              </button>
            )}
            {limit > 10 && (
              <button className="hide-button" onClick={hideProducts}>
                Hide
              </button>
            )}
          </div>
        )}
        <h2>Recommendations</h2>
        <div className="recommendation-grid">
          {recommendedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={`http://localhost:8383/${product.images[0]}`}
                alt={product.name}
                className="recommendation-image"
              />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <button onClick={() => handleOrderClick(product.id)}>
                Order Now
              </button>
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerMain;
