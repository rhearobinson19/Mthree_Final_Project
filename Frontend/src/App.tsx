import React from "react";
import { Link, useLocation } from "react-router-dom";
import swordsLogo from "./assets/swords.jpg";
import loginImage from "./assets/Login.jpg";
import AppRoutes from "./pages/routes/AppRoutes";

const App: React.FC = () => {
  const location = useLocation();

  // Show layout only on the home page
  const isHomePage = location.pathname === "/";

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Show header & background only on the home page */}
      {isHomePage && (
        <>
          <header style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={swordsLogo} alt="Swords Logo" style={{ height: "40px", marginRight: "10px" }} />
              <div style={{ fontSize: "2em", fontWeight: "bold" }}>QUIZENA</div>
            </div>
            <nav style={{ display: "flex", gap: "20px", marginRight: "50px" }}>
              <Link to="/" style={linkStyle}>HOME</Link>  
              <Link to="/rules" style={linkStyle}>RULES</Link>
              <Link to="/profile" style={linkStyle}>PROFILE</Link>
              <Link to="/registration" style={linkStyle}>REGISTER</Link>
            </nav>
          </header>

          {/* Landing Page Content */}
          <div style={backgroundStyle}>
            <div style={titleStyle}>WELCOME TO THE BATTLES OF THE QUIZ LORDS</div>
            <div style={buttonContainerStyle}>
              <Link to="/enter-arena" style={actionLinkStyle}>ENTER THE ARENA</Link>
              <Link to="/leaderboard" style={actionLinkStyle}>LEADERBOARD</Link>
            </div>
          </div>
        </>
      )}

      {/* Load other pages via routes */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <AppRoutes />
      </div>
    </div>
  );
};

/* Styles */
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  color: "black",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  background: "linear-gradient(to right, #ffffff 0%, #4074B0 100%)",
  zIndex: 100, 
};

const linkStyle: React.CSSProperties = {
  color: "black",
  textDecoration: "none",
  fontWeight: "bold",
  zIndex: 100,
};

const backgroundStyle: React.CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${loginImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
  zIndex: 10,
};

const buttonContainerStyle: React.CSSProperties = {
  marginTop: "30px",
  display: "flex",
  gap: "30px",
  zIndex: 10,
};

const actionLinkStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '1.2em',
  fontWeight: 'bold',
  textDecoration: 'underline',
  cursor: 'pointer',
  zIndex: 100,
  position: "relative",
};

export default App;
