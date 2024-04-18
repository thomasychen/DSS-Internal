import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state for profile picture

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('auth/session-status', { withCredentials: true });
        if (response.data.status === "active") {
          setIsLoggedIn(true);
          setProfile(response.data.userEmail);
          setProfilePic(response.data.userPicture); // Assuming userPicture is part of session status response
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
        setProfile(response.data.userEmail);
        setProfilePic(response.data.userPicture); // Update profile picture
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
    setProfilePic(""); // Clear profile picture
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, profile, profilePic, login, logout, isLoggingIn, setIsLoggingIn }}>
      {children}
    </AuthContext.Provider>
  );
};