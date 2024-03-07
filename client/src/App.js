import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from "./pages/LoginPage";
import HomeDirectory from "./pages/HomeDirectory";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from './context/AuthContext'; // Import the AuthProvider

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider> {/* Wrap the Router in AuthProvider */}
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomeDirectory /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}