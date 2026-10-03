import {
  createGroqProvider
} from "./providers/groqProvider.js";

import {
  createMistralProvider
} from "./providers/mistralProvider.js";

export function createLLMProvider() {
  const provider =
    (
      process.env.LLM_PROVIDER ||
      "groq"
    ).toLowerCase();

  switch (provider) {
    case "groq":
      return createGroqProvider();

    case "mistral":
      return createMistralProvider();

    default:
      throw new Error(
        `Unsupported LLM provider: ${provider}`
      );
  }
}