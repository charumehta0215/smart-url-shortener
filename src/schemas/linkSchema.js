import { z } from "zod";

export const createLinkSchema = z.object({
  longURL: z
    .string({
      required_error: "longURL is required",
      invalid_type_error: "longURL must be a string",
    })
    .url("Please provide a valid URL"),
});
