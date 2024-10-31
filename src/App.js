import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import Register from "./Components/Register";
import BuyerMain from "./Components/BuyerMain";
import FarmerMain from "./Components/FarmerMain";
import AdminMain from "./Components/AdminMain";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buyer-main" element={<BuyerMain />} />
        <Route path="/farmer-main" element={<FarmerMain />} />
        <Route path="/admin-main" element={<AdminMain />} />
      </Routes>
    </Router>
  );
}

export default App;
