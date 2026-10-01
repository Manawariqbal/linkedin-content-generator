import { generateWithLLM } from "./llmService.js";

import {
  buildContentStrategyPrompt
} from "../prompts/linkedinPrompt.js";

import {
  validateStrategyGrounding
} from "./strategyGroundingValidator.js";


export async function createContentStrategy(
  profile,
  profileAnalysis
) {
  const prompt =
    buildContentStrategyPrompt(
      profile,
      profileAnalysis
    );

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
      "LLM returned invalid JSON for content strategy"
    );
  }

  if (
    !parsedResponse ||
    typeof parsedResponse !== "object"
  ) {
    throw new Error(
      "LLM returned an invalid content strategy"
    );
  }

  if (
    !Array.isArray(
      parsedResponse.contentIdeas
    )
  ) {
    throw new Error(
      "Content strategy must contain contentIdeas"
    );
  }

  if (
    parsedResponse.contentIdeas.length !== 5
  ) {
    throw new Error(
      "Exactly 5 content ideas are required"
    );
  }

  /*
   * Validate that the strategy is grounded
   * in the actual LinkedIn profile.
   */
  const groundingResult =
    validateStrategyGrounding(
      parsedResponse,
      profile
    );

  if (!groundingResult.valid) {
    console.error(
      "❌ Content strategy grounding failed:",
      JSON.stringify(
        groundingResult,
        null,
        2
      )
    );

    throw new Error(
      "Generated content strategy contains unsupported profile claims"
    );
  }

  console.log(
    "✅ Content strategy grounding validation passed"
  );

  return parsedResponse;
}