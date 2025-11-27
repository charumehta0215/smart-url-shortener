import mongoose from "mongoose";
import config from "./env.js";
import logger from "./logger.js";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
    logger.info("MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Optional: MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB event: connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB event: error", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB event: disconnected");
});

// Export the function
export default connectDB;
