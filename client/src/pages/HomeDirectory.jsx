import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // assuming you want a logout icon
import { Link } from "react-router-dom";
import axios from "axios";
import DSSLogo from "../assets/dsslogo.png"; // Corrected image import path

export default function HomeDirectory() {
  const { isLoggedIn, isLoading, logout, profile } = useAuth();
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get("api/get-data");
        setPeople(response.data); // assuming the API returns an array of people
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (isLoggedIn) {
      fetchPeople();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" style={{ backgroundColor: '#8CD6D1' }}>
        <Toolbar>
          <Link to="/" style={{ flexGrow: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img src={DSSLogo} alt="DSS Logo" height="50" />
            </IconButton>
          </Link>
          <Button color="inherit" onClick={logout}>
            Logout <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: 'center', alignItems: 'flex-start', margin: '0 auto'}}>
        {people.map((person) => (
          <Card
            key={person.name}
            style={{ width: 345, margin: "16px", borderRadius: "20px", backgroundColor: '#FAFAF5'}}
          >
            <CardMedia
              component="img"
              height="320"
              image={person.image}
              alt={person.name}
            />
            <CardContent style = {{padding: '16px'}}>
              <Typography gutterBottom variant="h5" component="div" style = {{fontWeight: 'bold', marginBottom: '0.35emm'}}>
                {person.name}
              </Typography>
              <Typography variant="h5" style={{ color: '#4B48C6', fontWeight: 'bold', marginBottom: '0.75em'}}>
              {person.position}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {person.email}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
