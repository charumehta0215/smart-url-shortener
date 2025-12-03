import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
  nodeEnv: process.env.NODE_ENV,
  openAiKey: process.env.OPENAI_API_KEY,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15,
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
  groqApiKey: process.env.GROQ_API_KEY,
  Origin:process.env.ORIGIN ? process.env.ORIGIN.split(',') : ['http://localhost:8080']
};

export default config;
