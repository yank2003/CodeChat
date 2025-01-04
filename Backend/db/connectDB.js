import mongoose from "mongoose";

//DONT NEED DOTENV here as when im calling this function in the server.js file , usse pehle i have thedotenv configured
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting database", error);
  }
};
