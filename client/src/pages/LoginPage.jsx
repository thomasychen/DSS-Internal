import { React } from 'react';
// import { ReactComponent as GoogleIcon } from './google-icon.svg'; // Assuming you have an SVG icon
import '../styles/LoginPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; 
import dssLogo from '../assets/dss_logo.png';
import { useAuth } from '../context/AuthContext';
import LogoLoading from "../components/Loading";

function LoginPage() {
  const { login, isLoggingIn, setIsLoggingIn } = useAuth();
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    setIsLoggingIn(true);
    login(response.credential).then(() => {
      navigate("/");
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  if (isLoggingIn) {
    return <LogoLoading />;
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