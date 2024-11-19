import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Registration.css";

// Farmer Registration Form
const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    farm_address: "",
    role: "farmer",
    farm_size: "",
    types_of_crops: [],
    iin: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCropOptions, setShowCropOptions] = useState(false);
  const [cropOptions, setCropOptions] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch crop options from the backend
  useEffect(() => {
    const fetchCropOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8383/api/public/categories"
        );
        if (response.ok) {
          const data = await response.json();
          setCropOptions(data.categories);
        } else {
          setErrors("Failed to fetch crop options");
        }
      } catch (error) {
        setErrors("An error occurred while fetching crop options.");
      }
    };

    fetchCropOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddCrop = (crop) => {
    if (!formData.types_of_crops.includes(crop)) {
      setFormData({
        ...formData,
        types_of_crops: [...formData.types_of_crops, crop],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8383/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          phone: "",
          farm_address: "",
          role: "farmer",
          farm_size: "",
          types_of_crops: [],
          iin: "",
          password: "",
        });
        setSuccess(true);
      } else {
        setErrors(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrors("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Farmer Registration</h1>
      {errors && <p className="error-message">{errors}</p>}
      {success && <p className="success-message">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Name"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="farm_address"
          placeholder="Farm Address"
          required
          value={formData.farm_address}
          onChange={handleChange}
        />
        <input
          name="farm_size"
          placeholder="Farm Size (in acres)"
          required
          value={formData.farm_size}
          onChange={handleChange}
        />
        <label className="crop-label">Types of Crops</label>
        <div className="crop-types-list">
          {formData.types_of_crops.map((crop, index) => (
            <div key={index} className="crop-tag">
              {crop}
            </div>
          ))}
          <button
            type="button"
            className="add-crop-button"
            onClick={() => setShowCropOptions(!showCropOptions)}
          >
            +
          </button>
        </div>
        {showCropOptions && (
          <div className="crop-options">
            {cropOptions.map((crop, index) => (
              <div
                key={index}
                className="crop-option"
                onClick={() => handleAddCrop(crop.name)}
              >
                {crop.name}
              </div>
            ))}
          </div>
        )}
        <input
          name="iin"
          placeholder="IIN"
          required
          value={formData.iin}
          onChange={handleChange}
        />
        <div>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

// Buyer Registration Form
const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    delivery_address: "",
    role: "buyer",
    card_number: "",
    expire_date: "",
    owner_name: "",
    cvc: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8383/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          phone: "",
          delivery_address: "",
          role: "buyer",
          card_number: "",
          expire_date: "",
          owner_name: "",
          cvc: "",
          password: "",
        });
        setSuccess(true);
      } else {
        setErrors(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrors("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Buyer Registration</h1>
      {errors && <p className="error-message">{errors}</p>}
      {success && <p className="success-message">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Name"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="delivery_address"
          placeholder="Delivery Address"
          required
          value={formData.delivery_address}
          onChange={handleChange}
        />
        <input
          name="card_number"
          placeholder="Card Number"
          required
          value={formData.card_number}
          onChange={handleChange}
        />
        <input
          name="expire_date"
          placeholder="Expiry Date (YYYY-MM-DD)"
          required
          value={formData.expire_date}
          onChange={handleChange}
        />
        <input
          name="owner_name"
          placeholder="Cardholder Name"
          required
          value={formData.owner_name}
          onChange={handleChange}
        />
        <input
          name="cvc"
          placeholder="CVC"
          required
          value={formData.cvc}
          onChange={handleChange}
        />
        <div>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

// Register Interface
// Register Interface
const Register = () => {
  const [buyerReg, setBuyerReg] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className="icon-wrapper">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="farm-icon"
        />
      </div>
      <h1 className="title">FARMER MARKET</h1>
      <div className="options">
        <div
          className={buyerReg ? "btn active" : "btn"}
          onClick={() => setBuyerReg(true)}
        >
          Buyer
        </div>
        <div
          className={!buyerReg ? "btn active" : "btn"}
          onClick={() => setBuyerReg(false)}
        >
          Farmer
        </div>
      </div>

      {buyerReg ? (
        <BuyerRegister></BuyerRegister>
      ) : (
        <FarmerRegister></FarmerRegister>
      )}

      <div className="btn reg-btn" onClick={() => navigate("/")}>
        Login
      </div>
    </>
  );
};

export default Register;
