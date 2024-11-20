import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthContext from "./context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import FarmerMain from "./Components/Farmer/FarmerMain";
import ProdList from "./Components/Farmer/prodlist";
import Report from "./Components/Farmer/Report";
import Inventory from "./Components/Farmer/Inv";
import Order from "./Components/Farmer/Order";
import Account from "./Components/Farmer/Account";

const ProtectedRoute = ({ children, role }) => {
  const { auth, isLoading } = useContext(AuthContext);

  // Wait for auth state to load
  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  // If not authenticated, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If authenticated but role doesn't match, redirect to login
  if (auth.role !== role) {
    return <Navigate to="/" />;
  }

  // Render the protected component
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/farmer-main"
          element={
            <ProtectedRoute role="farmer">
              <FarmerMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodlist"
          element={
            <ProtectedRoute role="farmer">
              <ProdList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute role="farmer">
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute role="farmer">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute role="farmer">
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute role="farmer">
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
