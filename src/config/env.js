const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  openAiKey: process.env.OPENAI_API_KEY,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15,
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100
};
