import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
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
    console.error("Groq AI Error:", error.message);
    return "AI summary unavailable right now.";
  }
};
