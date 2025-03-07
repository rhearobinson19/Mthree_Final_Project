import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes";
import queueRoutes from "./routes/queueRoutes";
import { checkConnection } from "./config/db";
import getQuestionsByTopicId  from "./controllers/question";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend access
    credentials: true, // Allow cookies if needed
}));

// Routes
app.use("/auth", authRoutes);
app.use("/queue", queueRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to QUIZ");
});

// Handle player disconnections
io.on("connection", (socket) => {
    console.log(`🔌 Player connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`⚡ Player disconnected: ${socket.id}`);
    });
});

checkConnection()
    .then(() => {
        // Start Server only if DB is running
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to DB. Server not started.", err);
    });

    export { io ,server };