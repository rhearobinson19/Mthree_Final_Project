import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sql } from "../config/db";
import { io } from "../server";
import {getQuestionsByTopicId , getTopicByTopicId} from "../controllers/question";

interface AuthRequest extends Request {
    user?: { id: number; username: string };
}

// In-memory game queues
let waitingQueue: string[] = [];
let activePlayers: string[] = [];
let gameInProgress = false;
let blockNewGame = false;
const userSocketMap: Record<string, number> = {}; //Socket ID to User ID
const userIdToSocketMap: Record<number, string> = {}; // User ID to Socket ID

// Helper function to get user ID from socket ID
const getUserFromSocket = (socketId: string): number | -1=> {
    return userSocketMap[socketId] || -1;
};

// Helper function to check if user is already in queue or active game
const isUserInQueue = (userId: number): boolean => {
    return userIdToSocketMap.hasOwnProperty(userId);
};

const getTopicDetails = async (topicId: string) => {
    try {
        // Get questions for the specified topic
        const questions = await getQuestionsByTopicId(topicId);
        const topic = await getTopicByTopicId(topicId);
        return [questions,topic]
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
};

// Function to save details to db
const save_session = async (gameId: string, player1: number, player2: number) => {
    if (player1 === -1 || player2 === -1) { // Validating user IDs before saving
        console.error("Invalid player IDs, session not saved.");
        return;
    }
    try {
        const result = await sql`
            INSERT INTO sessionspec (game_id, user1id, user2id) 
            VALUES (${gameId}, ${player1}, ${player2}) 
            RETURNING *;
        `;
        console.log("Game session saved to DB:", { gameId, player1, player2 });
        return result[0];
    } catch (error) {
        console.error("Error saving session:", error);
        return { error: "Database error" };
    }
};

// Function to start a new game
const startGame =async() => {
    if (waitingQueue.length >= 2 && !gameInProgress && !blockNewGame) {
        activePlayers = [waitingQueue.shift()!, waitingQueue.shift()!];
        gameInProgress = true;

        const gameId = uuidv4(); // Generate unique game ID
        const topicId = Math.floor(Math.random() * 5) + 1; // Random topic ID (1-5)

        // Get questions for this game
        const data = await getTopicDetails(topicId.toString());

        console.log(`Game started: GameID=${gameId}, Players=${activePlayers}`);

        activePlayers.forEach(socketId => {
            io.to(socketId).emit("game_start", { 
                gameId: gameId,
                message: "Game started!", 
                questions: data[0],
                topic: data[1]
            });
        });

        setTimeout(() => endGame(gameId), 135000); // 2m 15s timer
    }
};

// Function to end the game
const endGame = (gameId: string) => {
    console.log(`Game ended: GameID=${gameId}, Players=${activePlayers}`);
    
    // Get player IDs
    const player1 = getUserFromSocket(activePlayers[0]);
    const player2 = getUserFromSocket(activePlayers[1]);

    io.to(activePlayers[0]).emit("game_end", { message: "Game over! Your session has ended." });
    io.to(activePlayers[1]).emit("game_end", { message: "Game over! Your session has ended." });
    
    save_session(gameId,player1,player2);

   // Clear player mappings
   if (player1 !== -1) delete userIdToSocketMap[player1];
   if (player2 !== -1) delete userIdToSocketMap[player2];
   delete userSocketMap[activePlayers[0]];
   delete userSocketMap[activePlayers[1]];

    // Reset game state
    activePlayers = [];
    gameInProgress = false;
    blockNewGame = true;

    // Block new game for 10s (total cooldown 2m25s)
    setTimeout(() => {
        blockNewGame = false;
        console.log("Game queue open for new players.");
        startGame();
    }, 10000);
};


export const joinQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const socketId = req.query.socketId as string;      //frontend should pass socket id

        if (!socketId) {
            res.status(400).json({ error: "Missing socket ID" });
            return;
        }

        if (!req.user) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }
        
        const userId = req.user.id;
    
        // Check if user is already in queue or active game
        if (isUserInQueue(userId)) {
            const existingSocketId = userIdToSocketMap[userId];
            
            // Check if user is in active game
            if (activePlayers.includes(existingSocketId)) {
                res.status(400).json({ 
                    error: "Already in a match", 
                    message: "You are already in an active match from another window/device."
                });
                return;
            }
            // User is in waiting queue, remove old entry
            const index = waitingQueue.indexOf(existingSocketId);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log(`Removed user ${req.user.username} with old socketID=${existingSocketId} from waiting queue`);
                
                // Clean up old socket mapping
                delete userSocketMap[existingSocketId];
            }
        }             

        // Map socketId to userId and vice versa
        userSocketMap[socketId] = userId;
        userIdToSocketMap[userId] = socketId;
        
        // Add to waiting queue with new socket ID
        waitingQueue.push(socketId);
        console.log(`User ${req.user.username} joined queue. SocketID=${socketId}`);

        io.to(socketId).emit("queued", { message: "You're in the queue. Please wait for another player." });

        if (waitingQueue.length >= 2 && !gameInProgress && !blockNewGame) {
            startGame();
        }

        res.json({ message: "Added to queue", socketId });
    } catch (error) {
        console.error("Error in joinQueue:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const leaveQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const socketId = req.query.socketId as string;

        if (!socketId) {
            res.status(400).json({ error: "Missing socket ID" });
            return;
        }

        if (!req.user) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        const userId = req.user.id;
        
        // Check if user is in waiting queue (not in active game)
        const index = waitingQueue.indexOf(socketId);
        if (index !== -1) {
            // Remove from waiting queue
            waitingQueue.splice(index, 1);
            console.log(`User ${req.user.username} left queue. SocketID=${socketId}`);
            
            // Remove mappings
            delete userSocketMap[socketId];
            delete userIdToSocketMap[userId];
            
            res.json({ message: "Removed from queue", success: true });
        } else if (activePlayers.includes(socketId)) {
            // User is in active game, can't leave
            res.json({ 
                message: "Cannot leave active game", 
                inActiveGame: true,
                success: false 
            });
        } else {
            // User not found in queue
            res.json({ 
                message: "Not found in queue", 
                success: true 
            });
        }
    } catch (error) {
        console.error("Error in leaveQueue:", error);
        res.status(500).json({ error: "Server error" });
    }
};
