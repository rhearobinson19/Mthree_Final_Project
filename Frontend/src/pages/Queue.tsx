// import React, { useState, useEffect } from "react";
// import { Link , useNavigate } from "react-router-dom";
// import { useSocket } from "../config/socket_config";
// import queueImage from "../assets/background_queue.jpeg";

// interface Question {
//   id: string;
//   question: string;
//   options: string[];
//   correct_answer: string;
// }

// interface GameData {
//   gameId: string;
//   questions: Question[];
// }

// const Queue: React.FC = () => {
//   const [status, setStatus] = useState<string>("Initializing...");
//   const [inQueue, setInQueue] = useState<boolean>(false);
//   const [gameData, setGameData] = useState<GameData | null>(null);
//   const [shouldConnect, setShouldConnect] = useState<boolean>(true);
//   const [matchStarted, setMatchStarted] = useState<boolean>(false);
//   const navigate = useNavigate();
//   const { socket, isConnected, connect, disconnect } = useSocket();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (shouldConnect && !isConnected) {
//       connect();
//       setStatus("Connecting to server...");
//     } else if (isConnected) {
//       setStatus("Connected to server. Ready to join queue.");
//     }

//     return () => {
//       if (isConnected && shouldConnect === false) {
//         disconnect();
//       }
//     };
//   }, [navigate, isConnected, connect, disconnect, shouldConnect]);

//   useEffect(() => {
//     if (!socket || !shouldConnect) return;

//     const gameStartHandler = (data: any) => {
//       console.log("Game start received:", data);
//       setGameData(data);
//       setMatchStarted(true);
//       setStatus("Match found! Game starting...");
//       // Redirect to the quiz page with game data
//       localStorage.setItem("questions", data.questions);
//       navigate('/quiz');
//     };

//     const queuedHandler = (data: any) => {
//       setStatus(`In queue: ${data.message || "Waiting for opponent"}`);
//       setInQueue(true);
//     };
  
//     const gameEndHandler = (data: any) => {
//       setStatus(`Game ended: ${data.message}`);
//       setMatchStarted(false);
//       setGameData(null);
//     };

//     socket.on("game_start", gameStartHandler);
//     socket.on("queued", queuedHandler);
//     socket.on("game_end", gameEndHandler);

//     if (isConnected) {
//       setStatus("Connected to server. Ready to join queue.");
      
//       const autoJoinQueue = async () => {
//         if (!inQueue && !matchStarted && shouldConnect) {
//           await joinQueue();
//         }
//       };
      
//       autoJoinQueue();
//     } else {
//       setStatus("Connecting to server...");
//     }

//     return () => {
//       socket.off("game_start", gameStartHandler);
//       socket.off("queued", queuedHandler);
//       socket.off("game_end", gameEndHandler);
//     };
//   }, [socket, isConnected, navigate, inQueue, matchStarted, shouldConnect]);

//   const joinQueue = async () => {
//     if (!socket || !isConnected) {
//       setStatus("Not connected to server. Please wait or refresh the page.");
//       if (shouldConnect) {
//         connect();
//       }
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     setStatus("Joining queue...");

//     try {
//       const response = await fetch(`http://localhost:5000/queue/join?socketId=${socket.id}`, {
//         method: "GET",
//         headers: { Authorization: `${token}` },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setStatus(data.message || "Joined queue successfully!");
//         setInQueue(true);
//       } else {
//         setStatus(`Error: ${data.error || "Failed to join queue"}`);
//       }
//     } catch (error) {
//       console.error("Error joining queue:", error);
//       setStatus("Failed to join queue. Please try again.");
//     }
//   };

//   const leaveQueue = async () => {
//     if (!socket || !isConnected) {
//       setStatus("Not connected to server.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await fetch(`http://localhost:5000/queue/leave?socketId=${socket.id}`, {
//         method: "GET",
//         headers: { Authorization: `${token}` },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setStatus("Left queue. Ready to join again.");
//         setInQueue(false);
//       } else {
//         setStatus(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error leaving queue:", error);
//     }
//   };

//   const exitQueue = () => {
//     setShouldConnect(false);

//     if (inQueue) {
//       leaveQueue();
//     }
    
//     if (socket && isConnected) {
//       socket.disconnect();
//     }
    
//     sessionStorage.removeItem("activeQueueJoin");
//     navigate("/dashboard");
//   };


//   return (
//     <div style={styles.mainContentStyles}>
//         <div style={styles.contentStyles}>
//           <h1 style={styles.titleStyles}>THE ARENA AWAITS ..</h1>

//           <p style={styles.statusStyles}>{status}</p>

//           {inQueue && <div style={styles.spinner}></div>}

//           {inQueue && (
//             <p style={styles.messageStyles}>You are in queue, please wait....</p>
//           )}

//           <button style={styles.buttonStyles} onClick={exitQueue}>
//             Exit Queue
//           </button>
//         </div>
//       </div>
//   );
// };



