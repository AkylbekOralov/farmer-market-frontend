import "../../Styles/Farmer/FarmerMain.css";
import { useNavigate } from "react-router-dom";
import icon from "../../Assets/farm 1.png";

const FarmerMain = ({ name }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src={icon} alt="Farmer Logo" />
        </div>
        <nav className="dashboard-nav">
          <button className="account-button">
            <i className="icon-envelope"></i> My account
          </button>
          <button className="logout-button">Log out</button>
        </nav>
      </header>

      <main className="dashboard-main">
        <h1 className="welcome-message">Welcome back, {name}</h1>
        <div className="dashboard-buttons">
          <button className="dashboard-button">Product Listing</button>
          <button className="dashboard-button">Reports & Analytics</button>
          <button className="dashboard-button">Inventory</button>
          <button className="dashboard-button">View Orders</button>
        </div>
      </main>

      <footer className="dashboard-footer">
        <button className="chat-button">
          <i className="icon-chat"></i> Chat
        </button>
      </footer>
    </div>
  );
};

export default FarmerMain;
