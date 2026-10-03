# LinkedIn Content Strategy Generator

A full-stack application that generates personalized LinkedIn content from a public LinkedIn profile.

The application takes a LinkedIn profile URL, retrieves profile data through Bright Data, analyzes the person's professional background and recent content, creates a content strategy, and generates five LinkedIn post drafts.

# Live Demo

- Frontend: [LinkedIn Content Strategy Generator](https://linkedin-content-generator-ll1a.onrender.com/)

- Backend: [API](https://linkedin-content-generator-api.onrender.com/)

- Health Check: [API Health](https://linkedin-content-generator-api.onrender.com/health)

# What the Application Does

The application follows a simple pipeline:

```text

LinkedIn Profile URL

        |

        v

Bright Data

        |

        v

Profile Normalization

        |

        v

Profile Analysis

        |

        v

Content Strategy

        |

        v

Post Generation

        |

        v

Grounding Validation

        |

   +----+----+

   |         |

 Valid     Invalid

   |         |

   v         v

Return     Retry

```

The important part of the design is that generated content is validated against the available profile information before it is returned.

# Tech Stack

| Layer | Technology |

|---|---|

| Frontend | React, Vite, Tailwind CSS |

| Backend | Node.js, Express.js |

| Validation | Zod, custom grounding validation |

| LLM | Groq, `openai/gpt-oss-120b` |

| LinkedIn Data | Bright Data |

| API | REST |

# Project Structure

```text

linkedin-content-generator/

|

├── backend/

│   ├── src/

│   │   ├── controllers/

│   │   ├── routes/

│   │   ├── services/

│   │   ├── prompts/

│   │   ├── schemas/

│   │   └── utils/

│   ├── test-api.js

│   ├── test-batch.js

│   ├── test-post-generator.js

│   ├── test-post-validator.js

│   ├── test-strategy.js

│   └── test-strategy-validator.js

│

├── frontend/

│   └── src/

│       ├── components/

│       ├── services/

│       ├── App.jsx

│       └── main.jsx

│

├── data/

├── README.md

└── package.json

```

# How the Logic Works

# 1. LinkedIn Profile Retrieval

The user provides a public LinkedIn profile URL.

The backend sends the URL to the Bright Data LinkedIn dataset and retrieves the available profile information.

The profile can contain:

- Name

- Headline

- Experience

- Companies

- Job titles

- Job descriptions

- Education

- Recent LinkedIn posts

# 2. Profile Normalization

Raw LinkedIn data can have different structures. The normalization layer converts the external response into a consistent internal profile structure.

This allows the rest of the application to work with predictable fields instead of depending directly on the Bright Data response format.

# 3. Profile Evidence

The application builds a profile evidence object from the normalized profile.

The evidence contains information such as:

- Identity

- Experience

- Education

- Recent posts

This evidence is later used to check whether generated personal claims are supported by the profile.

# 4. Profile Analysis

The LLM analyzes the professional background using information from the profile.

The analysis can consider:

- Professional experience

- Job titles

- Companies

- Skills and technologies

- Areas of expertise

- Education

- Existing LinkedIn content

This analysis provides context for the content strategy.

# 5. Content Strategy

The application generates five content ideas based on the person's professional background.

The strategy is designed to avoid completely generic topics and instead use information available from the profile.

The strategy is also checked for grounding before it is used for post generation.

# 6. Post Generation

The application generates five LinkedIn posts from the profile analysis and content strategy.

Every post follows the same structured format:

```text

Content Type

Topic

Hook

Body

Call to Action

Hashtags

```

The LLM is instructed to return JSON. The backend then validates the response with Zod.

A generated response must contain exactly five posts.

# Grounding Validation

The grounding validator is used to reduce unsupported personal claims in generated content.

This is important because an LLM can produce realistic-sounding experiences that are not actually present in the source profile.

# Personal Experience Claims

The validator checks statements such as:

```text

I built...

I developed...

I implemented...

I deployed...

I managed...

I improved...

I migrated...

I optimized...

```

If the profile does not contain supporting evidence, the claim is rejected.

# Incident and Experience Claims

The validator also checks claims such as:

```text

I encountered...

I ran into...

I faced...

I discovered...

I found...

```

For example:

```text

I faced severe latency problems and redesigned the architecture.

```

If the profile does not support this experience, the generated post is rejected.

# Team and Production Claims

The validator checks claims involving phrases such as:

```text

our team

our system

our service

our customers

our users

my team

my system

my production

```

These phrases can imply personal or team experience that is not necessarily supported by the profile.

# Numeric Claims

The validator also checks unsupported metrics.

For example:

```text

Response time improved by 85%.

```

If the profile does not provide evidence for the metric, it is rejected.

Calendar years are handled separately. A year such as `2026` is not automatically treated as a personal metric or achievement.

# Retry Logic

If generated posts fail grounding validation, the application does not immediately return them.

The validation errors are included in the next generation prompt so that the LLM can correct the unsupported claims.

The process is:

```text

Generate

   |

   v

Validate JSON

   |

   v

Validate Grounding

   |

   +------ Valid ------> Return

   |

 Invalid

   |

   v

Retry Generation

```

If the generated content remains invalid after the configured number of attempts, the backend returns an error instead of returning unsupported content.

# Structured Output

Zod is used to validate the structure returned by the LLM.

The expected post structure is:

```json

{

  "posts": [

    {

      "contentType": "Educational",

      "topic": "...",

      "hook": "...",

      "body": "...",

      "callToAction": "...",

      "hashtags": ["#AI", "#Engineering"]

    }

  ]

}

```

The backend verifies that the required fields exist and that exactly five posts are returned.

# Batch Processing

The application also supports multiple LinkedIn profiles in a single request.

The batch flow:

1. Validates the submitted URLs.

2. Removes duplicate URLs.

3. Limits the request to 10 profiles.

4. Processes each profile independently.

5. Returns an individual success or error result for each profile.

Example response structure:

```json

{

  "results": [

    {

      "linkedinUrl": "...",

      "success": true,

      "data": {}

    },

    {

      "linkedinUrl": "...",

      "success": false,

      "error": "..."

    }

  ]

}

```

A failure for one profile does not hide the results for other profiles in the batch.

# API Endpoints

# Generate content for one profile

```http

POST /api/content/generate

```

Request:

```json

{

  "linkedinUrl": "https://www.linkedin.com/in/example/"

}

```

# Generate content for multiple profiles

```http

POST /api/content/generate-batch

```

Request:

```json

{

  "linkedinUrls": [

    "https://www.linkedin.com/in/example-one/",

    "https://www.linkedin.com/in/example-two/"

  ]

}

```

# Health Check

```http

GET /health

```

# Backend Services

# `brightDataService.js`

Handles communication with the Bright Data LinkedIn dataset.

# `profileService.js`

Coordinates profile retrieval and profile-level processing.

# `profileNormalizer.js`

Converts raw external profile data into the application's internal structure.

# `profileEvidence.js`

Builds the evidence used by the grounding validator.

# `profileAnalyzer.js`

Uses the LLM to analyze the professional profile.

# `contentStrategy.js`

Generates and validates the five content strategy ideas.

# `postGenerator.js`

Generates five structured LinkedIn posts and handles grounding retries.

# `groundingValidator.js`

Checks whether generated personal, team, production, incident, and metric claims are supported by the profile.

# `contentController.js`

Handles API requests and coordinates the generation pipeline.

# Frontend

The frontend provides two main modes.

# Single Profile

The user submits one LinkedIn profile URL and receives the generated strategy and posts.

# Batch Mode

The user submits multiple LinkedIn profile URLs and receives an individual result for each profile.

The frontend also handles loading states and API errors.

# Testing

The backend contains separate tests for the major parts of the application.

```text

test-strategy.js

test-strategy-validator.js

test-posts.js

test-post-validator.js

test-post-generator.js

test-api.js

test-batch.js

test-profile-service.js

test-bright-data.js

```

The tests cover:

- Profile processing

- Strategy generation

- Strategy grounding

- Post generation

- Post grounding

- Retry behavior

- API behavior

- Batch processing

- Bright Data integration

The post grounding tests specifically verify that unsupported personal stories, incidents, team claims, and unsupported metrics are rejected while valid profile-grounded content is accepted.

# Environment Variables

The backend uses environment variables for external services.

```env

GROQ_API_KEY=your_groq_api_key

LLM_PROVIDER=groq

GROQ_MODEL=openai/gpt-oss-120b

BRIGHT_DATA_API_KEY=your_bright_data_api_key

BRIGHT_DATA_DATASET_ID=your_dataset_id

```

API keys should never be committed to the repository.

# Design Decisions

# Grounding as a Separate Validation Layer

Prompt instructions alone cannot guarantee that an LLM will avoid unsupported personal experiences.

The application therefore uses two layers:

```text

LLM Instructions

       +

Deterministic Validation

```

The LLM is instructed to stay within the profile, while the backend independently checks the generated output.

# Structured JSON

Structured JSON makes the output predictable for both the backend and frontend.

Instead of parsing arbitrary generated text, the backend validates predefined fields with Zod.

# Retry Instead of Returning Invalid Content

When the validator detects unsupported content, the application sends the validation feedback back to the LLM and tries again.

This keeps the validation layer strict while still allowing the model to correct its response.

# Separate LLM Service

The rest of the application does not call the Groq SDK directly.

LLM requests go through `llmService.js` and the `generateWithLLM()` function.

This keeps provider-specific code isolated from the profile, strategy, and post-generation logic.

# Tradeoffs

The grounding approach prioritizes profile consistency over unrestricted generation.

As a result, some creative posts may be rejected when they contain personal claims that cannot be supported by the available profile data.

The pipeline also uses multiple LLM stages and validation retries. This increases token usage and can increase response time, but it keeps profile analysis, strategy generation, post generation, and validation separated.

Batch processing can take longer because each profile goes through the same generation and validation pipeline independently.

# LLM Provider

The current implementation uses Groq as the LLM provider.

The provider-specific code is isolated in:

```text

backend/src/services/llmService.js

```

Other services call:

```text

generateWithLLM()

```

instead of using the Groq SDK directly.

This makes the LLM integration easier to replace without changing the rest of the generation pipeline.

# Summary

The application is built around this pipeline:

```text

Retrieve Profile

      |

      v

Normalize Data

      |

      v

Analyze Profile

      |

      v

Create Content Strategy

      |

      v

Generate 5 Posts

      |

      v

Validate Structure

      |

      v

Validate Grounding

      |

      v

Retry if Required

      |

      v

Return Content

```

The main objective is to generate structured, profile-aware LinkedIn content while reducing unsupported personal claims through deterministic backend validation.