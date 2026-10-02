import {
  setLLMGenerator,
  createContentStrategy
} from "./src/services/contentStrategy.js";


const profile = {
  name: "Sarah Chen",
  headline: "Senior Software Engineer at TechNova",
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
  professionalIdentity:
    "Senior software engineer working with AI-powered cloud applications and distributed systems.",

  technicalDomains: [
    "AI",
    "Cloud Applications",
    "Distributed Systems",
    "RAG"
  ],

  audience:
    "Software Engineers"
};


const validStrategy = {
  contentIdeas: [
    {
      type: "Educational / How-to",
      topic:
        "Designing resilient distributed systems",
      objective:
        "Teach engineers how to design systems that fail gracefully",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Identify failure modes",
        "Use graceful degradation",
        "Add observability"
      ],
      suggestedHook:
        "How do you design a distributed system that fails gracefully?"
    },
    {
      type: "Industry Insight",
      topic:
        "Why AI prototypes need production engineering",
      objective:
        "Explain the engineering considerations involved in productionizing AI systems",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Reliability",
        "Observability",
        "Operational constraints"
      ],
      suggestedHook:
        "AI demos are easy. Production engineering is where the real complexity begins."
    },
    {
      type: "Practical Framework / Lessons",
      topic:
        "A practical framework for evaluating RAG retrieval quality",
      objective:
        "Provide a structured approach for evaluating retrieval quality",
      targetAudience: [
        "AI Engineers"
      ],
      keyPoints: [
        "Define retrieval goals",
        "Evaluate retrieved context",
        "Monitor retrieval quality"
      ],
      suggestedHook:
        "Before improving your RAG pipeline, make sure you know how to measure retrieval quality."
    },
    {
      type: "Conversation Starter",
      topic:
        "What makes a distributed system resilient?",
      objective:
        "Start a discussion about reliability engineering",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Failure handling",
        "Graceful degradation",
        "Observability"
      ],
      suggestedHook:
        "What is the most important property of a resilient distributed system?"
    },
    {
      type: "Educational / How-to",
      topic:
        "From AI prototype to production-ready application",
      objective:
        "Explain the major engineering considerations when moving AI applications beyond prototypes",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Reliability",
        "Observability",
        "Operational constraints"
      ],
      suggestedHook:
        "What changes when an AI application moves beyond the prototype stage?"
    }
  ]
};


const invalidStrategy = {
  contentIdeas: [
    {
      type: "Personal Experience / Story",
      topic:
        "When I moved our distributed system to production",
      objective:
        "Share what I learned from a production migration",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "I faced severe scaling problems",
        "I redesigned the architecture",
        "Our production system experienced cascading failures"
      ],
      suggestedHook:
        "When I moved our distributed system to production, everything changed."
    },
    {
      type: "Educational / How-to",
      topic:
        "Designing resilient systems",
      objective:
        "Teach engineers about reliability",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Failure modes",
        "Graceful degradation",
        "Observability"
      ],
      suggestedHook:
        "How do you design systems that fail gracefully?"
    },
    {
      type: "Industry Insight",
      topic:
        "AI production engineering",
      objective:
        "Discuss production considerations",
      targetAudience: [
        "Software Engineers"
      ],
      keyPoints: [
        "Reliability",
        "Monitoring",
        "Operational constraints"
      ],
      suggestedHook:
        "AI production requires more than a working prototype."
    },
    {
      type: "Practical Framework / Lessons",
      topic:
        "Evaluating RAG systems",
      objective:
        "Explain retrieval evaluation",
      targetAudience: [
        "AI Engineers"
      ],
      keyPoints: [
        "Retrieval quality",
        "Context evaluation",
        "Monitoring"
      ],
      suggestedHook:
        "How should you evaluate a RAG system?"
    },
    {
      type: "Conversation Starter",
      topic:
        "Building reliable AI systems",
      objective:
        "Start a discussion",
      targetAudience: [
        "AI Engineers"
      ],
      keyPoints: [
        "Reliability",
        "Observability",
        "Engineering"
      ],
      suggestedHook:
        "What makes an AI system reliable?"
    }
  ]
};


function createMockGenerator(responses) {
  let callCount = 0;

  return async function mockGenerator() {
    const response =
      responses[
        Math.min(
          callCount,
          responses.length - 1
        )
      ];

    callCount++;

    return JSON.stringify(
      response
    );
  };
}


async function test(
  name,
  generator,
  expectedSuccess
) {
  setLLMGenerator(generator);

  try {
    const result =
      await createContentStrategy(
        profile,
        profileAnalysis
      );

    const passed =
      expectedSuccess === true;

    console.log(
      `${passed ? "PASS" : "FAIL"}: ${name}`
    );

    if (!passed) {
      console.log(
        JSON.stringify(
          result,
          null,
          2
        )
      );
    }
  } catch (error) {
    const passed =
      expectedSuccess === false;

    console.log(
      `${passed ? "PASS" : "FAIL"}: ${name}`
    );

    if (!passed) {
      console.error(
        error.message
      );
    }
  }
}


console.log(
  "\nRunning strategy generator tests...\n"
);


/*
 * TEST 1
 *
 * Valid strategy should succeed
 * on the first attempt.
 */
await test(
  "Valid strategy succeeds immediately",
  createMockGenerator([
    validStrategy
  ]),
  true
);


/*
 * TEST 2
 *
 * First response contains unsupported
 * personal claims.
 *
 * Second response is valid.
 *
 * The generator should retry and
 * eventually succeed.
 */
await test(
  "Invalid grounding triggers retry",
  createMockGenerator([
    invalidStrategy,
    validStrategy
  ]),
  true
);


/*
 * TEST 3
 *
 * Every response contains unsupported
 * personal claims.
 *
 * The generator should stop after
 * the configured retry limit.
 */
await test(
  "Repeated invalid responses eventually fail",
  createMockGenerator([
    invalidStrategy,
    invalidStrategy,
    invalidStrategy
  ]),
  false
);


console.log(
  "\nStrategy generator tests completed."
);