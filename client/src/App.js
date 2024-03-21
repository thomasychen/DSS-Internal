import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import HomeDirectory from "./pages/HomeDirectory";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthProvider from "./context/AuthContext";
import PersonalPage from "./pages/PersonalPage"; // Import PersonalPage component

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personal/:id" // Update path to include ':id' parameter
              element={
                <ProtectedRoute>
                  <PersonalPage />
                </ProtectedRoute>
              }
            />{" "}
            {/* Add route for personal pages */}
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
