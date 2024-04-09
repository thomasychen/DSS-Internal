/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styled from '@emotion/styled';
import LogoLoading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

// Styled components using Emotion
const Container = styled.div`
  display: flex;
  height: 90vh;
`;

const ChatColumn = styled.div`
  flex-basis: 40%;
  background-color: #FAFAF5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatBox = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  margin: 20px;
  border-radius: 8px;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
`;

const ProfileColumn = styled.div`
  flex-basis: 60%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const LargeCard = styled(Card)`
  width: 100%;
  margin-bottom: 20px;
  background-color: #FAFAF5;
  display: flex;
  border-radius: 8px;
`;

const LargeImage = styled(CardMedia)`
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const LargeDetails = styled(CardContent)`
  padding: 20px;
  flex-grow: 1;
`;

const SmallCard = styled(Card)`
  width: 100%;
  margin-bottom: 20px;
  background-color: #FAFAF5;
  display: flex;
  border-radius: 8px;
`;

const SmallImage = styled(CardMedia)`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const SmallDetails = styled(CardContent)`
  padding: 16px;
`;

const Name = styled(Typography)`
  font-weight: bold;
`;

const Position = styled(Typography)`
  color: #4B48C6;
  font-weight: bold;
  margin-bottom: 0.35em;
`;

export default function PersonalPage() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const {logout} = useAuth();

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, messageInput]);
      setMessageInput('');
    }
  };

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
    return <LogoLoading/>;
  }

  return (
    <>
    <NavBar logout={logout}/>
    <Container>
      <ChatColumn>
        <ChatBox>
          {/* Initial greeting text */}
          <Typography variant="h5">DSS-GPT</Typography>
          <Typography variant="body1">Hello! Welcome to {person.name}'s page. Feel free to ask me any questions you have about them.</Typography>
          {/* Display messages here */}
          {messages.map((msg, index) => (
            <Typography key={index}>{msg}</Typography>
          ))}
        </ChatBox>
        <InputArea>
          <TextField
            fullWidth
            className="messageInput"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Message DSS-GPT..."
            variant="outlined"
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>Send</Button>
        </InputArea>
      </ChatColumn>
      <ProfileColumn>
        {/* Large card for personal details */}
        <LargeCard>
          <LargeImage
            component="img"
            image={person.image}
            alt={person.name}
          />
          <LargeDetails>
            <Name variant="h5" component="div">
              {person.name}
            </Name>
            <Typography variant="body1">{person.email}</Typography>
            <Typography variant="body2">{person.major}</Typography>
            <Typography variant="body2">{person.house}</Typography>
            <Typography variant="body2">{person.current_position}</Typography>
          </LargeDetails>
        </LargeCard>
        {/* Map over smaller cards */}
        {person.closest_friends.map((person) => (
          <Link
          key={person.id} // Assuming 'id' is the field name for record ID
          to={{
            pathname: `/personal/${person.id}`, // Pass record ID as part of the URL
            state: { personData: person }, // Pass person data as part of the state
          }}
          style={{ textDecoration: "none", color: "inherit" }}
          >
          <SmallCard key={person.id} className="smallCard">
            <SmallImage
              component="img"
              image={person.image}
              alt={person.name}
            />
            <SmallDetails>
              <Name variant="h6" component="div">
                {person.name}
              </Name>
              <Position variant="subtitle1">
                {person.position}
              </Position>
            </SmallDetails>
          </SmallCard>
          </Link>
        ))}
      </ProfileColumn>
    </Container>
    </>
  );
}
