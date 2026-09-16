import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;
export const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error("MongoDB connection was skipped because MONGO_URI is not configured.");
        return;
    }

    try{
        const dbConnection= await mongoose.connect(MONGODB_URI);
        console.log(`database connected to | host :${dbConnection.connection.host}`);

    }catch (error){
        console.error(error);
    }
}
