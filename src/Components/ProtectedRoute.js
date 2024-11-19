// components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  if (role && auth.role !== role) {
    // Redirect to a 403 page if the user doesn't have the required role
    return <Navigate to="/403" />;
  }

  return children;
};

export default ProtectedRoute;
