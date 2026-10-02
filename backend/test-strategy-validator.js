import {
  validateStrategyGrounding
} from "./src/services/strategyGroundingValidator.js";

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

function test(name, strategy, expectedValid) {
  const result =
    validateStrategyGrounding(
      strategy,
      profile
    );

  const passed =
    result.valid === expectedValid;

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
}

console.log(
  "\nRunning strategy grounding tests...\n"
);


/*
 * TEST 1
 *
 * This should PASS.
 *
 * It is a general educational topic and
 * does not claim that Sarah personally
 * implemented anything.
 */
test(
  "Educational idea",
  {
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
      }
    ]
  },
  true
);


/*
 * TEST 2
 *
 * This should FAIL.
 *
 * The profile does NOT explicitly say
 * that Sarah moved an AI prototype to
 * production.
 */
test(
  "Unsupported personal production story",
  {
    contentIdeas: [
      {
        type: "Personal Experience / Story",
        topic:
          "Moving an AI prototype to production",
        objective:
          "Share three lessons I learned while moving an AI prototype to production",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Production constraints were different from the demo",
          "I learned that data pipelines were critical",
          "I discovered that observability was essential"
        ],
        suggestedHook:
          "When I moved an AI prototype to production, I learned three important lessons."
      }
    ]
  },
  false
);


/*
 * TEST 3
 *
 * This should PASS.
 *
 * The topic is relevant to the profile,
 * but does not claim a personal event.
 */
test(
  "Reflective professional observation",
  {
    contentIdeas: [
      {
        type: "Personal Experience / Story",
        topic:
          "A professional reflection on taking AI applications beyond prototypes",
        objective:
          "Explore the engineering considerations that become important as AI applications mature",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Prototype and production environments have different requirements",
          "Reliability and observability become increasingly important",
          "Engineering decisions should account for operational constraints"
        ],
        suggestedHook:
          "What changes when an AI application moves beyond the prototype stage?"
      }
    ]
  },
  true
);


/*
 * TEST 4
 *
 * This should FAIL.
 *
 * The profile does not document this
 * specific incident.
 */
test(
  "Invented production incident",
  {
    contentIdeas: [
      {
        type: "Personal Experience / Story",
        topic:
          "The production incident that changed how I build AI systems",
        objective:
          "Explain what I learned after a production outage",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Our production system experienced an outage",
          "I discovered a data pipeline failure",
          "We redesigned the system afterward"
        ],
        suggestedHook:
          "One production incident completely changed how I approach AI systems."
      }
    ]
  },
  false
);


/*
 * TEST 5
 *
 * This should PASS.
 *
 * The profile actually contains
 * "distributed systems" and the idea
 * stays educational.
 */
test(
  "Documented domain topic",
  {
    contentIdeas: [
      {
        type: "Practical Framework / Lessons",
        topic:
          "Checklist for resilient distributed systems",
        objective:
          "Provide engineers with a practical reliability checklist",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Identify failure modes",
          "Design graceful degradation",
          "Use observability"
        ],
        suggestedHook:
          "Building distributed systems? Start with these reliability checks."
      }
    ]
  },
  true
);


/*
 * TEST 6
 *
 * This should FAIL.
 *
 * The profile does not document:
 * - circuit breakers
 * - cascading timeouts
 * - back-pressure
 * - specific scaling implementation
 */
test(
  "Invented implementation details",
  {
    contentIdeas: [
      {
        type: "Personal Experience / Story",
        topic:
          "How I fixed cascading timeouts in production",
        objective:
          "Share how I redesigned the system after a scaling problem",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "I implemented circuit breakers",
          "I introduced back-pressure",
          "I redesigned the service for graceful degradation"
        ],
        suggestedHook:
          "When cascading timeouts brought our service down, I redesigned the system."
      }
    ]
  },
  false
);


/*
 * TEST 7
 *
 * This should FAIL.
 *
 * The profile contains another documented
 * personal experience, but it does not
 * document:
 * - moving a distributed system to production
 * - scaling problems
 * - cascading failures
 * - production migration
 *
 * This checks that evidence from one
 * personal experience is not incorrectly
 * used to validate an unrelated story.
 */
test(
  "Rejects unrelated personal story despite another documented experience",
  {
    contentIdeas: [
      {
        type: "Personal Experience / Story",
        topic:
          "When I moved a distributed system to production",
        objective:
          "Share what I learned from a production migration",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "I faced severe scaling problems",
          "I redesigned the architecture",
          "The system experienced cascading failures"
        ],
        suggestedHook:
          "When I moved our distributed system to production, everything changed."
      }
    ]
  },
  false
);


console.log(
  "\nStrategy grounding tests completed."
);