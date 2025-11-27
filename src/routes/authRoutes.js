import express from "express";
import {registerController,loginController} from "../controllers/authController.js";
import { registerSchema,loginSchema } from "../schemas/authSchema.js";
import {validate} from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/register",validate(registerSchema),registerController);
router.post("/login",validate(loginSchema),loginController);

export default router;