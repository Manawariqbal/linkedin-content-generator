import { generateWithLLM } from "./llmService.js";
import { ProfileAnalysisSchema } from "../schemas/contentSchema.js";
import {
  buildProfileAnalysisPrompt
} from "../prompts/linkedinPrompt.js";

export async function analyzeProfile(profile) {
  const prompt =
    buildProfileAnalysisPrompt(profile);

  const response =
    await generateWithLLM(prompt);

  let parsedResponse;

  try {
    parsedResponse =
      JSON.parse(response);
  } catch {
    console.error(
      "Invalid JSON from LLM:",
      response
    );

    throw new Error(
      "LLM returned invalid JSON for profile analysis"
    );
  }

  const validationResult =
    ProfileAnalysisSchema.safeParse(
      parsedResponse
    );

  if (!validationResult.success) {
    console.error(
      "Profile analysis validation failed:",
      validationResult.error.issues
    );

    throw new Error(
      "LLM returned an invalid profile analysis structure"
    );
  }

  return validationResult.data;
}