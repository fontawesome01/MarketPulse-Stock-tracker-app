import {connectiontoDatabase} from "./database/mongoose";

async function checkDB() {
    try {
        await connectiontoDatabase();
        console.log("🎉 Database connection check PASSED");
        process.exit(0);
    } catch (error) {
        console.error("🚨 Database connection check FAILED");
        process.exit(1);
    }
}

checkDB();
