import { generateWithLLM } from "./llmService.js";

import {
  buildContentStrategyPrompt
} from "../prompts/linkedinPrompt.js";

import {
  validateStrategyGrounding
} from "./strategyGroundingValidator.js";


let llmGenerator = generateWithLLM;


export function setLLMGenerator(generator) {
  llmGenerator = generator;
}


function parseStrategyResponse(response) {
  if (!response || typeof response !== "string") {
    throw new Error(
      "LLM returned an empty response for content strategy"
    );
  }

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(response);
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

  return parsedResponse;
}


function buildRetryPrompt(
  profile,
  profileAnalysis,
  groundingResult
) {
  const groundingErrors =
    groundingResult.results
      .filter(
        (result) => !result.valid
      )
      .map((result) => ({
        ideaIndex:
          result.ideaIndex,
        issues:
          result.issues
      }));

  const basePrompt =
    buildContentStrategyPrompt(
      profile,
      profileAnalysis
    );

  return `
${basePrompt}

IMPORTANT: The previous strategy contained unsupported
personal claims.

You must regenerate the complete content strategy.

Use the LinkedIn profile as the only source of truth
for personal facts and experiences.

Do not invent:
- personal stories
- production incidents
- failures
- achievements
- metrics
- performance improvements
- customer outcomes
- team experiences
- specific implementation details
- technologies not documented in the profile
- events that are not explicitly supported by the profile

If the profile does not contain enough evidence for a
specific personal story, create a professional perspective
or lesson based only on documented experience instead.

Previous grounding validation errors:

${JSON.stringify(
  groundingErrors,
  null,
  2
)}

Return exactly 5 content ideas in the required JSON format.
`;
}


export async function createContentStrategy(
  profile,
  profileAnalysis
) {
  const MAX_RETRIES = 2;

  let prompt =
    buildContentStrategyPrompt(
      profile,
      profileAnalysis
    );

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES + 1;
    attempt++
  ) {
    console.log(
      `Content strategy generation attempt ${attempt}`
    );

    const response =
      await llmGenerator(prompt);

    const parsedResponse =
      parseStrategyResponse(
        response
      );

    const groundingResult =
      validateStrategyGrounding(
        parsedResponse,
        profile
      );

    if (
      groundingResult.valid
    ) {
      console.log(
        "Content strategy grounding validation passed"
      );

      return parsedResponse;
    }

    console.error(
      "Content strategy grounding failed:"
    );

    console.error(
      JSON.stringify(
        groundingResult,
        null,
        2
      )
    );

    if (
      attempt >
      MAX_RETRIES
    ) {
      throw new Error(
        "Generated content strategy contains unsupported profile claims after multiple attempts"
      );
    }

    prompt =
      buildRetryPrompt(
        profile,
        profileAnalysis,
        groundingResult
      );
  }
}