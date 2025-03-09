import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import quizImage from "../assets/quiz.jpeg";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeUp, setTimeUp] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(5).fill(null));

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeUp(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    
    // Load questions from localStorage
    const questionsData = localStorage.getItem("questions");
    if (questionsData) {
      try {
        const parsedData = JSON.parse(questionsData);
        setQuestionData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      } catch (error) {
        console.error("Error parsing questions data:", error);
      }
    }
  }, []);

  if (!questionData) return <p>Loading questions...</p>;

  const questionKey = `q${currentQuestionIndex + 1}`;
  const options = [
    questionData[`${questionKey}o1`],
    questionData[`${questionKey}o2`],
    questionData[`${questionKey}o3`],
    questionData[`${questionKey}o4`],
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.overlay}></div>

        {timeUp ? (
          <div style={styles.modal}>
            <h2 style={{ color: "red", fontSize: "24px", marginBottom: "20px" }}>Time Up!</h2>
            <p>Your selected answers: {JSON.stringify(selectedAnswers)}</p>
            <Link to="/dashboard">
              <button style={styles.backButton}>Back to Home</button>
            </Link>
          </div>
        ) : (
          <div style={styles.quizCard}>
            <h2 style={styles.heading}>Quiz Time!</h2>
            
            {/* Circular Timer */}
            <div style={styles.timerContainer}>
              <svg width="100" height="100">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" stroke="#555" strokeWidth="8" fill="none" />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="limegreen"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={(1 - timeLeft / 120) * 251.2}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                {/* Timer Text */}
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18px" fill="white">
                  {timeLeft}s
                </text>
              </svg>
            </div>
            
            <div style={styles.questionContainer}>
              <p style={styles.question}>{questionData[questionKey]}</p>
              <div style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.option,
                      background: selectedAnswers[currentQuestionIndex] === option ? "#ff416c" : "#6a11cb",
                    }}
                    onClick={() => {
                      const updatedAnswers = [...selectedAnswers];
                      updatedAnswers[currentQuestionIndex] = option;
                      setSelectedAnswers(updatedAnswers);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.navButtons}>
              <button
                style={{ ...styles.navButton, visibility: currentQuestionIndex === 0 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Prev
              </button>
              <button
                style={{ ...styles.navButton, visibility: currentQuestionIndex === 4 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next
              </button>
            </div>
            {currentQuestionIndex === 4 && (
              <div style={{ marginTop: "20px" }}>
                <button
                  style={styles.finishButton}
                  onClick={() => setTimeUp(true)}
                >
                  Finish Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // New wrapper to handle full page styling
  pageWrapper: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundImage: `url(${quizImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as "relative",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  overlay: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    margin: 0,
    padding: 0,
  },
  quizCard: {
    position: "relative" as "relative",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center" as "center",
    width: "500px",
    maxWidth: "90%",
    color: "#f0f0f0",
    zIndex: 1,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
  },
  heading: { 
    fontSize: "26px", 
    marginBottom: "15px" 
  },
  timerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  questionContainer: { 
    marginBottom: "15px", 
    marginTop: "10px" 
  },
  question: { 
    fontSize: "18px", 
    fontWeight: "bold" as "bold" 
  },
  optionsContainer: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "10px" 
  },
  option: {
    padding: "12px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  navButtons: { 
    display: "flex", 
    justifyContent: "space-between", 
    marginTop: "20px" 
  },
  navButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  finishButton: {
    padding: "12px 20px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  modal: {
    position: "relative" as "relative",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center" as "center",
    width: "500px",
    maxWidth: "90%",
    color: "#f0f0f0",
    zIndex: 1,
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Quiz;