import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoLoading from "../components/Loading"; // Import the useAuth hook

export default function ProtectedRoute({children}) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LogoLoading/>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
};
