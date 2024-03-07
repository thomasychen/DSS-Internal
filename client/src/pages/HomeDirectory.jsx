import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

export default function HomeDirectory() {
  const { isLoggedIn, isLoading, logout , profile} = useAuth(); // Destructure the logout function from useAuth
  console.log(isLoggedIn);
  return (
    <div>
      <p>Hi, you made it {profile}</p>
      <button onClick={logout}>Logout</button> {/* Use the logout function on button click */}
    </div>
  );
}
