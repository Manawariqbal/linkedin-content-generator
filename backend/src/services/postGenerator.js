import { z } from "zod";

import { generateWithLLM } from "./llmService.js";

import {
  buildPostGenerationPrompt
} from "../prompts/linkedinPrompt.js";

import {
  validatePostsGrounding
} from "./groundingValidator.js";


const GeneratedPostSchema = z.object({
  contentType: z.string(),
  topic: z.string(),
  hook: z.string(),
  body: z.string(),
  callToAction: z.string(),
  hashtags: z.array(z.string())
});


const GeneratedPostsSchema = z.object({
  posts: z.array(
    GeneratedPostSchema
  ).min(3).max(5)
});


async function generateAndValidatePosts(
  profile,
  profileAnalysis,
  contentStrategy,
  groundingErrors = []
) {
  const prompt =
    buildPostGenerationPrompt(
      profile,
      profileAnalysis,
      contentStrategy,
      groundingErrors
    );

  const response =
    await generateWithLLM(prompt);

  let parsedResponse;

  try {
    parsedResponse =
      JSON.parse(response);
  } catch {
    console.error(
      "Invalid post generation JSON:",
      response
    );

    throw new Error(
      "LLM returned invalid JSON for LinkedIn posts"
    );
  }

  const validationResult =
    GeneratedPostsSchema.safeParse(
      parsedResponse
    );

  if (!validationResult.success) {
    console.error(
      "Generated posts validation failed:",
      validationResult.error.issues
    );

    throw new Error(
      "Generated LinkedIn posts have an invalid structure"
    );
  }

  if (
    validationResult.data.posts.length !== 5
  ) {
    throw new Error(
      "Exactly 5 LinkedIn posts are required"
    );
  }

  const groundingResult =
    validatePostsGrounding(
      validationResult.data.posts,
      profile
    );

  return {
    posts:
      validationResult.data.posts,

    groundingResult
  };
}


export async function generatePosts(
  profile,
  profileAnalysis,
  contentStrategy
) {
  const MAX_GROUNDING_RETRIES = 2;

  let groundingErrors = [];

  for (
    let attempt = 1;
    attempt <= MAX_GROUNDING_RETRIES + 1;
    attempt++
  ) {
    console.log(
      `Post generation attempt ${attempt}`
    );

    const result =
      await generateAndValidatePosts(
        profile,
        profileAnalysis,
        contentStrategy,
        groundingErrors
      );

    if (
      result.groundingResult.valid
    ) {
      console.log(
        "✅ Post grounding validation passed"
      );

      return {
        posts: result.posts
      };
    }

    console.error(
      "❌ Post grounding validation failed:",
      JSON.stringify(
        result.groundingResult,
        null,
        2
      )
    );

    groundingErrors =
      result.groundingResult.results.filter(
        (item) => !item.valid
      );
  }

  throw new Error(
    "Unable to generate fully grounded LinkedIn posts after multiple attempts"
  );
}