// Components/Admin/FarmersList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const navigate = useNavigate();

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
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8383/api/admin/verify-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the farmers list after verification
      setFarmers((prevFarmers) =>
        prevFarmers.filter((farmer) => farmer.id !== id)
      );
    } catch (error) {
      console.error("Error verifying farmer:", error);
    }
  };

  return (
    <div>
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
              <button onClick={() => handleVerify(farmer.id)}>Verify</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/admin-main")}>Back to Main</button>
    </div>
  );
};

export default FarmersList;
