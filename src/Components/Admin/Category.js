// Components/Admin/Category.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/Admin/Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/admin/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8383/api/admin/category",
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories([...categories, response.data.data]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8383/api/admin/category/${editCategoryId}`,
        { name: editCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories(
        categories.map((category) =>
          category.id === editCategoryId ? response.data.data : category
        )
      );
      setEditCategoryId(null);
      setEditCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8383/api/admin/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="category-container">
      <h2>Manage Categories</h2>
      <div className="add-category">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <div className="category-list">
        <h3>Category List</h3>
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            {editCategoryId === category.id ? (
              <div className="edit-category">
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
                <button onClick={handleEditCategory}>Save</button>
                <button onClick={() => setEditCategoryId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p>{category.name}</p>
                <button
                  onClick={() => {
                    setEditCategoryId(category.id);
                    setEditCategoryName(category.name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
