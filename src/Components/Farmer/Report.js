// Components/Farmer/Report.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Farmer/Report.css";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [allTime, setAllTime] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    { value: "", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [{ value: "", label: "All Years" }];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    years.push({ value: y.toString(), label: y.toString() });
  }

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {};

      if (!allTime) {
        if (year) params.year = year;
        if (month) params.month = month;
      }

      const response = await axios.get(
        "http://localhost:8383/api/farmer/reports",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: params,
        }
      );
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError("Failed to fetch report data. Please try again.");
    }
  };

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line
  }, [month, year, allTime]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setAllTime(false);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setAllTime(false);
  };

  const handleAllTimeChange = () => {
    setMonth("");
    setYear("");
    setAllTime(true);
  };

  if (!data && !error) return <div>Loading...</div>;

  return (
    <div className="report-container">
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2548/2548670.png"
          alt="Farm Icon"
          className="main-logo"
        />
        <div className="right-section">
          <button
            className="account-button"
            onClick={() => navigate("/account")}
          >
            My Account
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            Log Out
          </button>
        </div>
      </div>
      <div className="report-content">
        <h1>Reports & Analytics</h1>

        {/* Date Selection */}
        <div className="date-selection">
          <button
            className={allTime ? "active" : ""}
            onClick={handleAllTimeChange}
          >
            All Time
          </button>
          <select value={month} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select value={year} onChange={handleYearChange}>
            {years.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
        </div>

        {/* Display Error if Any */}
        {error && <div className="error-message">{error}</div>}

        {/* Summary Section */}
        {data && (
          <div className="summary">
            <h2>Summary</h2>
            <p>Total Revenue: ${data.totalRevenue.toFixed(2)}</p>
            <p>Total Units Sold: {data.totalUnitsSold}</p>
            <p>Total Orders: {data.totalOrders}</p>
          </div>
        )}

        {/* Best-selling products */}
        <div className="best-selling">
          <h2>Best-selling Products</h2>
          {data &&
          data.bestSellingProducts &&
          data.bestSellingProducts.length > 0 ? (
            <div className="product-carousel">
              {data.bestSellingProducts.map((product, index) => (
                <div key={index} className="product">
                  <img src={product.image} alt={product.name} />
                  <p>{product.name}</p>
                  <p>Total Sold: {product.totalQuantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No sales data available for the selected period.</p>
          )}
        </div>

        {/* Download button */}
        <div className="download-button">
          <button
            onClick={() => {
              // Implement download functionality
              const token = localStorage.getItem("token");
              axios
                .get("http://localhost:8383/api/farmer/reports/download", {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "report.csv");
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                })
                .catch((error) => {
                  console.error("Error downloading report:", error);
                  alert("Failed to download report. Please try again.");
                });
            }}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
