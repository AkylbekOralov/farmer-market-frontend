import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/BuyerMain.css";
import AuthContext from "../../context/AuthContext";

const BuyerMain = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]); // For pagination
  const [categories, setCategories] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { logout } = useContext(AuthContext);

  const [limit, setLimit] = useState(8); // Number of products to display

  useEffect(() => {
    const fetchRecommendations = () => {
      if (products.length > 0) {
        const randomSelection = products
          .sort(() => 0.5 - Math.random())
          .slice(0, 3); // Select 3 random products
        setRecommendedProducts(randomSelection);
      }
    };

    fetchRecommendations();
  }, [products]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch categories
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

  // Fetch products when the component mounts
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
        setDisplayedProducts(data.slice(0, 8)); // Initially display first 10 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleOrderClick = (productId) => {
    navigate(`/buyer/order/${productId}`);
  };

  const showMoreProducts = () => {
    setLimit((prevLimit) => prevLimit + 8); // Increase the limit by 10
    setDisplayedProducts(products.slice(0, limit + 10));
  };

  const hideProducts = () => {
    setLimit(8); // Reset the limit to 10
    setDisplayedProducts(products.slice(0, 8));
  };

  return (
    <div className="buyer-main-container">
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
          <button className="cart-button" onClick={() => navigate("/cart")}>
            Cart ({cart.length})
          </button>
          <button
            className="account-button"
            onClick={() => navigate("/buyer-account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

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
            <p>Category: {product.category?.name || "Uncategorized"}</p>
            <button onClick={() => handleOrderClick(product.id)}>
              Order Now
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
          <div className="recommendation-card" key={product.id}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerMain;
