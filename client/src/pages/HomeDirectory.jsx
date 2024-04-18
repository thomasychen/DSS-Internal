import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NavBar from "../components/NavBar";
import LogoLoading from "../components/Loading";

export default function HomeDirectory() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [people, setPeople] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(5);
  const cardWidth = 345; // width of a single card
  const gap = 16; // gap between cards
  const containerPadding = 10;
  const sectionOrder = ["Exec", "Acadev", "Consulting", "Social Good", "Senior Advisors", "Other"];


  const positionMap = {
    "Senior Advisor": "Senior Advisors",
    "External VP": "Exec",
    "Acadev Director": "Exec",
    "VP of Culture": "Exec",
    "VP of Marketing": "Exec",
    "President": "Exec",
    "Director of Social Good": "Exec",
    "VP of Financing": "Exec",
    "VP of Tech": "Exec",
    "Director of Consulting": "Exec",
    "VP of Sourcing": "Exec",
    "Social Good Analyst": "Social Good",
    "Social Good PM": "Social Good",
    "Consultant": "Consulting",
    "Consulting PM": "Consulting",
    "Acadev Mentor": "Acadev",
    "Internal VP": "Exec",
  };
  

  // Helper function to toggle the expanded state of a section
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      // This includes the padding and any additional space you want to leave on the sides
      const screenWidth = window.innerWidth;
      console.log(screenWidth)
      const availableWidth = screenWidth *0.8- containerPadding * 2;
      console.log(availableWidth);// Padding on both sides
      const cardCount = Math.floor(availableWidth / (cardWidth + gap));
      console.log(cardCount);
      setCardsToShow(Math.max(1, cardCount));
    };

    // Calculate initial number of cards to show
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define the role order for sorting
  const roleOrder = [
    "President",
    "Internal VP",
    "External VP",
    "VP of Marketing",
    "VP of Sourcing",
    "Acadev Director",
    "Director of Social Good",
    "Director of Consulting",
    "VP of Culture",
    "VP of Financing",
    "VP of Tech",
    "Social Good PM",
    "Social Good Analyst",
    "Consulting PM",
    "Consultant",
    "Acadev Mentor",
    "Senior Advisor"
  ];
  
  // Create a mapping of roles to their order for quick lookup
  const roleOrderMap = roleOrder.reduce((acc, role, index) => {
    acc[role] = index;
    return acc;
  }, {});
  
  useEffect(() => {
    const fetchPeople = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get("/api/get-data");
  
        // Sort the response data by name alphabetically
        const sortedPeople = response.data.sort((a, b) => a.name.localeCompare(b.name));
  
        // Sort by the role order defined above, utilizing the stable sorting nature of Array.prototype.sort
        sortedPeople.sort((a, b) => {
          return roleOrderMap[a.position] - roleOrderMap[b.position];
        });
  
        // Pre-group sorted people by their section
        const groupedPeople = sortedPeople.reduce((acc, person) => {
          const section = positionMap[person.position] || "Others";
          if (!acc[section]) acc[section] = [];
          acc[section].push(person);
          return acc;
        }, {});
  
        setPeople(groupedPeople);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsFetching(false);
      }
    };
  
    if (isLoggedIn) {
      fetchPeople();
    }
  }, [isLoggedIn]);

  if (isLoading || isFetching) {
    return <LogoLoading />;
  }

  // Helper component to render a section with people cards
  const Section = ({ title, people }) => (
    <div>
    <Typography variant="h4" component="div" style={{ fontFamily: 'Newsreader, serif', margin: "16px 0", fontSize: "64px", textAlign: "left" }}>
      {title}
    </Typography>
    <div style={{ borderBottom: '3px solid #cccccc', width: '100%', margin: '0 auto 24px' }}></div>
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: `${gap}px`, alignItems: "flex-start", width:"100%",
        margin: "0 auto" }}>
        {(expandedSections[title] ? people : people.slice(0, cardsToShow)).map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
      {people.length > cardsToShow && (
       <div style={{ textAlign: "center", margin: "16px 0 48px" }}> {/* This div centers the button */}
       <Button
         onClick={() => toggleSection(title)}
         style={{
           backgroundColor: "white",
           color: "black",
           borderColor: "black",
           borderWidth: "1px",
           borderStyle: "solid",
           borderRadius: "20px",
           padding: "8px 16px",
           '&:hover': {
             backgroundColor: "#ADD8E6",
             borderColor: "black",
           },
         }}
       >
         {expandedSections[title] ? "Show Less" : "See All"}
       </Button>
     </div>
      )}
    </div>
  );

  // Helper component to render a single person card
  const PersonCard = ({ person }) => (
    <Link
      to={{
        pathname: `/personal/${person.id}`,
        state: { personData: person },
      }}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card style={{ width: 345, borderRadius: "20px", backgroundColor: "#FAFAF5" }}>
        <CardMedia component="img" height="320" image={person.image} alt={person.name} />
        <CardContent style={{ padding: "16px" }}>
          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: "bold", marginBottom: "0.35em" }}>
            {person.name}
          </Typography>
          <Typography variant="h5" style={{ color: "#4B48C6", fontWeight: "bold", marginBottom: "0.75em" }}>
            {person.position}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {person.email}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div>
      <NavBar logout={logout} />
      <div style={{ width: "100%", maxWidth: "90%", margin: "0 auto" }}>
        {sectionOrder.map((sectionTitle) => {
          // Check if there are people in the current section
          const peopleInSection = people[sectionTitle];
          return (
            // Only render the section if there are people in it
            peopleInSection && (
              <Section key={sectionTitle} title={sectionTitle} people={peopleInSection} />
            )
          );
        })}
      </div>
    </div>
  );

}