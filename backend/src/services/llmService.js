import dotenv from "dotenv";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const provider =
  process.env.LLM_PROVIDER || "groq";

const groq =
  process.env.GROQ_API_KEY
    ? new Groq({
        apiKey: process.env.GROQ_API_KEY
      })
    : null;

const gemini =
  process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      )
    : null;

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

async function generateWithGroq(prompt) {
  if (!groq) {
    throw new Error(
      "GROQ_API_KEY is not configured"
    );
  }

  const model =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";

  const response =
    await groq.chat.completions.create({
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

async function generateWithGemini(prompt) {
  if (!gemini) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  const model =
    gemini.getGenerativeModel({
      model: "gemini-3.8-flash"
    });

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}

export async function generateWithLLM(
  prompt
) {
  const providers =
    provider === "gemini"
      ? ["gemini", "groq"]
      : ["groq", "gemini"];

  let lastError;

  for (const currentProvider of providers) {
    for (
      let attempt = 1;
      attempt <= 2;
      attempt++
    ) {
      try {
        console.log(
          `Using ${currentProvider} - attempt ${attempt}`
        );

        if (
          currentProvider === "groq"
        ) {
          return await generateWithGroq(
            prompt
          );
        }

        if (
          currentProvider === "gemini"
        ) {
          return await generateWithGemini(
            prompt
          );
        }
      } catch (error) {
        lastError = error;

        console.error(
          `${currentProvider} failed:`,
          error.message
        );

        if (attempt < 2) {
          await sleep(
            attempt * 1500
          );
        }
      }
    }

    console.log(
      `${currentProvider} unavailable. Trying fallback...`
    );
  }

  throw new Error(
    `All LLM providers failed: ${lastError?.message}`
  );
}