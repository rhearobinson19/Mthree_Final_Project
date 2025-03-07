import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quizImage from "../assets/quiz.jpeg";

const Quiz: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeUp, setTimeUp] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);
  const [topicId, setTopicId] = useState<number>(() => Math.floor(Math.random() * 5) + 1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(5).fill(null));

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
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/queue/topic/${topicId}`);
        const data = await response.json();

        if (data.message?.questions?.length > 0) {
          setQuestionData(data.message.questions[0]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return "#FF3B30";
    if (timeLeft <= 60) return "#FF9500";
    return "#4CD964";
  };

  const handleNext = () => {
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionClick = (option: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  if (!questionData) return <p>Loading...</p>;

  const questionKey = `q${currentQuestionIndex + 1}`;
  const options = [
    questionData[`${questionKey}o1`],
    questionData[`${questionKey}o2`],
    questionData[`${questionKey}o3`],
    questionData[`${questionKey}o4`],
  ];

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${quizImage})` }}>
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
            <svg width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke={getTimerColor()}
                strokeWidth="6"
                fill="none"
                strokeDasharray="188"
                strokeDashoffset={188 - (188 * timeLeft) / 120}
                strokeLinecap="round"
              />
              <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fill="white" fontSize="16">
                {formatTime(timeLeft)}
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
                    background: selectedAnswers[currentQuestionIndex] === option ? "linear-gradient(45deg, #ff416c, #ff4b2b)" : "linear-gradient(45deg, #6a11cb, #2575fc)",
                    transform: selectedAnswers[currentQuestionIndex] === option ? "scale(1.05)" : "scale(1)",
                  }}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.navButtons}>
            <button style={{ ...styles.navButton, visibility: currentQuestionIndex === 0 ? "hidden" : "visible" }} onClick={handlePrev}>
              Prev
            </button>
            <button
              style={{ ...styles.navButton, visibility: currentQuestionIndex === 4 ? "hidden" : "visible" }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>

          {currentQuestionIndex === 4 && (
            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  padding: "12px 20px",
                  fontSize: "18px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
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
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Ensure it takes the full screen height
    width: "100vw",  // Ensure full width
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    margin: 0,  
    padding: 0,
    overflow: "hidden", // Prevent scrollbars
  },
  quizCard: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "500px",
    color: "#f0f0f0",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: "15px",
  },
  question: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  optionsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  option: {
    padding: "12px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
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
  timerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px auto",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Quiz;
