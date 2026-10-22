import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("MONGODB_URI is not defined in backend/.env");
        return;
    }
    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log("DB Connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.log("Please check or configure MONGODB_URI in backend/.env");
    }
}