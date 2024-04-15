import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardMedia, CardContent, Typography, TextField, IconButton, Avatar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from '@emotion/styled';
import LogoLoading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import dssLogo from '../assets/dss_logo.png';

// Styled components for the chat bubbles
const MessageBubble = styled.div`
  background-color: ${(props) => props.type === 'user' ? '#8CD6D1' : '#F0F0F0'};
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  max-width: 80%;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(props) => props.type === 'user' ? 'flex-end' : 'flex-start'};
  align-items: center;
  margin: 10px;
`;

const MessageAvatar = styled(Avatar)`
  margin: 0 8px;
`;


const Container = styled.div`
  display: flex;
  height: 90vh;
  flex-direction: row; // Default to row for larger screens

  @media (max-width: 768px) {
    flex-direction: column; // Stack vertically on small screens
  }
`;

const ChatColumn = styled.div`
  flex-basis: 40%;
  background-color: #FAFAF5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-basis: 100%; // Take full width on small screens
  }
`;

const ProfileColumn = styled.div`
  flex-basis: 60%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;

  @media (max-width: 768px) {
    flex-basis: 100%; // Take full width on small screens
    order: -1; // Make it appear above the chat column
  }
`;


// // Styled components using Emotion
// const Container = styled.div`
//   display: flex;
//   height: 90vh;
// `;

// const ChatColumn = styled.div`
//   flex-basis: 40%;
//   background-color: #FAFAF5;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;

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

// const ProfileColumn = styled.div`
//   flex-basis: 60%;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: left;
// `;

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
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { profilePic, logout } = useAuth();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    setMessages([]);  // Clear messages on ID change
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-personal-data-with-friends?person_id=${id}`);
        setPerson(response.data);
      } catch (error) {
        console.error("Error fetching personal data: ", error);
      }
    };
    fetchData();
  }, [id]);

  const sendMessage = async () => {
    if (messageInput.trim()) {
      const newMessage = { type: 'user', text: messageInput };
      setMessages(messages => [...messages, newMessage]);
      setMessageInput('');
      setLoading(true);
      fetchResponse(messageInput);  // Fetch the response after sending the message
    }
  };

  const fetchResponse = async (input) => {
    try {
      const response = await axios.get(`/api/get-chat-response?person_id=${id}&chat_input=${input}`);
      const responseData = { type: 'bot', text: response.data.response };
      setMessages(messages => [...messages, responseData]);
    } catch (error) {
      console.error("Error getting chat response: ", error);
      setMessages(messages => [...messages, { type: 'bot', text: "Failed to get response." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && messageInput.trim()) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!person) {
    return <LogoLoading/>;
  }

  return (
<>
    <NavBar logout={logout}/>
    <Container>
    <ChatColumn>
          <ChatBox>
          <Typography variant="h5">DSS-GPT</Typography>
          <Typography variant="body1">Hello! Welcome to {person.name}'s page. Feel free to ask me any questions you have about them.</Typography>
            {messages.map((msg, index) => (
              <MessageRow key={index} type={msg.type}>
                <MessageAvatar src={msg.type === 'user' ? profilePic : dssLogo} />
                <MessageBubble type={msg.type}>
                  <Typography variant="body1">{msg.text}</Typography>
                </MessageBubble>
              </MessageRow>
            ))}
            {loading && <CircularProgress />}
          </ChatBox>
          <InputArea>
          <TextField
              fullWidth
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message here..."
              variant="outlined"
              onKeyDown={handleKeyPress}
            />
            <IconButton color="primary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </InputArea>
        </ChatColumn>
      <ProfileColumn>
        <LargeCard>
          <LargeImage component="img" image={person.image} alt={person.name}/>
          <LargeDetails>
            <Name variant="h5">{person.name}</Name>
            <Typography variant="body1">{person.email}</Typography>
            <Typography variant="body2">{person.major}</Typography>
            <Typography variant="body2">{person.house}</Typography>
            <Typography variant="body2">{person.current_position}</Typography>
          </LargeDetails>
        </LargeCard>
        {person.closest_friends.map((friend) => (
          <Link key={friend.id} to={`/personal/${friend.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <SmallCard>
              <SmallImage component="img" image={friend.image} alt={friend.name}/>
              <SmallDetails>
                <Name variant="h6">{friend.name}</Name>
                <Position variant="subtitle1">{friend.position}</Position>
              </SmallDetails>
            </SmallCard>
          </Link>
        ))}
      </ProfileColumn>
    </Container>
    </>
  );
}
