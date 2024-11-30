// Components/Farmer/EditProduct.js
import React, { useState, useEffect } from "react";
import "../../Styles/Farmer/EditProduct.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import plus from "../../Assets/add_photo_alternate_outlined.svg";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // Fetch product details and categories
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch product details
        const productResponse = await axios.get(
          `http://localhost:8383/api/farmer/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductData(productResponse.data.product);

        // Fetch categories
        const profileResponse = await axios.get(
          "http://localhost:8383/api/farmer/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(profileResponse.data.crops || []);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", productData.name);
    data.append("description", productData.description);
    data.append("category", productData.category);
    data.append("price", productData.price);
    data.append("quantity", productData.quantity);
    data.append("unit_of_measure", productData.unit_of_measure);

    // Append new images
    Array.from(newImages).forEach((file) => data.append("newImages", file));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8383/api/farmer/product/${productId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product updated successfully!");
      navigate("/prodlist");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleDeleteImage = async (imagePath) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8383/api/farmer/product/${productId}/image`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imagePath },
        }
      );
      // Remove the deleted image from the product data
      setProductData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((img) => img !== imagePath),
      }));
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-product-container">
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
            onClick={() => navigate("/farmer-account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>
      <h1>Edit Product</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        {/* Form content divided into two columns */}
        <div className="form-content">
          {/* Left Column */}
          <div className="form-left">
            <label>Product Images</label>

            {/* Existing Images */}
            <div className="existing-images">
              {productData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={`http://localhost:8383/${image}`}
                    alt={`Product ${index}`}
                  />
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={() => handleDeleteImage(image)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Upload New Images */}
            <label htmlFor="file-upload" className="custom-file-upload">
              <img src={plus} alt="Upload Icon" />
            </label>
            <input
              id="file-upload"
              type="file"
              name="newImages"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

            {/* Display Previews of New Images */}
            {newImages.length > 0 && (
              <div className="image-preview">
                {Array.from(newImages).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="form-right">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name || ""}
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              value={productData.description || ""}
              onChange={handleChange}
            />

            <label>Category</label>
            <select
              name="category"
              value={productData.category || ""}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label>Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={productData.price || ""}
              onChange={handleChange}
            />

            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity || ""}
              onChange={handleChange}
            />

            <label>Unit of Measure</label>
            <input
              type="text"
              name="unit_of_measure"
              value={productData.unit_of_measure || ""}
              onChange={handleChange}
            />

            {/* Save Button */}
            <button className="save-button" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
