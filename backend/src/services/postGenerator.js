import { z } from "zod";

import { generateWithLLM } from "./llmService.js";

import {
  buildPostGenerationPrompt
} from "../prompts/linkedinPrompt.js";

import {
  validatePostsGrounding
} from "./groundingValidator.js";


let llmGenerator = generateWithLLM;


export function setLLMGenerator(generator) {
  llmGenerator = generator;
}


const GeneratedPostSchema = z.object({
  contentType: z.string().min(1),
  topic: z.string().min(1),
  hook: z.string().min(1),
  body: z.string().min(1),
  callToAction: z.string().min(1),
  hashtags: z.array(z.string()).min(1)
});


const GeneratedPostsSchema = z.object({
  posts: z.array(
    GeneratedPostSchema
  ).length(5)
});


function parseLLMResponse(response) {
  if (!response || typeof response !== "string") {
    throw new Error(
      "LLM returned an empty response"
    );
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error(
      "Failed to parse LLM response as JSON:"
    );

    console.error(response);

    throw new Error(
      "LLM returned invalid JSON for LinkedIn posts"
    );
  }
}


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
    await llmGenerator(prompt);

  const parsedResponse =
    parseLLMResponse(response);

  const validationResult =
    GeneratedPostsSchema.safeParse(
      parsedResponse
    );

  if (!validationResult.success) {
    console.error(
      "Generated posts validation failed:"
    );

    console.error(
      validationResult.error.issues
    );

    throw new Error(
      "Generated LinkedIn posts have an invalid structure"
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
        "Post grounding validation passed"
      );

      return {
        posts: result.posts
      };
    }

    console.error(
      "Post grounding validation failed:"
    );

    console.error(
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