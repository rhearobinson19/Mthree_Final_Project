import express, { Request, Response } from "express";
import authenticateUser from "../config/authMiddleware";
import { joinQueue } from "../controllers/queue";
import { io } from "../server"; // Import Socket.IO instance
import getQuestionsByTopicId from "../controllers/question";

const router = express.Router();

// Player joins the queue
router.get("/join", authenticateUser, (req, res) => joinQueue(io)(req, res));

// Get questions by topic ID
router.get("/topic/:topicId", async (req, res) => {
    const topicId = req.params.topicId;
    const result = await getQuestionsByTopicId(topicId);
    res.json({ message: result});
});


export default router;
