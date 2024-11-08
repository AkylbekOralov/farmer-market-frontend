import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Registration.css";

// Farmer Registration Form
const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    farmAddress: "",
    farmSize: "",
    cropTypes: [], // Updated to an array to store multiple selections
    iin: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle multiple selections for cropTypes
    if (name === "cropTypes") {
      const updatedCropTypes = checked
        ? [...formData.cropTypes, value] // Add selected crop
        : formData.cropTypes.filter((crop) => crop !== value); // Remove unselected crop
      setFormData({ ...formData, cropTypes: updatedCropTypes });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8383/farmer-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          deliveryAddress: "",
          paymentMethod: "",
        }); // Clear form fields on success
        alert("Registration successful!");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration");
    }
  };
  const [showCropOptions, setShowCropOptions] = useState(false);
  const cropOptions = [
    { name: "Wheat", icon: "🌾" },
    { name: "Corn", icon: "🌽" },
    { name: "Rice", icon: "🍚" },
    { name: "Soybeans", icon: "🌱" },
    { name: "Barley", icon: "🌾" },
    { name: "Cotton", icon: "🧵" },
    { name: "Sunflower", icon: "🌻" },
    { name: "Sugarcane", icon: "🍬" },
    { name: "Potatoes", icon: "🥔" },
    { name: "Tomatoes", icon: "🍅" },
    { name: "Onions", icon: "🧅" },
    { name: "Apples", icon: "🍏" },
    { name: "Grapes", icon: "🍇" },
    { name: "Oranges", icon: "🍊" },
    { name: "Bananas", icon: "🍌" }
  ];
  
  
  const handleAddCrop = (crop) => {
    if (!formData.cropTypes.some((c) => c.name === crop.name)) {
      setFormData({
        ...formData,
        cropTypes: [...formData.cropTypes, crop]
      });
    }
    setShowCropOptions(false); // Hide options after selection
  };
  

  return (
    <>
   

<div className="container">
  
  

   
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        required
        value={formData.name}
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
        name="farmAddress"
        placeholder="Farm Address"
        required
        value={formData.farmAddress}
        onChange={handleChange}
      />
      <input
        name="farmSize"
        placeholder="Farm Size (in acres)"
        required
        value={formData.farmSize}
        onChange={handleChange}
      />
<label className="crop-label">Types of Crops</label>
<div className="crop-types-list">
  {formData.cropTypes.map((crop, index) => (
    <div key={index} className="crop-tag">
      {crop.icon} {crop.name}
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
        onClick={() => handleAddCrop(crop)}
      >
        {crop.icon} {crop.name}
      </div>
    ))}
  </div>
)}







         {/* <label className="crop-label">Types of Crops</label>
          <div className="crop-types-container">
          <div className="crop-types-list">
            {formData.cropTypes.map((crop, index) => (
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
          </div> */}
          {/* {showCropOptions && (
            <div className="crop-options">
              {cropOptions.map((crop, index) => (
                <div
                  key={index}
                  className="crop-option"
                  onClick={() => handleAddCrop(crop)}
                >
                  {crop}
                </div>
              ))}
            </div>
          )}
        </div> */}
      
      <input
        name="iin"
        placeholder="IIN"
        required
        value={formData.iin}
        onChange={handleChange}
      />
      <input
  name="password"
  type={showPassword ? "text" : "password"} // Toggles type based on showPassword
  className="password-input"
  placeholder="Password"
  required
  value={formData.password}
  onChange={handleChange}
/>
      <button type="submit">Register</button>
    </form>
    </div>
    </>
  );
};

// Buyer Registration Form
const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
  email: "",
  phone: "",
  deliveryAddress: "",
  paymentMethod: "",
  cardNumber: "",
  securityCode: "",
  expireMonth: "",
  expireYear: "",
  nameOnCard: "",
  password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8383/buyer-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          deliveryAddress: "",
          paymentMethod: "",
        }); // Clear form fields on success
        alert("Registration successful!");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration");
    }
  };

  const paymentOptions = ["Credit Card", "PayPal", "Bank Transfer"];

  return (
    <div className="container">
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        required
        value={formData.name}
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
        name="deliveryAddress"
        placeholder="Delivery Address"
        required
        value={formData.deliveryAddress}
        onChange={handleChange}
      />
      <div>
        {/* <label>Payment Method:</label>
        {paymentOptions.map((method, index) => (
          <label key={index}>
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={formData.paymentMethod === method}
              onChange={handleChange}
              required
            />
            {method}
          </label>
        ))} */}

<div>
  <label>Payment Information</label>
  <input
    name="cardNumber"
    placeholder="Card Number"
    required
    value={formData.cardNumber}
    onChange={handleChange}
  />
  <input
    name="securityCode"
    placeholder="Security Code"
    required
    value={formData.securityCode}
    onChange={handleChange}
  />
  <div>
    <input
      name="expireMonth"
      placeholder="Expire month"
      required
      value={formData.expireMonth}
      onChange={handleChange}
    />
    <input
      name="expireYear"
      placeholder="Expire year"
      required
      value={formData.expireYear}
      onChange={handleChange}
    />
  </div>
  <input
    name="nameOnCard"
    placeholder="Name on Card"
    required
    value={formData.nameOnCard}
    onChange={handleChange}
  />
</div>

      </div>
      
      <input
  name="password"
  type={showPassword ? "text" : "password"} // Toggles type based on showPassword
  className="password-input"
  placeholder="Password"
  required
  value={formData.password}
  onChange={handleChange}
/>

      <button type="submit">Register</button>
    </form>
    </div>
  );
};

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
