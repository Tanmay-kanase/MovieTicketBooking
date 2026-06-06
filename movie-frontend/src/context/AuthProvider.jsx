import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../config/axiosConfig";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("movieUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("movieUser", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axiosInstance.post(
        "/api/users/logout",
        {},
        {
          withCredentials: true,
        },
      );
      console.log("Cookie destroyed on backend");
    } catch (error) {
      console.error(
        "Backend logout failed, but clearing local state anyway.",
        error,
      );
    } finally {
      setUser(null);
      localStorage.removeItem("movieUser");
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
