// Components/Report.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Report.css";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/report.json")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="report-container">
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
          <button
            className="account-button"
            onClick={() => navigate("/account")}
          >
            My account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log out
          </button>
        </div>
      </div>
      <h1>Reports & Analytics</h1>

      {/* Main content layout */}
      <div className="main-content">
        {/* Best-selling products */}
        <div className="best-selling">
          <h2>Best-selling products this week</h2>
          <div className="product-carousel">
            {data.best_selling_products.map((product, index) => (
              <div key={index} className="product">
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Income graph */}
        <div className="income-graph">
          <h2>Income this week</h2>
          <div>
            <svg width="200" height="100">
              {data.income_this_week.map((point, index, arr) => {
                if (index === 0) return null;
                const prev = arr[index - 1];
                return (
                  <line
                    key={index}
                    x1={(index - 1) * 40}
                    y1={100 - prev.income / 100}
                    x2={index * 40}
                    y2={100 - point.income / 100}
                    stroke="blue"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Sales data table */}
      <div className="sales-data">
        <h2>Sales Data</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.sales_data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.period}</td>
                <td>{entry.units_sold}</td>
                <td>{entry.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download button */}
      <div className="download-button">
        <button onClick={() => (window.location.href = "/path/to/report.json")}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Report;
