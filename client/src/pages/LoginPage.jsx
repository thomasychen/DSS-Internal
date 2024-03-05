import { React } from 'react';
// import { ReactComponent as GoogleIcon } from './google-icon.svg'; // Assuming you have an SVG icon
import '../styles/LoginPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import dssLogo from '../assets/dss_logo.png';

function LoginPage() {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    // Send token to the backend
    axios.post('auth/verify-google-token', {
      token: response.credential
    })
    .then(response => {
      const data = response.data;
      // If login is successful and email is valid, redirect to HomeDirectory
      if (data.success && data.emailValid) {
        navigate("/")
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  return (
    <div className="pageWrapper">
      <div className="leftColumn">
        <div className="welcomeText">Welcome to Data Science Society</div>
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={responseGoogle}
        />
      </div>
      <div className="rightColumn">
        <img src={dssLogo} alt="Data Science Society Logo" style={{ width: 'auto', height: 'auto' }} />
      </div>
    </div>
  );
};

export default LoginPage;