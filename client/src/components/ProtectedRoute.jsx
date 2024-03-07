import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

export default function ProtectedRoute({children}) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
};
