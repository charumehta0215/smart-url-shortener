import Groq from "groq-sdk";
import config from "../config/env.js";
import logger from "../config/logger.js";

const client = new Groq({
  apiKey: config.groqApiKey,
});

export const callAI = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",   // Cheapest & super fast
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0].message.content;

  } catch (error) {
    logger.error("Groq AI Error:", error.message);
    return "AI summary unavailable right now.";
  }
};
