import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // assuming you want a logout icon
import {Link} from "react-router-dom";
// import DSSLogo from './assets/dss-logo.svg'; // assuming you have a logo image

export default function HomeDirectory() {
  const { isLoggedIn, isLoading, logout, profile } = useAuth();
  const [people, setPeople] = useState([]);
  const exampleResponseData = [
    {
      photo: "https://example.com/path/to/photo1.jpg",
      name: "Preetha Kumar",
      currentPosition: "President",
      email: "preetha.kumar@example.edu"
    },
    {
      photo: "https://example.com/path/to/photo2.jpg",
      name: "Thomas Chen",
      currentPosition: "Internal VP",
      email: "thomas.chen@example.edu"
    },
    {
      photo: "https://example.com/path/to/photo3.jpg",
      name: "James Geronimo",
      currentPosition: "Director of AcadDev",
      email: "james.geronimo@example.edu"
    },
    // ... more person objects
  ];

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        // const response = await axios.get('api/all-cards');
        setPeople(exampleResponseData); // assuming the API returns an array of people
      } catch (error) {
        console.error('Error fetching data: ', error);
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
    <div>
      <AppBar position="static">
            <Toolbar>
              <Link to="/" style={{ flexGrow: 1 }}>
                <IconButton edge="start" color="inherit" aria-label="logo">
                  <img src="exampleurl.com" alt="DSS Logo" height="50" />
                </IconButton>
              </Link>
              <Button color="inherit" onClick={logout}>
                Logout <LogoutIcon />
              </Button>
            </Toolbar>
      </AppBar>
      <p>Hi, you made it {profile}</p>
      {/* <button onClick={logout}>Logout</button> */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {people.map(person => (
          <Card key={person.email} style={{ width: 345, margin: '16px' }}>
            <CardMedia
              component="img"
              height="140"
              image={person.photo}
              alt={person.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {person.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {person.currentPosition}
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
