import { sql } from "../config/db";

const get_leaderBoard = async() => {
    try {
        console.log(`Fetching LeaderBoard`);
        const data = await sql`SELECT * from "Leaderboard";`;
        if (data.length === 0) {
            console.log("Data not Found");
            return { error: "Data not found" };
        }
        return { topic: data[0] };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Database error" };
    }
};


export { get_leaderBoard };