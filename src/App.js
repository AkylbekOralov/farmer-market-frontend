// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./Components/Login";
import BuyerMain from "./Components/Buyer/BuyerMain";
import FarmerMain from "./Components/FarmerMain";
import AdminMain from "./Components/AdminMain";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/buyer-main"
            element={
              <ProtectedRoute role="buyer">
                <BuyerMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer-main"
            element={
              <ProtectedRoute role="farmer">
                <FarmerMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-main"
            element={
              <ProtectedRoute role="admin">
                <AdminMain />
              </ProtectedRoute>
            }
          />
          <Route path="/403" element={<h1>403 - Forbidden</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
