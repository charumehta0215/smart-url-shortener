import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getAnalyticsController,getGlobalAnalyticsController } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/global", authMiddleware, getGlobalAnalyticsController);
router.get("/:slug",authMiddleware,getAnalyticsController);


export default router;