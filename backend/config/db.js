import mongoose from "mongoose";
import { seedDatabase } from "./seedData.js";

let mongodInstance = null;

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    const hasValidUri = mongoUri && 
        mongoUri.trim() !== "" && 
        !mongoUri.includes("<username>") && 
        !mongoUri.includes("example.mongodb.net");

    if (hasValidUri) {
        try {
            console.log("Connecting to configured MongoDB URI...");
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
            console.log("DB Connected successfully to external MongoDB");
            await seedDatabase();
            return;
        } catch (error) {
            console.warn(`External MongoDB connection failed (${error.message}). Falling back to embedded development MongoDB...`);
        }
    }

    try {
        console.log("Initializing embedded development MongoDB server...");
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        mongodInstance = await MongoMemoryServer.create({
            instance: {
                dbName: "food-del"
            }
        });
        const uri = mongodInstance.getUri();
        await mongoose.connect(uri);
        console.log("DB Connected successfully (Embedded development MongoDB active)");
        await seedDatabase();
    } catch (fallbackError) {
        console.error("Embedded MongoDB startup failed:", fallbackError.message);
        console.log("Please check or configure MONGODB_URI in backend/.env");
    }
};

const cleanup = async () => {
    if (mongodInstance) {
        try {
            await mongodInstance.stop();
        } catch (e) {}
    }
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);