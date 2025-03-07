import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Server } from "socket.io";
import { sql } from "../config/db";

interface AuthRequest extends Request {
    user?: { id: number; username: string };
}

// In-memory game queues
let waitingQueue: string[] = [];
let activePlayers: string[] = [];
let gameInProgress = false;
let blockNewGame = false;
const userSocketMap: Record<string, number> = {};

// Helper function to get user ID from socket ID
const getUserFromSocket = (socketId: string): number | -1=> {
    return userSocketMap[socketId] || -1;
};


// Function to save details to db
const save_session = async (gameId: string, player1: number, player2: number) => {
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
const startGame = (io: Server) => {
    if (waitingQueue.length >= 2 && !gameInProgress && !blockNewGame) {
        activePlayers = [waitingQueue.shift()!, waitingQueue.shift()!];
        gameInProgress = true;

        const gameId = uuidv4(); // Generate unique game ID
        console.log(`Game started: GameID=${gameId}, Players=${activePlayers}`);

        activePlayers.forEach(socketId => {
            io.to(socketId).emit("game_start", { message: "Game started!" });
        });

        setTimeout(() => endGame(io, gameId), 135000); // 2m 15s timer
    }
};

// Function to end the game
const endGame = (io: Server, gameId: string) => {
    console.log(`Game ended: GameID=${gameId}, Players=${activePlayers}`);

    const players=[]

    activePlayers.forEach(socketId => {
        io.to(socketId).emit("game_end", { message: "Game over! Your session has ended." });
    });
    const player1 = getUserFromSocket(activePlayers[0]);
    const player2 = getUserFromSocket(activePlayers[1]);
    save_session(gameId,player1,player2);

    activePlayers = [];
    gameInProgress = false;
    blockNewGame = true;

    // Block new game for 10s (total cooldown 2m25s)
    setTimeout(() => {
        blockNewGame = false;
        console.log("Game queue open for new players.");
        startGame(io);
    }, 10000);
};


export const joinQueue = (io: Server) => async (req: AuthRequest, res: Response): Promise<void> => {
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
        userSocketMap[socketId]=req.user.id;

        if (!waitingQueue.includes(socketId) && !activePlayers.includes(socketId)) {
            waitingQueue.push(socketId);
            console.log(`User ${req.user.username} joined queue. SocketID=${socketId}`);

            io.to(socketId).emit("queued", { message: "You're in the queue. Please wait for another player." });

            if (waitingQueue.length >= 2 && !gameInProgress && !blockNewGame) {
                startGame(io);
            }
        }

        res.json({ message: "Added to queue", socketId });
    } catch (error) {
        console.error("Error in joinQueue:", error);
        res.status(500).json({ error: "Server error" });
    }
};