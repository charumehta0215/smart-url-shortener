import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {createShortlinkController,redirectController,getAllLinksController,updateLinkController,deleteLinkController} from "../controllers/linkController.js";
import { validate } from "../middlewares/validateRequest.js";
import { createLinkSchema } from "../schemas/linkSchema.js";

const router = express.Router();

router.post("/create",authMiddleware,validate(createLinkSchema),createShortlinkController);
router.get("/my-links",authMiddleware,getAllLinksController);
router.patch("/:slug", authMiddleware, updateLinkController);
router.delete("/:slug", authMiddleware, deleteLinkController);
router.get("/:slug",redirectController);

export default router;
