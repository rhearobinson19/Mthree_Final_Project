import { sql } from "../config/db";

// Fetch all topics
// const getAllTopics = async () => {
//     try {
//         console.log("Fetching all topics...");
//         const data = await sql`SELECT id, topic_name, topic_description FROM topics;`;
//         return { topics: data };
//     } catch (error) {
//         console.error("Error fetching topics:", error);
//         return { error: "Database error" };
//     }
// };

// Fetch a single topic by ID
const getTopicById = async (id: string) => {
    try {
        console.log(`Fetching topic with ID: ${id}`);
        const data = await sql`SELECT id, topic_name, topic_description FROM topics WHERE id = ${id} LIMIT 1;`;
        if (data.length === 0) {
            console.log("Topic not found");
            return { error: "Topic not found" };
        }
        return { topic: data[0] };
    } catch (error) {
        console.error("Error fetching topic:", error);
        return { error: "Database error" };
    }
};

//Test function
// const testFetch = async () => {
//     const data = await getTopicById("1");
//     console.log("Test Fetch Topics:", data);
// };
// testFetch();

export {  getTopicById };
