import React from 'react';
import Button from '@mui/material/Button';
// import { ReactComponent as GoogleIcon } from './google-icon.svg'; // Assuming you have an SVG icon
import '../styles/HomePage.css';

const GoogleSignInButton = () => (
  <Button
    className="googleSignInButton"
    variant="contained"
    startIcon={<div></div>}
  >
    Sign in with Google
  </Button>
);

const HomePage = () => {
  return (
    <div className="pageWrapper">
      <div className="leftColumn">
        <div className="welcomeText">Welcome to Data Science Society</div>
        <GoogleSignInButton />
      </div>
      <div className="rightColumn">
        <img src="path_to_your_logo.png" alt="Data Science Society Logo" style={{ width: 'auto', height: 'auto' }} />
      </div>
    </div>
  );
};

export default HomePage;