// const styles: Record<string, React.CSSProperties> = {
//   mainContentStyles:{
//     position: "absolute",
//     top: "0",
//     left: "0",
//     right: "0",
//     bottom: "0",
//     display: "flex",
//     flexDirection: "column",
//     backgroundImage: `url(${queueImage})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     backgroundAttachment: "fixed",
//     width: "100vw",
//     height: "100vh",
//     filter: "brightness(1)",
//     transition: "0.3s ease-in-out",
//   },
//   contentStyles: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     transition: "0.3s ease-in-out",
//   },
//   titleStyles: {
//     fontSize: "40px",
//     fontWeight: "bolder",
//     color: "white",
//     marginBottom: "20px",
//   },
//   statusStyles: {
//     fontSize: "20px",
//     color: "white",
//     marginBottom: "20px",
//   },
//   spinner: {
//     width: "50px",
//     height: "50px",
//     border: "5px solid rgba(255, 255, 255, 0.3)",
//     borderTop: "5px solid white",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: "20px",
//   },
//   messageStyles:{
//     fontSize: "20px",
//     color: "white",
//     marginBottom: "20px",
//   },
//   buttonStyles: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     fontWeight: "bold",
//   }
// };

// /* Add global CSS animation */
// const globalStyles = document.createElement("style");
// globalStyles.innerHTML = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;
// document.head.appendChild(globalStyles);

// export default Queue;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../config/socket_config";
import queueImage from "../assets/background_queue.jpeg";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface GameData {
  gameId: string;
  questions: Question[];
}

const Queue: React.FC = () => {
  const [status, setStatus] = useState<string>("Initializing...");
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [matchStarted, setMatchStarted] = useState<boolean>(false);
  const navigate = useNavigate();
  const { socket, isConnected, connect, disconnect, Close_SOCKET } = useSocket();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!isConnected) {
      connect();
      setStatus("Connecting to server...");
    } else {
      setStatus("Connected to server. Ready to join queue.");
    }
  }, [navigate, isConnected, connect]);

  useEffect(() => {
    if (!socket) return;

    const gameStartHandler = (data: any) => {
      console.log("Game start received:", data);
      setGameData(data);
      setMatchStarted(true);
      setStatus("Match found! Game starting...");
      // Store questions and navigate
      localStorage.setItem("questions", JSON.stringify(data.questions));
      localStorage.setItem("topic", data.topic);
      navigate('/quiz');
    };

    const queuedHandler = (data: any) => {
      setStatus(`In queue: ${data.message || "Waiting for opponent"}`);
      setInQueue(true);
    };
  
    const gameEndHandler = (data: any) => {
      setStatus(`Game ended: ${data.message}`);
      setMatchStarted(false);
      setGameData(null);
    };

    socket.on("game_start", gameStartHandler);
    socket.on("queued", queuedHandler);
    socket.on("game_end", gameEndHandler);

    if (isConnected) {
      setStatus("Connected to server. Ready to join queue.");
      
      const autoJoinQueue = async () => {
        if (!inQueue && !matchStarted) {
          await joinQueue();
        }
      };
      
      autoJoinQueue();
    } else {
      setStatus("Connecting to server...");
    }

    return () => {
      socket.off("game_start", gameStartHandler);
      socket.off("queued", queuedHandler);
      socket.off("game_end", gameEndHandler);
    };
  }, [socket, isConnected, navigate, inQueue, matchStarted]);

  const joinQueue = async () => {
    if (!socket || !isConnected) {
      setStatus("Not connected to server. Please wait or refresh the page.");
      connect();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setStatus("Joining queue...");

    try {
      const response = await fetch(`http://localhost:5000/queue/join?socketId=${socket.id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || "Joined queue successfully!");
        setInQueue(true);
      } else {
        setStatus(`Error: ${data.error || "Failed to join queue"}`);
      }
    } catch (error) {
      console.error("Error joining queue:", error);
      setStatus("Failed to join queue. Please try again.");
    }
  };

  const leaveQueue = async () => {
    if (!socket || !isConnected) {
      setStatus("Not connected to server.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/queue/leave?socketId=${socket.id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("Left queue. Ready to join again.");
        setInQueue(false);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error leaving queue:", error);
    }
  };

  const exitQueue = () => {
    if (inQueue) {
      leaveQueue();
    }
    
    // Just disconnect from queue, but don't close socket
    navigate("/dashboard");
  };

  return (
    <div style={styles.mainContentStyles}>
      <div style={styles.contentStyles}>
        <h1 style={styles.titleStyles}>THE ARENA AWAITS ..</h1>

        <p style={styles.statusStyles}>{status}</p>

        {inQueue && <div style={styles.spinner}></div>}

        {inQueue && (
          <p style={styles.messageStyles}>You are in queue, please wait....</p>
        )}

        <button style={styles.buttonStyles} onClick={exitQueue}>
          Exit Queue
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  mainContentStyles:{
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    backgroundImage: `url(${queueImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    width: "100vw",
    height: "100vh",
    filter: "brightness(1)",
    transition: "0.3s ease-in-out",
  },
  contentStyles: {
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    transition: "0.3s ease-in-out",
  },
  titleStyles: {
    fontSize: "40px",
    fontWeight: "bolder",
    color: "white",
    marginBottom: "20px",
  },
  statusStyles: {
    fontSize: "20px",
    color: "white",
    marginBottom: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  messageStyles:{
    fontSize: "20px",
    color: "white",
    marginBottom: "20px",
  },
  buttonStyles: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
  }
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