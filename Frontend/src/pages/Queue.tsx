import React from "react";
import { Link } from "react-router-dom";
import queueImage from "../assets/background_queue.jpeg"; // Adjust path if needed

const Queue: React.FC = () => {
  return (
    <div style={{ ...styles.container, backgroundImage: `url(${queueImage})` }}>
      <h1 style={styles.heading}>THE ARENA AWAITS ..</h1>

      {/* Animated Loading Spinner */}
      <div style={styles.spinner}></div>

      <p style={styles.queueText}>You are in queue, please wait....</p>

      {/* Proceed Button */}
      <Link to="/quiz" style={styles.proceedButton}>
        Proceed
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  queueText: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "30px",
  },
  proceedButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3B3FCB",
    textDecoration: "none",
    borderRadius: "5px",
    marginTop: "20px",
  },
};

/* Add global CSS animation */
const globalStyles = document.createElement("style");
globalStyles.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(globalStyles);

export default Queue;
