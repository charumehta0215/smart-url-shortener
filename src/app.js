import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import config from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import redisRateLimit from "./middlewares/redisRateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Rate Limiter
app.use(redisRateLimit(100,15*60));
app.use('/api/auth', redisRateLimit(20, 15 * 60));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/link', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

export default app;
