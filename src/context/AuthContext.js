import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token && role) {
        try {
          const response = await fetch(
            "http://localhost:8383/api/auth/validate-token",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setAuth({ isAuthenticated: true, role, token });
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setAuth({ isAuthenticated: false, role: null, token: null });
          }
        } catch (error) {
          console.error("Token validation error:", error);
        }
      }

      setIsLoading(false); // Set loading to false after initialization
    };

    initializeAuth();
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
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
