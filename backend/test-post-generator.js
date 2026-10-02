import {
  generatePosts,
  setLLMGenerator
} from "./src/services/postGenerator.js";


const profile = {
  name: "Sarah Chen",

  headline:
    "Senior Software Engineer at TechNova",

  experience: [
    {
      company: "TechNova",
      title: "Senior Software Engineer",
      description:
        "Building AI-powered cloud applications and distributed systems."
    }
  ],

  recentPosts: [
    {
      text:
        "AI demos are easy. Moving them to production requires careful engineering."
    },
    {
      text:
        "Distributed systems need to fail gracefully."
    },
    {
      text:
        "RAG systems introduce challenges around retrieval quality."
    }
  ]
};


const profileAnalysis = {
  expertise: [
    "AI",
    "Cloud Applications",
    "Distributed Systems"
  ]
};


const contentStrategy = {
  positioning:
    "Software engineer working with AI-powered cloud applications and distributed systems.",

  targetAudience: [
    "Software Engineers",
    "AI Engineers"
  ],

  contentPillars: [
    "AI",
    "Distributed Systems"
  ],

  contentIdeas: []
};


function createValidResponse() {
  return JSON.stringify({
    posts: [
      {
        contentType: "Educational",
        topic: "Distributed systems",
        hook: "Distributed systems need to fail gracefully.",
        body:
          "Distributed systems require careful thinking about dependencies and failure handling.",
        callToAction:
          "What principle do you follow when designing distributed systems?",
        hashtags: [
          "#DistributedSystems",
          "#SoftwareEngineering"
        ]
      },
      {
        contentType: "Educational",
        topic: "AI systems",
        hook: "AI applications need strong engineering foundations.",
        body:
          "Building AI-powered cloud applications requires careful system design.",
        callToAction:
          "What engineering principle matters most in AI applications?",
        hashtags: [
          "#AI",
          "#Engineering"
        ]
      },
      {
        contentType: "Industry Insight",
        topic: "RAG systems",
        hook: "Retrieval quality matters in RAG systems.",
        body:
          "RAG systems introduce important questions around retrieval quality.",
        callToAction:
          "How do you evaluate retrieval quality?",
        hashtags: [
          "#RAG",
          "#AI"
        ]
      },
      {
        contentType: "Practical Framework",
        topic: "Cloud applications",
        hook: "Good cloud architecture starts with clear dependencies.",
        body:
          "Understanding dependencies is important when designing cloud applications.",
        callToAction:
          "What do you check first when designing a cloud system?",
        hashtags: [
          "#Cloud",
          "#SoftwareEngineering"
        ]
      },
      {
        contentType: "Conversation Starter",
        topic: "Distributed systems",
        hook: "Failure handling is part of system design.",
        body:
          "Distributed systems should be designed with failure scenarios in mind.",
        callToAction:
          "What failure scenario do you consider first?",
        hashtags: [
          "#DistributedSystems"
        ]
      }
    ]
  });
}


function createInvalidResponse() {
  return JSON.stringify({
    posts: [
      {
        contentType: "Personal Experience",
        topic:
          "My production incident",
        hook:
          "When I moved our AI system to production, everything failed.",
        body:
          "I faced severe latency problems and redesigned the architecture.",
        callToAction:
          "Have you faced this?",
        hashtags: [
          "#AI"
        ]
      },
      {
        contentType: "Educational",
        topic: "AI",
        hook: "AI systems need good engineering.",
        body: "Engineering matters.",
        callToAction: "What do you think?",
        hashtags: ["#AI"]
      },
      {
        contentType: "Educational",
        topic: "Cloud",
        hook: "Cloud systems need planning.",
        body: "Planning matters.",
        callToAction: "What is your approach?",
        hashtags: ["#Cloud"]
      },
      {
        contentType: "Educational",
        topic: "RAG",
        hook: "RAG needs good retrieval.",
        body: "Retrieval matters.",
        callToAction: "How do you evaluate it?",
        hashtags: ["#RAG"]
      },
      {
        contentType: "Educational",
        topic: "Systems",
        hook: "Systems need reliability.",
        body: "Reliability matters.",
        callToAction: "What do you monitor?",
        hashtags: ["#Systems"]
      }
    ]
  });
}


async function runTest(
  name,
  mockResponses,
  expectedSuccess,
  expectedCalls
) {
  let callCount = 0;

  setLLMGenerator(async () => {
    const response =
      mockResponses[
        Math.min(
          callCount,
          mockResponses.length - 1
        )
      ];

    callCount++;

    return response;
  });

  try {
    await generatePosts(
      profile,
      profileAnalysis,
      contentStrategy
    );

    if (!expectedSuccess) {
      console.log(
        `FAIL: ${name}`
      );

      console.log(
        "Expected generation to fail"
      );

      return;
    }

    if (callCount !== expectedCalls) {
      console.log(
        `FAIL: ${name}`
      );

      console.log(
        `Expected ${expectedCalls} LLM calls, got ${callCount}`
      );

      return;
    }

    console.log(
      `PASS: ${name}`
    );
  } catch (error) {
    if (
      expectedSuccess
    ) {
      console.log(
        `FAIL: ${name}`
      );

      console.log(
        error.message
      );

      return;
    }

    if (callCount !== expectedCalls) {
      console.log(
        `FAIL: ${name}`
      );

      console.log(
        `Expected ${expectedCalls} LLM calls, got ${callCount}`
      );

      return;
    }

    console.log(
      `PASS: ${name}`
    );
  }
}


console.log(
  "\nRunning post generator tests...\n"
);


// Test 1
// Valid response should succeed immediately.

await runTest(
  "Valid response succeeds immediately",
  [
    createValidResponse()
  ],
  true,
  1
);


// Test 2
// Invalid grounding should trigger retries.

await runTest(
  "Invalid grounding triggers retry",
  [
    createInvalidResponse(),
    createValidResponse()
  ],
  true,
  2
);


// Test 3
// Repeated invalid responses should eventually fail.

await runTest(
  "Repeated invalid responses eventually fail",
  [
    createInvalidResponse(),
    createInvalidResponse(),
    createInvalidResponse()
  ],
  false,
  3
);


console.log(
  "\nPost generator tests completed.\n"
);