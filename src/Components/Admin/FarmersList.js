import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../Styles/Admin/FarmersList.css";

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // State to track which farmers are being verified
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8383/api/admin/unverified-farmers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFarmers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    fetchFarmers();
  }, []);

  const handleVerify = async (id) => {
    setLoadingIds((prev) => [...prev, id]); // Add ID to loading list
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8383/api/admin/verify-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove the verified farmer from the list
      setFarmers((prevFarmers) =>
        prevFarmers.filter((farmer) => farmer.id !== id)
      );
    } catch (error) {
      console.error("Error verifying farmer:", error);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id)); // Remove ID from loading list
    }
  };

  return (
    <div className="farmer-list">
      <div className="header admin">
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
          <button onClick={() => navigate("/admin-main")}>Main</button>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <div className="listsss">
        <h2>Unverified Farmers</h2>
        {farmers.length === 0 ? (
          <p>No unverified farmers available.</p>
        ) : (
          <ul>
            {farmers.map((farmer) => (
              <li key={farmer.id}>
                <p>Username: {farmer.username}</p>
                <p>Email: {farmer.email}</p>
                <p>Phone: {farmer.phone}</p>
                {farmer.FarmersProfile ? (
                  <>
                    <p>Farm Address: {farmer.FarmersProfile.farm_address}</p>
                    <p>Farm Size: {farmer.FarmersProfile.farm_size}</p>
                    <p>
                      Types of Crops:{" "}
                      {farmer.FarmersProfile.types_of_crops?.join(", ")}
                    </p>
                    <p>IIN: {farmer.FarmersProfile.iin}</p>
                  </>
                ) : (
                  <p>No Farmers Profile available.</p>
                )}
                <button
                  className="verify"
                  onClick={() => handleVerify(farmer.id)}
                  disabled={loadingIds.includes(farmer.id)} // Disable button if loading
                >
                  {loadingIds.includes(farmer.id) ? (
                    <span className="loader"></span>
                  ) : (
                    "Verify"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FarmersList;
