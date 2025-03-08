import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import quizImage from "../assets/quiz.jpeg";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeUp, setTimeUp] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);
  const [topicId] = useState<number>(() => Math.floor(Math.random() * 5) + 1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(5).fill(null));

  // ✅ Always call hooks in the same order
  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    console.log("Token in Quiz:", token); // Debugging
    if (!token) {
      navigate("/enter-arena"); // Redirect if no token
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

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

  // Fetch questions (after authentication is confirmed)
  useEffect(() => {
    if (!isAuthenticated) return; // ✅ Avoids early API calls before authentication

    const fetchQuestions = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/queue/topic/${topicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.message?.questions?.length > 0) {
          setQuestionData(data.message.questions[0]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [isAuthenticated, topicId]); // ✅ Waits until authentication is set

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    navigate("/enter-arena");
  };

  // ✅ Prevent rendering issues by handling "Loading" properly
  if (!isAuthenticated) return <p>Checking authentication...</p>;
  if (!questionData) return <p>Loading questions...</p>;

  const questionKey = `q${currentQuestionIndex + 1}`;
  const options = [
    questionData[`${questionKey}o1`],
    questionData[`${questionKey}o2`],
    questionData[`${questionKey}o3`],
    questionData[`${questionKey}o4`],
  ];

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${quizImage})` }}>
      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>

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
          <div style={styles.timerBox}>
            <p>{timeLeft} sec</p>
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
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  quizCard: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "500px",
    color: "#f0f0f0",
  },
  logoutButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff4b2b",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  questionContainer: { marginBottom: "15px" },
  question: { fontSize: "18px", fontWeight: "bold" },
  optionsContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  option: {
    padding: "12px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  navButtons: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
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
};

export default Quiz;
