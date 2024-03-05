import {React, useState, useEffect} from 'react';
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomeDirectory from "./pages/HomeDirectory";
import axios from 'axios';

const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('auth/session-status', { withCredentials: true });
        setIsLoggedIn((response.data.status === "active")); 
        setProfile(response.data.userEmail);// Adjust according to actual response
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  return { isLoggedIn, isLoading, profile };
};


function App() {

  const { isLoggedIn, isLoading, profile} = useAuthStatus();

  function ProtectedRoute({ children }) {
    if (isLoading) return <div>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/login" />;

    return children;
  }


  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeDirectory userEmail={profile} />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/person/:id" element={<PrivateRoute><PersonPage /></PrivateRoute>} /> */}
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;