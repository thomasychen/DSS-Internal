import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoLoading from "../components/Loading";

function PublicRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LogoLoading/>; // Optionally, display a loading indicator while authentication status is being verified

  // If the user is logged in, redirect them to the home page instead of rendering the login page
  return isLoggedIn ? <Navigate to="/" /> : children;
};
export default PublicRoute;