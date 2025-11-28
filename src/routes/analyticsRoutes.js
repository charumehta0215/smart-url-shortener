import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getAnalyticsController } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/:slug",authMiddleware,getAnalyticsController);

export default router;