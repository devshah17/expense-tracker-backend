import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("mongoDB connected");
        return connection;
    }
    catch (error: any) {
        console.log("Failed to connect DB", error);

    }
}