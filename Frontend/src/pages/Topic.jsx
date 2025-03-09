import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizImage from "../assets/quiz.jpeg";

const Topic = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20);
  const [topicdata, setTopicData] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  useEffect(() => {
    // Load topic from localStorage
    const topicdata = localStorage.getItem("topic");
    if (topicdata) {
      try {
        const parsedData = JSON.parse(topicdata);
        setTopicData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      } catch (error) {
        console.error("Error parsing topic data:", error);
      }
    }
  }, []);


  return (
    <div style={{ ...styles.container, backgroundImage: `url(${quizImage})` }}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <h2 style={styles.heading}>parsedData</h2>
        <p style={styles.description}>{topicDescription}</p>

        {/* Circular Timer */}
        <div style={styles.timerContainer}>
          <svg width="140" height="140">
            {/* Background Circle */}
            <circle cx="70" cy="70" r="60" stroke="#555" strokeWidth="10" fill="none" />
            {/* Progress Circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="limegreen"
              strokeWidth="10"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset={(timeLeft / 20) * 377}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            {/* Timer Text */}
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24px" fill="white">
              {timeLeft}s
            </text>
          </svg>
        </div>

        <p style={styles.timerText}>Quiz starts in {timeLeft} seconds...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay for readability
  },
  card: {
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    width: "400px",
    color: "#f0f0f0",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    animation: "fadeIn 1s ease-in-out",
  },
  heading: { fontSize: "26px", marginBottom: "15px" },
  description: { fontSize: "18px", marginBottom: "20px", lineHeight: "1.5" },
  timerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  timerText: { fontSize: "18px", fontWeight: "bold", color: "#ffcc00" },
};

export default Topic;
