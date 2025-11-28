import mongoose from "mongoose";
import config from "./env.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
