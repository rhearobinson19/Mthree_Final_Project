import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Slide } from "@mui/material";
import swordsLogo from "./assets/swords.jpg";
import loginImage from "./assets/Login.jpg";
import AppRoutes from "./pages/routes/AppRoutes";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isHomePage) {
      setTimeout(() => setShowTitle(true), 500);
      setTimeout(() => setShowButtons(true), 1200);
    }
  }, [isHomePage]);

  return (
    <div style={containerStyle}>
      {isHomePage && (
        <>
          <header style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={swordsLogo} alt="Swords Logo" style={logoStyle} />
              <div style={titleLogoStyle}>QUIZENA</div>
            </div>
            <nav style={navStyle}>
              <Link to="/rules" style={linkStyle}>RULES</Link>
              <Link to="/profile" style={linkStyle}>PROFILE</Link>
              <Link to="/registration" style={linkStyle}>REGISTER</Link>
            </nav>
          </header>

          {/* Background Section */}
          <div style={backgroundStyle}>
            <Slide direction="up" in={showTitle} timeout={1000}>
              <div style={titleStyle}>WELCOME TO THE BATTLES OF THE QUIZ LORDS</div>
            </Slide>

            <Slide direction="up" in={showButtons} timeout={1000}>
              <div style={buttonContainerStyle}>
                <HoverButton to="/dashboard">ENTER THE ARENA</HoverButton>
                <HoverButton to="/leaderboard">LEADERBOARD</HoverButton>
              </div>
            </Slide>
          </div>
        </>
      )}

      {/* Load other pages via routes */}
      <div>
        <AppRoutes />
      </div>
    </div>
  );
};

/* Styles */
const containerStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  margin: 0,
  padding: 0,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  color: "black",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(to right, #ffffff 0%, #4074B0 100%)",
  zIndex: 100,
  boxSizing: "border-box",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  marginRight: "50px",
};

const linkStyle: React.CSSProperties = {
  color: "black",
  textDecoration: "none",
  fontSize:22,
  fontWeight: "bold",
  zIndex: 100,
};

const backgroundStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${loginImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5em",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
  zIndex: 10,
};

const buttonContainerStyle: React.CSSProperties = {
  marginTop: "30px",
  display: "flex",
  gap: "20px",
  zIndex: 10,
};

/* Updated Button Styling */
const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #ffffff, #A1C4FD)", // White to Light Blue Gradient
  color: "#000",
  fontSize: "1.3em",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  boxShadow: "0px 4px 8px rgba(161, 196, 253, 0.7)", // Subtle Blue Glow
  border: "2px solid transparent",
  textAlign: "center",
  display: "inline-block",
};

/* Hover Effect using React Inline Styles */
const buttonHoverStyle: React.CSSProperties = {
  transform: "scale(1.1)",
  boxShadow: "0px 6px 12px rgba(161, 196, 253, 1)", // Stronger Glow on Hover
};

/* Button Component with Hover Effect */
const HoverButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </Link>
  );
};

const logoStyle: React.CSSProperties = {
  height: "40px",
  marginRight: "10px",
};

const titleLogoStyle: React.CSSProperties = {
  fontSize: "2em",
  fontWeight: "bold",
};

// Prevent horizontal scrolling globally
document.documentElement.style.overflowX = "hidden";
document.documentElement.style.overflowY = "hidden";
document.body.style.overflowX = "hidden";
document.body.style.overflowY = "hidden";

export default App;
