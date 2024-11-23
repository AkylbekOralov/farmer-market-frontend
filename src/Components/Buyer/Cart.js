import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Buyer/Cart.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/buyer/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data.cart || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (cartId, action) => {
    const updatedItem = cartItems.find((item) => item.cart_id === cartId);

    if (!updatedItem) {
      console.error("Cart item not found.");
      return;
    }

    const newQuantity =
      action === "increment"
        ? Math.min(updatedItem.quantity + 1, updatedItem.product.quantity)
        : Math.max(updatedItem.quantity - 1, 1);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8383/api/buyer/cart/${cartId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state with the response data
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_id === cartId
            ? {
                ...item,
                quantity: newQuantity,
                price: response.data.cartItem.price,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8383/api/buyer/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="main-logo"
        />
        <div className="right-section">
          <button
            className="account-button"
            onClick={() => navigate("/buyer-account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Start shopping!</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="cart-item">
                <img
                  src={`http://localhost:8383/${item.product.images[0]}`}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>Price: ${item.product.price}</p>
                  <p>
                    Total: ${(item.quantity * item.product.price).toFixed(2)}
                  </p>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item.cart_id, "decrement")
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item.cart_id, "increment")
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.cart_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
