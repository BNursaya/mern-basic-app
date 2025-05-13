// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ MongoDB сәтті қосылды");
//     } catch (err) {
//         console.error("❌ MongoDB қосылу қатесі:", err);
//         process.exit(1);
//     }
// };

// export { connectDB };



import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//const mongoURI = "mongodb+srv://nursayabayan:aza123@cluster0.bhqmwqr.mongodb.net/mernstore?retryWrites=true&w=majority&appName=Cluster0";

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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
export { connectDB };