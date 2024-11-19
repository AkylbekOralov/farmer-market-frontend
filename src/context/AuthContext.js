// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null, // Possible roles: 'buyer', 'farmer', 'admin'
    token: null,
  });

  useEffect(() => {
    // Load token and role from localStorage on app start
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setAuth({ isAuthenticated: true, role, token });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setAuth({ isAuthenticated: true, role, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ isAuthenticated: false, role: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
