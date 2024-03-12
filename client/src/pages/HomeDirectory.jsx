import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // assuming you want a logout icon
import {Link} from "react-router-dom";
import axios from 'axios';
// import DSSLogo from './assets/dss-logo.svg'; // assuming you have a logo image

export default function HomeDirectory() {
  const { isLoggedIn, isLoading, logout, profile } = useAuth();
  const [people, setPeople] = useState([]);
 

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get('api/get-data');
        setPeople(response.data); // assuming the API returns an array of people
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
          <Card key={person.name} style={{ width: 345, margin: '16px' }}>
            <CardMedia
              component="img"
              height="320"
              image={person.image}
              alt={person.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {person.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {person.position}
              </Typography>
              {/* <Typography variant="body2" color="text.primary">
                {person.name}
              </Typography> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
