import dotenv from "dotenv";
import { createLLMProvider } from "./llm/llmFactory.js";

dotenv.config();

let provider;

function getProvider() {
  if (!provider) {
    provider = createLLMProvider();

    console.log(
      `Using LLM provider: ${provider.name}`
    );
  }

  return provider;
}

export async function generateWithLLM(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error(
      "LLM prompt must be a non-empty string"
    );
  }

  try {
    const llmProvider = getProvider();

    return await llmProvider.generate(prompt);
  } catch (error) {
    console.error(
      "LLM generation failed:",
      error.message
    );

    throw new Error(
      `LLM generation failed: ${error.message}`
    );
  }
}