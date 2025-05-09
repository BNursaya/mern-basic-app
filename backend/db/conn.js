import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = "mongodb://localhost:27017/stek";

const connectDB = async () => {
    try {
        // await mongoose.connect(mongoURI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export { connectDB };