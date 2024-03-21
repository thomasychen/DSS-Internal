import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PersonalPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/get-personal-data-with-friends?person_id=${id}`
        );
        setPerson(response.data);
      } catch (error) {
        console.error("Error fetching personal data: ", error);
      }
    };

    fetchData();
  }, [id]);

  if (!person) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundColor: "#8CD6D1",
          color: "white",
          padding: "10px",
          textAlign: "center",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h1>Personal Page</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          margin: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            padding: "10px",
            width: "626px",
            height: "717px",
            overflowY: "auto",
          }}
        >
          <p>This is a placeholder chatbot UI</p>
          <p>Messages and interactions will be added later</p>
        </div>
        <div
          style={{
            position: "absolute",
            top: "212px",
            left: "712px",
            width: "250px",
            height: "250px",
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "absolute",
            top: "212px",
            left: "982px",
          }}
        >
          <h2>{person.name}</h2>
          <p>Email: {person.email}</p>
          <p>Major: {person.major}</p>
          <p>House: {person.house}</p>
          <p>Position: {person.current_position}</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            position: "absolute",
            top: "545px",
            left: "712px",
          }}
        >
          {person.closest_friends.map((friend, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",
                padding: "10px",
                width: "325px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginRight: "20px",
                  }}
                >
                  <img
                    src={friend.image}
                    alt={friend.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <h3>{friend.name}</h3>
                  <p>{friend.email}</p>
                </div>
              </div>
              <p>{friend.position}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#8CD6D1",
          color: "white",
          borderRadius: "10px",
          padding: "10px",
          width: "600px",
          position: "absolute",
          left: "29px",
          top: "213px",
        }}
      >
        Message DSS-GPT
      </div>
    </div>
  );
}
