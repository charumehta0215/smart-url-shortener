import express from "express";
import {registerController,loginController,googleLoginController} from "../controllers/authController.js";
import { registerSchema,loginSchema,googleLoginSchema} from "../schemas/authSchema.js";
import {validate} from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/register",validate(registerSchema),registerController);
router.post("/login",validate(loginSchema),loginController);
router.post("/google-login",validate(googleLoginSchema), googleLoginController);

export default router;