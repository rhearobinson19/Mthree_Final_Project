import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div style={styles}>
      <Link to="/queue">
        <button style={buttonStyles}>Start Game</button>
      </Link>
    </div>
  );
};

const styles = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" };
const buttonStyles = { padding: "10px 20px", fontSize: "16px", cursor: "pointer" };

export default Dashboard;
