import {
  validatePostsGrounding
} from "./src/services/groundingValidator.js";


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


function runTest(name, post, expectedValid) {
  const result =
    validatePostsGrounding(
      [post],
      profile
    );

  const actualValid =
    result.valid;

  if (
    actualValid === expectedValid
  ) {
    console.log(
      `PASS: ${name}`
    );
  } else {
    console.log(
      `FAIL: ${name}`
    );

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
  "\nRunning post grounding tests...\n"
);


// 1. Valid educational post

runTest(
  "Valid educational post",
  {
    contentType:
      "Educational / How-to",

    topic:
      "How distributed systems handle failures",

    hook:
      "Distributed systems need to fail gracefully.",

    body:
      "Designing systems that tolerate failures requires careful thinking about dependencies and recovery.",

    callToAction:
      "What failure-handling techniques do you use?",

    hashtags: [
      "#DistributedSystems",
      "#SoftwareEngineering"
    ]
  },
  true
);


// 2. Unsupported personal production story

runTest(
  "Unsupported personal production story",
  {
    contentType:
      "Personal Experience / Story",

    topic:
      "What I learned from moving an AI prototype to production",

    hook:
      "When I moved our AI prototype to production, everything changed.",

    body:
      "I faced serious latency problems and redesigned the entire architecture.",

    callToAction:
      "Have you experienced the same thing?",

    hashtags: [
      "#AI",
      "#Engineering"
    ]
  },
  false
);


// 3. Unsupported production incident

runTest(
  "Unsupported production incident",
  {
    contentType:
      "Personal Experience / Story",

    topic:
      "A production outage taught me an important lesson",

    hook:
      "Our production system went down during peak traffic.",

    body:
      "I discovered that a database bottleneck was causing cascading failures.",

    callToAction:
      "How do you prepare for incidents?",

    hashtags: [
      "#SRE",
      "#Production"
    ]
  },
  false
);


// 4. Unsupported team claim

runTest(
  "Unsupported team claim",
  {
    contentType:
      "Industry Insight",

    topic:
      "Building reliable AI systems",

    hook:
      "Our team deployed a new AI architecture.",

    body:
      "Our system handled millions of requests after we introduced caching.",

    callToAction:
      "What architecture patterns do you use?",

    hashtags: [
      "#AI",
      "#Architecture"
    ]
  },
  false
);


// 5. Unsupported metric

runTest(
  "Unsupported metric",
  {
    contentType:
      "Industry Insight",

    topic:
      "Improving AI application performance",

    hook:
      "Small engineering improvements can make a big difference.",

    body:
      "A well-designed architecture can improve response time by 85%.",

    callToAction:
      "What performance improvements have you seen?",

    hashtags: [
      "#AI",
      "#Performance"
    ]
  },
  false
);


// 6. Valid profile-grounded post

runTest(
  "Valid profile-grounded post",
  {
    contentType:
      "Professional Perspective",

    topic:
      "Lessons from working with distributed systems",

    hook:
      "Distributed systems need to fail gracefully.",

    body:
      "Working in distributed systems has reinforced the importance of designing for failure and understanding system dependencies.",

    callToAction:
      "What is one principle you follow when designing distributed systems?",

    hashtags: [
      "#DistributedSystems",
      "#SoftwareEngineering"
    ]
  },
  true
);


console.log(
  "\nPost grounding tests completed.\n"
);