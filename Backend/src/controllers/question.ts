import { sql } from "../config/db";

// Fetch all questions related to a topic
const getQuestionsByTopicId = async (topicId: string) => {
    try {
        console.log(`Fetching questions for topic ID: ${topicId}`);
        const data = await sql`SELECT * FROM queoptn WHERE topic_id = ${topicId};`;
        if (data.length === 0) {
            console.log("No questions found for this topic");
            return { error: "No questions found" };
        }
        console.log("Fetched questions:", data);
        return { questions: data };
    } catch (error) {
        console.error("Error fetching questions:", error);
        return { error: "Database error" };
    }
};

// // Test function to fetch questions for a sample topic ID
// const testFetch = async () => {
//     const sampleTopicId = "2"; // Replace with a valid topic ID
//     const data = await getQuestionsByTopicId(sampleTopicId);
//     console.log("Test Fetch Questions:", data);
// };
// testFetch();

export  default getQuestionsByTopicId ;
