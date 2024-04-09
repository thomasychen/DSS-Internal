import React from "react";
// import { useAuth } from "../context/AuthContext";
import DSSLogo from "../assets/dsslogo.png";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

export default function NavBar({logout}) {

    return (
        <AppBar position="static" style={{ backgroundColor: "#8CD6D1" }}>
        <Toolbar>
        <Link
            // key={person.id} // Assuming 'id' is the field name for record ID
            to={{
              pathname: `/`, // Pass record ID as part of the URL
            }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src={DSSLogo} alt="DSS Logo" height="50" />
          </IconButton>
          </Link>
          <div style={{ flexGrow: 1 }}></div>
          <Button color="inherit" onClick={logout}>
            Logout <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>
    )

}
