import React, { useState, useEffect } from "react";
import "../../Styles/AddProduct.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const [categories, setCategories] = useState([]); // Categories fetched from the profile
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    unit_of_measure: "kg",
    productImages: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch farmer profile
        const profileResponse = await axios.get(
          "http://localhost:8383/api/farmer/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Pre-select crops from the profile
        setCategories(profileResponse.data.crops || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, productImages: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("unit_of_measure", formData.unit_of_measure);

    // Append each file to the FormData
    formData.productImages.forEach((file) =>
      data.append("productImages", file)
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8383/api/farmer/product", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product added successfully!");
      navigate("/prodlist"); // Redirect to product list
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="main-logo"
        />
        <div className="right-section">
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

      <h1>Add New Product</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-fields">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label>Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <label>Unit of Measure</label>
          <input
            type="text"
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
          />

          <label>Product Images</label>
          <input
            type="file"
            name="productImages"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <button className="save-button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
