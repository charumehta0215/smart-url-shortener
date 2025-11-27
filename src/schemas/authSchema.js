import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Za-z]/, "Password must contain at least one letter"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
