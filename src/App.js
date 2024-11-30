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
import AdminReg from "./Components/AdminReg";

//Farmer
import FarmerMain from "./Components/Farmer/FarmerMain";
import ProdList from "./Components/Farmer/prodlist";
import Report from "./Components/Farmer/Report";
import Inventory from "./Components/Farmer/Inv";
import Order from "./Components/Farmer/Order";
import Account from "./Components/Farmer/Account";
import AddProduct from "./Components/Farmer/AddProduct";
import EditProduct from "./Components/Farmer/EditProduct";

// Buyer
import BuyerMain from "./Components/Buyer/BuyerMain";
import Account1 from "./Components/Buyer/Account1";
import Cart from "./Components/Buyer/Cart";
import BuyerOrder from "./Components/Buyer/Order";
import OrderDetails from "./Components/Buyer/OrderDetails";
import CategoryProducts from "./Components/Buyer/CategoryProducts";

// Admin
import AdminMain from "./Components/Admin/AdminMain";
import FarmersList from "./Components/Admin/FarmersList";
import Category from "./Components/Admin/Category";

import "./Styles/Header.css";

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
        <Route path="/admin-reg" element={<AdminReg />} />
        {/* Farmer Routes */}
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
          path="/farmer-account"
          element={
            <ProtectedRoute role="farmer">
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute role="farmer">
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-product/:productId"
          element={
            <ProtectedRoute role="farmer">
              <EditProduct />
            </ProtectedRoute>
          }
        />
        {/* Buyer Routes */}
        <Route
          path="/buyer-main"
          element={
            <ProtectedRoute role="buyer">
              <BuyerMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer-account"
          element={
            <ProtectedRoute role="buyer">
              <Account1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="buyer">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer-order"
          element={
            <ProtectedRoute role="buyer">
              <BuyerOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute role="buyer">
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/categories/:categoryId/products"
          element={
            <ProtectedRoute role="buyer">
              <CategoryProducts />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-main"
          element={
            <ProtectedRoute role="admin">
              <AdminMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers-list"
          element={
            <ProtectedRoute role="admin">
              <FarmersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category-control"
          element={
            <ProtectedRoute role="admin">
              <Category />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
