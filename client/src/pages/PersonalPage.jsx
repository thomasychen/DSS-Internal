import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PersonalPage() {
  const { id } = useParams(); // Retrieve record ID from route parameters
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/get-personal-data?person_id=${id}`
        );
        setPerson(response.data);
      } catch (error) {
        console.error("Error fetching personal data: ", error);
      }
    };

    fetchData();
  }, [id]);

  if (!person) {
    return <div>Loading...</div>; // Add loading indicator
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <div>
        <h2>Name: {person.name}</h2>
        <p>Email: {person.email}</p>
      </div>
      <div
        style={{
          width: "345px", // Same width as in the home directory
          height: "345px", // Set height to match width for a square shape
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <img
          src={person.image}
          alt={person.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
