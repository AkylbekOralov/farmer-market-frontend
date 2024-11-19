import React, { useState } from "react";
import "../../Styles/Farmer/AddInventory.css"; // Import CSS for styling
import icon from "../../Assets/farm 1.png";

const AddInventory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Creating FormData object
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);

    formData.images.forEach((image, index) => {
      data.append(`images[${index}]`, image);
    });

    // Submit form data to backend
    fetch("/api/products", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="add-inventory-container">
      <h1>Add New Inventory</h1>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <div className="image-upload">
          <label htmlFor="images">
            <div className="image-placeholder">
              {formData.images.length > 0 ? (
                <div className="image-previews">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="image-preview"
                    />
                  ))}
                </div>
              ) : (
                "Add photos"
              )}
            </div>
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            hidden
          />
        </div>
        <div className="form-fields">
          <label>Inventory Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="save-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddInventory;
