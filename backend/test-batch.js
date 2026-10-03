import assert from "node:assert/strict";

import {
  generateBatchContent,
  setBatchDependencies
} from "./src/controllers/contentController.js";


const validProfile = {
  id: "test-profile",
  name: "Test User",
  headline: "Software Engineer",
  about: "Software engineer with backend experience",
  location: "India",
  currentCompany: "Test Company",
  currentTitle: "Software Engineer",
  experience: [
    {
      company: "Test Company",
      jobTitle: "Software Engineer",
      description: "Backend development"
    }
  ],
  education: [],
  recentPosts: [],
  followers: 100,
  connections: 500,
  profileUrl:
    "https://www.linkedin.com/in/test-user/"
};


setBatchDependencies({
  fetchProfile: async (linkedinUrl) => {
    if (linkedinUrl.includes("failure")) {
      throw new Error("Profile fetch failed");
    }

    return {
      ...validProfile,
      profileUrl: linkedinUrl
    };
  },

  analyze: async () => ({
    seniority: "Mid-level",
    industry: "Technology",
    expertise: ["Backend Development"],
    targetAudience: ["Software Engineers"],
    contentThemes: ["Software Development"],
    tone: ["Professional"],
    writingStyle: {
      sentenceLength: "Medium",
      usesStories: false,
      usesLists: true,
      usesQuestions: true,
      usesPersonalExperience: true
    },
    positioning:
      "Software engineer focused on backend development"
  }),

  createStrategy: async () => ({
    positioning:
      "Software engineer focused on backend development",

    targetAudience: [
      "Software Engineers"
    ],

    contentPillars: [
      "Backend Development",
      "Software Engineering"
    ],

    contentIdeas: [
      {
        type: "Educational",
        topic: "Backend Development",
        objective: "Educate developers",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Backend fundamentals"
        ],
        suggestedHook:
          "What makes a good backend?"
      },
      {
        type: "Educational",
        topic: "APIs",
        objective: "Explain APIs",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "API fundamentals"
        ],
        suggestedHook:
          "How do APIs work?"
      },
      {
        type: "Industry Insight",
        topic: "Backend Trends",
        objective: "Discuss trends",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Modern backend systems"
        ],
        suggestedHook:
          "What is changing in backend development?"
      },
      {
        type: "Practical Framework",
        topic: "Backend Design",
        objective: "Provide a framework",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Design principles"
        ],
        suggestedHook:
          "How should you design a backend?"
      },
      {
        type: "Conversation Starter",
        topic: "Backend Engineering",
        objective: "Start discussion",
        targetAudience: [
          "Software Engineers"
        ],
        keyPoints: [
          "Engineering practices"
        ],
        suggestedHook:
          "What backend practice helped you most?"
      }
    ]
  }),

  generate: async () => ({
    posts: [
      {
        contentType: "Educational",
        topic: "Backend Development",
        hook: "A backend lesson",
        body:
          "Backend development matters.",
        callToAction:
          "What do you think?",
        hashtags: ["#Backend"]
      },
      {
        contentType: "Educational",
        topic: "APIs",
        hook: "API lesson",
        body:
          "APIs connect systems.",
        callToAction:
          "Share your experience.",
        hashtags: ["#API"]
      },
      {
        contentType: "Industry Insight",
        topic: "Backend Trends",
        hook: "Backend trends",
        body:
          "Backend systems are evolving.",
        callToAction:
          "What have you noticed?",
        hashtags: ["#Technology"]
      },
      {
        contentType: "Practical Framework",
        topic: "Backend Design",
        hook:
          "Design better backends",
        body:
          "Use clear design principles.",
        callToAction:
          "What principle do you follow?",
        hashtags: [
          "#SoftwareEngineering"
        ]
      },
      {
        contentType: "Conversation Starter",
        topic: "Backend Engineering",
        hook:
          "Backend engineering",
        body:
          "Good engineering practices matter.",
        callToAction:
          "Share your thoughts.",
        hashtags: ["#Engineering"]
      }
    ]
  })
});


function createMockResponse() {
  return {
    statusCode: null,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    }
  };
}


async function testSuccessfulBatch() {
  const req = {
    body: {
      linkedinUrls: [
        "https://www.linkedin.com/in/user-one/",
        "https://www.linkedin.com/in/user-two/"
      ]
    }
  };

  const res = createMockResponse();

  await generateBatchContent(req, res);

  assert.equal(
    res.statusCode,
    200
  );

  assert.equal(
    res.body.success,
    true
  );

  assert.equal(
    res.body.data.total,
    2
  );

  assert.equal(
    res.body.data.successful,
    2
  );

  assert.equal(
    res.body.data.failed,
    0
  );

  console.log(
    "PASS: successful batch"
  );
}


async function testPartialFailure() {
  const req = {
    body: {
      linkedinUrls: [
        "https://www.linkedin.com/in/user-one/",
        "https://www.linkedin.com/in/failure/"
      ]
    }
  };

  const res = createMockResponse();

  await generateBatchContent(req, res);

  assert.equal(
    res.statusCode,
    200
  );

  assert.equal(
    res.body.success,
    true
  );

  assert.equal(
    res.body.data.total,
    2
  );

  assert.equal(
    res.body.data.successful,
    1
  );

  assert.equal(
    res.body.data.failed,
    1
  );

  console.log(
    "PASS: partial batch failure"
  );
}


async function testInvalidUrls() {
  const req = {
    body: {
      linkedinUrls: [
        "hello",
        "https://google.com"
      ]
    }
  };

  const res = createMockResponse();

  await generateBatchContent(req, res);

  assert.equal(
    res.statusCode,
    400
  );

  assert.equal(
    res.body.success,
    false
  );

  assert.equal(
    res.body.invalidUrls.length,
    2
  );

  console.log(
    "PASS: invalid URL validation"
  );
}


async function testDuplicateUrls() {
  const req = {
    body: {
      linkedinUrls: [
        "https://www.linkedin.com/in/user-one/",
        "https://www.linkedin.com/in/user-one/"
      ]
    }
  };

  const res = createMockResponse();

  await generateBatchContent(req, res);

  assert.equal(
    res.statusCode,
    200
  );

  assert.equal(
    res.body.success,
    true
  );

  assert.equal(
    res.body.data.total,
    1
  );

  assert.equal(
    res.body.data.successful,
    1
  );

  assert.equal(
    res.body.data.failed,
    0
  );

  console.log(
    "PASS: duplicate URL removal"
  );
}


async function testMaximumBatchSize() {
  const urls = Array.from(
    { length: 11 },
    (_, index) =>
      `https://www.linkedin.com/in/user-${index}/`
  );

  const req = {
    body: {
      linkedinUrls: urls
    }
  };

  const res = createMockResponse();

  await generateBatchContent(req, res);

  assert.equal(
    res.statusCode,
    400
  );

  assert.equal(
    res.body.success,
    false
  );

  assert.equal(
    res.body.error,
    "Maximum batch size is 10 profiles"
  );

  console.log(
    "PASS: maximum batch size"
  );
}


async function runTests() {
  await testSuccessfulBatch();

  await testPartialFailure();

  await testInvalidUrls();

  await testDuplicateUrls();

  await testMaximumBatchSize();

  console.log("");

  console.log(
    "All batch tests passed."
  );
}


runTests().catch((error) => {
  console.error(
    "Batch tests failed:"
  );

  console.error(error);

  process.exit(1);
});