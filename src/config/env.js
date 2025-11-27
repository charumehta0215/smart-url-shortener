import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  openAiKey: process.env.OPENAI_API_KEY,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15,
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100
};

export default config;
