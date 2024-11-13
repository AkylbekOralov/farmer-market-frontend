// Components/AddProduct.js
import React from 'react';
import '../Styles/AddProduct.css'; // Adjust the path as needed
import { useNavigate } from "react-router-dom";




const AddProduct = () => {
    const navigate = useNavigate();
  return (
    <div className="add-product-container">
      {/* Header Section */}
      <div className="header">
        <img src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png" alt="Farm Icon" className="main-logo" />
        <div className="right-section">
          <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Mail Icon" className="mail-icon" />
          <button className="account-button" onClick={() => navigate('/account')}>My account</button> 
          <button className="logout-button" onClick={() => navigate('/')}>Log out</button>
        </div>
      </div>

      {/* Main content */}
      <h1>Add New Product</h1>
      <div className="product-form">
        <div className="image-upload">
          <div className="image-placeholder">Add photo</div>
        </div>
        <div className="form-fields">
          <label>Product name</label>
          <input type="text" />
          <label>Description</label>
          <input type="text" />
          <label>Category</label>
          <input type="text" />
          <label>Price</label>
          <input type="text" />
          <label>Status</label>
          <input type="text" />
          <label>Quantity</label>
          <input type="text" />
          <button className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
