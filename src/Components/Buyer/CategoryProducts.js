// components/Buyer/CategoryProducts.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/Buyer/BuyerMain.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [cart, setCart] = useState([]);
  const { logout } = useContext(AuthContext);
  const [limit, setLimit] = useState(8);
  const [quantities, setQuantities] = useState({});

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8383/api/buyer/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8383/api/buyer/categories/${categoryId}/products`,
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

        if (data.length > 0) {
          setCategoryName(data[0].Category?.name || "");
        } else {
          setCategoryName("");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchCart();
  }, [categoryId]);

  const initializeQuantities = (products) => {
    const initialQuantities = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 0.5;
    });
    setQuantities(initialQuantities);
  };

  const handleQuantityChange = (productId, action) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (action === "increment") {
        newQuantities[productId] = Math.min(
          newQuantities[productId] + 0.5,
          products.find((p) => p.id === productId).quantity
        );
      } else if (action === "decrement") {
        newQuantities[productId] = Math.max(
          newQuantities[productId] - 0.5,
          0.5
        );
      }
      return newQuantities;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id];
    try {
      const token = localStorage.getItem("token");
      await axios.post(
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

      await fetchCart();
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
            onClick={() => navigate("/buyer-main")}
          >
            Main
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
        <h2>Products in Category: {categoryName}</h2>
        <div className="products-grid">
          {displayedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={`http://localhost:8383/${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
              <div className="product-content">
                <div className="name">{product.name}</div>
                <div className="boxes">
                  <div className="category">{product.Category?.name}</div>
                  <div className="quantity">
                    {product.quantity} {product.unit_of_measure} available
                  </div>
                </div>
                <div className="farmer-info">
                  {product.FarmersProfile?.User ? (
                    <>
                      <img
                        src={`http://localhost:8383/${product.FarmersProfile.User.profile_picture}`}
                        alt={product.FarmersProfile.User.username}
                        className="farmer-image"
                      />
                      <span>{product.FarmersProfile.User.username}</span>
                    </>
                  ) : (
                    <span>Farmer information not available</span>
                  )}
                </div>
                <div className="descrip">{product.description}</div>

                <div className="foot">
                  <div className="price">
                    <div>PRICE</div>
                    <div>
                      ${product.price} <span>/ {product.unit_of_measure}</span>
                    </div>
                  </div>
                  <div className="carttt">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(product.id, "decrement")
                        }
                      >
                        -
                      </button>
                      <span>
                        {quantities[product.id]} {product.unit_of_measure}
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(product.id, "increment")
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length > limit && (
          <div className="pagination-buttons">
            {limit < products.length && (
              <button className="show-more-button" onClick={showMoreProducts}>
                Show More
              </button>
            )}
            {limit > 8 && (
              <button className="hide-button" onClick={hideProducts}>
                Hide
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
