// Components/Register.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Registration.css";

// Farmer Registration Form
const FarmerRegister = () => {
  const navigate = useNavigate();
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

    if (loading) {
      // If already loading, do nothing
      return;
    }

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
        setShowCropOptions(false);
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

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <div className="show-pass">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Register"}
        </button>
      </form>
      {errors && <p className="error-message">{errors}!</p>}
      {success && (
        <div className="success-overlay">
          <div className="success-message">
            <p>
              Registration successful!
              <br />
              <br />
              <span>
                An email has been sent to your address for validation. Please
                confirm your email. After that, an admin will verify your
                profile. This process may take up to 2-3 days.
              </span>
            </p>
            <button onClick={() => navigate("/")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Buyer Registration Form
const BuyerRegister = () => {
  const navigate = useNavigate();
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

    if (loading) {
      // If already loading, do nothing
      return;
    }

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
          name="owner_name"
          placeholder="Cardholder Name"
          required
          value={formData.owner_name}
          onChange={handleChange}
        />
        <div className="card-info">
          <input
            name="expire_date"
            placeholder="Expiry Date (YYYY-MM-DD)"
            required
            value={formData.expire_date}
            onChange={handleChange}
          />
          <input
            name="cvc"
            placeholder="CVC"
            required
            value={formData.cvc}
            onChange={handleChange}
          />
        </div>

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <div className="show-pass">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Register"}
        </button>
      </form>
      {errors && <p className="error-message">{errors}!</p>}
      {success && (
        <div className="success-overlay">
          <div className="success-message">
            <p>
              Registration successful!
              <br />
              <br />
              <span>
                An email has been sent to your address for validation. Please
                confirm your email.
              </span>
            </p>

            <button onClick={() => navigate("/")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Register Interface
// Register Interface
const Register = () => {
  const [buyerReg, setBuyerReg] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="reg">
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

      <div className="btn log-btn" onClick={() => navigate("/")}>
        Already have an account? Log in
      </div>

      <div className="admin-reg" onClick={() => navigate("/admin-reg")}>
        If you are an admin. Here is the registration page for admin
      </div>
    </div>
  );
};

export default Register;
