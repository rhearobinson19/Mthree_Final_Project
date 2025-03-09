import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/swords.jpg";
import backgroundImg from "../assets/dashboard.jpg";

// Sample leaderboard data - replace with your actual data source
const leaderboardData = [
  { rank: 1, username: "DragonSlayer", points: 9850, wins: 42, losses: 5 },
  { rank: 2, username: "QuizWizard", points: 8720, wins: 38, losses: 7 },
  { rank: 3, username: "BrainMaster", points: 8200, wins: 36, losses: 8 },
  { rank: 4, username: "TriviaKing", points: 7650, wins: 33, losses: 9 },
  { rank: 5, username: "KnowledgeHunter", points: 7200, wins: 31, losses: 10 },
  { rank: 6, username: "QuizChampion", points: 6850, wins: 29, losses: 11 },
  { rank: 7, username: "MindBender", points: 6400, wins: 27, losses: 12 },
  { rank: 8, username: "FactSeeker", points: 6100, wins: 26, losses: 13 },
  { rank: 9, username: "WisdomWarrior", points: 5800, wins: 24, losses: 14 },
  { rank: 10, username: "TriviaGuru", points: 5500, wins: 23, losses: 15 },
];

const Leaderboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Reset sidebar state when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Component lifecycle logging
  useEffect(() => {
    console.log("Leaderboard Mounted");
    return () => console.log("Leaderboard Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={containerStyles}>
      {/* Use React conditional rendering for overlay instead of DOM manipulation */}
      {isSidebarOpen && <div style={overlayStyles} onClick={() => setSidebarOpen(false)}></div>}

      <header style={navbarStyles}>
        <button onClick={toggleSidebar} style={menuButtonStyles}>☰</button>
        <img src={logo} alt="Logo" style={logoStyles} />
        <h1 style={navbarTitleStyles}>QUIZENA</h1>
      </header>

      {/* Sidebar - use React state to control visibility */}
      <div style={{ ...sidebarStyles, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={sidebarHeaderStyles}>
          <img src={logo} alt="Profile" style={profileImgStyles} />
          <h3>John Doe</h3>
        </div>
        <nav>
          <ul style={navListStyles}>
            <li>
              <Link to="/" style={{ ...navLinkStyles, ...(location.pathname === "/" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ ...navLinkStyles, ...(location.pathname === "/dashboard" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>⚔️</span> Enter Arena
              </Link>
            </li>
            <li>
              <Link to="/profile" style={{ ...navLinkStyles, ...(location.pathname === "/profile" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" style={{ ...navLinkStyles, ...(location.pathname === "/leaderboard" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>🏆</span> Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ ...navLinkStyles, ...(location.pathname === "/rules" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>📜</span> Rules
              </Link>
            </li>
            <li>
              <Link to="/logout" style={logoutLinkStyles}>
                <span style={iconStyles}>🚪</span> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - Leaderboard Table */}
      <div style={mainContentStyles}>
        <div style={contentStyles}>
          <div style={leaderboardContainerStyles}>
            <h1 style={leaderboardTitleStyles}>🏆 GLOBAL LEADERBOARD 🏆</h1>
            
            <div style={tableContainerStyles}>
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyles}>Rank</th>
                    <th style={tableHeaderStyles}>Username</th>
                    <th style={tableHeaderStyles}>Points</th>
                    <th style={tableHeaderStyles}>W/L</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player, index) => (
                    <tr key={index} style={{
                      ...tableRowStyles,
                      background: index === 0 ? 'rgba(255, 215, 0, 0.2)' : // Gold for 1st
                                 index === 1 ? 'rgba(192, 192, 192, 0.2)' : // Silver for 2nd
                                 index === 2 ? 'rgba(205, 127, 50, 0.2)' : // Bronze for 3rd
                                 'rgba(44, 62, 80, 0.2)' // Regular styling
                    }}>
                      <td style={tableCellStyles}>
                        {index === 0 ? '🥇' : 
                         index === 1 ? '🥈' : 
                         index === 2 ? '🥉' : player.rank}
                      </td>
                      <td style={{...tableCellStyles, fontWeight: 'bold'}}>
                        {player.username}
                      </td>
                      <td style={tableCellStyles}>
                        <span style={pointsStyles}>{player.points}</span>
                      </td>
                      <td style={tableCellStyles}>
                        <span style={winsStyles}>{player.wins}</span> / <span style={lossesStyles}>{player.losses}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={yourRankContainerStyles}>
              <h3 style={yourRankTitleStyles}>Your Rank</h3>
              <div style={yourRankStyles}>
                <span style={yourPositionStyles}>14</span>
                <span style={yourUsernameStyles}>John Doe</span>
                <span style={yourPointsStyles}>4,320 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reuse the styles from Dashboard component
const containerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
};

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9,
};

const navbarStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(to right, #2C3E50, #4CA1AF)",
  color: "white",
  padding: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
};

const sidebarStyles: React.CSSProperties = {
  position: "fixed",
  top: "70px",
  left: 0,
  width: "260px",
  height: "calc(100% - 70px)",
  background: "#2C3E50",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  transition: "transform 0.3s ease-in-out",
  boxShadow: "3px 0 15px rgba(0, 0, 0, 0.2)",
  zIndex: 11,
  borderTopRightRadius: "0px",
  borderBottomRightRadius: "10px",
  transform: "translateX(-100%)",
};

const sidebarHeaderStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
};

const profileImgStyles: React.CSSProperties = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "2px solid white",
  marginBottom: "10px",
};

const navListStyles: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const navLinkStyles: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  padding: "12px",
  borderRadius: "5px",
  transition: "background 0.3s, transform 0.2s",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const logoutLinkStyles: React.CSSProperties = {
  ...navLinkStyles,
  background: "#E74C3C",
  textAlign: "center",
  marginTop: "20px",
};

const iconStyles: React.CSSProperties = {
  marginRight: "10px",
  fontSize: "20px",
};

const sidebarActiveStyles = {
  backgroundColor: "#4CA1AF",
  transform: "scale(1.05)",
};

const navbarTitleStyles: React.CSSProperties = {
  margin: 0,
  fontSize: "1.8em",
  fontWeight: "bold",
};

const menuButtonStyles: React.CSSProperties = {
  fontSize: "24px",
  background: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const logoStyles: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
};

const mainContentStyles: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  display: "flex",
  flexDirection: "column",
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  width: "100vw",
  height: "100vh",
  filter: "brightness(1)",
  transition: "0.3s ease-in-out",
};

const contentStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  transition: "0.3s ease-in-out",
  padding: "20px",
};

// New styles for Leaderboard
const leaderboardContainerStyles: React.CSSProperties = {
  backgroundColor: "rgba(44, 62, 80, 0.8)",
  borderRadius: "15px",
  padding: "30px",
  width: "80%",
  maxWidth: "1000px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(5px)",
  border: "2px solid rgba(76, 161, 175, 0.5)",
};

const leaderboardTitleStyles: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "white",
  marginBottom: "30px",
  textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
  letterSpacing: "2px",
};

const tableContainerStyles: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "50vh",
  borderRadius: "10px",
  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
};

const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 4px",
  textAlign: "left",
};

const tableHeaderStyles: React.CSSProperties = {
  padding: "15px",
  color: "white",
  fontWeight: "bold",
  backgroundColor: "rgba(76, 161, 175, 0.8)",
  position: "sticky",
  top: 0,
  fontSize: "16px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const tableRowStyles: React.CSSProperties = {
  transition: "all 0.2s",
  cursor: "pointer",
};

const tableCellStyles: React.CSSProperties = {
  padding: "15px",
  color: "white",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  fontSize: "16px",
};

const pointsStyles: React.CSSProperties = {
  fontWeight: "bold",
  color: "#4CA1AF",
  fontSize: "18px",
};

const winsStyles: React.CSSProperties = {
  color: "#2ecc71",
  fontWeight: "bold",
};

const lossesStyles: React.CSSProperties = {
  color: "#e74c3c",
  fontWeight: "bold",
};

const yourRankContainerStyles: React.CSSProperties = {
  backgroundColor: "rgba(76, 161, 175, 0.3)",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "2px solid rgba(76, 161, 175, 0.8)",
};

const yourRankTitleStyles: React.CSSProperties = {
  color: "white",
  margin: "0 0 10px 0",
  fontSize: "18px",
  fontWeight: "bold",
};

const yourRankStyles: React.CSSProperties = {
  display: "flex",
  width: "100%",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px",
};

const yourPositionStyles: React.CSSProperties = {
  backgroundColor: "#4CA1AF",
  color: "white",
  fontWeight: "bold",
  padding: "8px 15px",
  borderRadius: "50%",
  fontSize: "18px",
  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
};

const yourUsernameStyles: React.CSSProperties = {
  color: "white",
  fontWeight: "bold",
  fontSize: "20px",
};

const yourPointsStyles: React.CSSProperties = {
  color: "#4CA1AF",
  fontWeight: "bold",
  fontSize: "18px",
};

export default Leaderboard;