import React, { useState, useEffect } from "react";
import { IconButton, Slide } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
// import profileBg from "../assets/profile.jpg"; // Adjust path if needed

const styles = {
  width: "100vw",
  minHeight: "100vh",
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "80px",
  backgroundImage: "",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflowX: "hidden",
  boxSizing: "border-box",
  position: "relative",
};

const COLORS = ["#4caf50", "#f44336", "#ff9800"];

const Profile = () => {
  const navigate = useNavigate();
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCharts(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const userDetails = {
    username: "Player123",
    rank: "Gold",
    matchesPlayed: 50,
  };

  const pieData = [
    { name: "Wins", value: 10 },
    { name: "Losses", value: 5 },
    { name: "Ties", value: 3 },
  ];

  const barData = [
    { category: "Easy", frequency: 12 },
    { category: "Medium", frequency: 18 },
    { category: "Hard", frequency: 7 },
  ];

  return (
    <div style={styles}>
      <IconButton
        onClick={() => navigate("/")}
        sx={{ position: "absolute", top: 20, left: 20, color: "white" }}
      >
        <ArrowBackIcon />
      </IconButton>

    

      <Slide direction="up" in={showCharts} timeout={1000}>
        <div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
          <h2>Game Statistics</h2>

          {/* Flex container for Pie Chart & Bar Chart */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
            {/* Pie Chart */}
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Bar Chart (Frequency Graph) */}
            <ResponsiveContainer width={400} height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="frequency" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Slide>
    </div>
  );
};

export default Profile;
