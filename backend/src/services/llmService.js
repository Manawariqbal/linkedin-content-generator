import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const provider = process.env.LLM_PROVIDER || "groq";

const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY
    })
  : null;

async function generateWithGroq(prompt) {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const model =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";

  const response = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}

export async function generateWithLLM(prompt) {
  if (provider !== "groq") {
    throw new Error(
      `Unsupported LLM provider: ${provider}. Production currently supports Groq only.`
    );
  }

  try {
    console.log("Using Groq for LLM generation");

    return await generateWithGroq(prompt);
  } catch (error) {
    console.error("Groq generation failed:", error.message);

    throw new Error(
      `Groq generation failed: ${error.message}`
    );
  }
}