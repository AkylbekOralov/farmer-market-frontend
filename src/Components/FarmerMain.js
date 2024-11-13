import React from 'react';
import '../Styles/FarmerMain.css';
import { useNavigate } from 'react-router-dom';

const FarmerMain = () => {
  const navigate = useNavigate();
  const handleProductListingClick = () => {
    navigate('/prodlist'); // This should match the route path in your router setup
  };
  const handleReportClick = () => {
    navigate('/report'); // This will navigate to the report page
  };
  const handleInventoryClick = () => {
    navigate('/inventory'); // This will navigate to the inventory page
  };
  const handleOrderClick = () => {
    navigate('/order'); // Navigate to the order page
  };
  return (
    
    <div className="container">
      {/* Header */}
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
        <button className="account-button" onClick={() => navigate('/account')}>My account</button> 
        <button className="logout-button" onClick={() => navigate('/')}>Log out</button>
    </div>
</div>

      {/* Welcome Message */}
      <h1 className="welcome-message">Welcome back, [name]</h1>

      {/* Button Grid */}
      <div className="button-grid">
      <button className="action-button" onClick={handleProductListingClick}>Product listing</button>
      <button className="action-button" onClick={handleReportClick}>Reports & Analytics</button>
      <button className="action-button" onClick={handleInventoryClick}>Inventory</button>
      <button className="action-button" onClick={handleOrderClick}>View Orders</button>
      </div>

      {/* Chat Button */}
      <div className="chat-button">Chat</div>
    </div>
  );
};

export default FarmerMain;
