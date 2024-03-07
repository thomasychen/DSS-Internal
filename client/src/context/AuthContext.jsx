import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('auth/session-status', { withCredentials: true });
        if (response.data.status === "active") {
          setIsLoggedIn(true);
          console.log(response.data.userEmail);
          setProfile(response.data.userEmail);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (token) => {
    try {
      const response = await axios.post('auth/verify-google-token', { token: token });
      if (response.data.success && response.data.emailValid) {
        setIsLoggedIn(true);
        setProfile(response.data.userEmail); // Make sure to adjust this line if the backend response structure is different
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    await axios.post('auth/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};