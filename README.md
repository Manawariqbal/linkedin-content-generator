**# LinkedIn Content Strategy Generator**

A full-stack application that generates personalized LinkedIn content from a public LinkedIn profile.

The application takes a LinkedIn profile URL, retrieves profile data through Bright Data, analyzes the person's professional background and recent content, builds a content strategy, and generates five structured LinkedIn post drafts.

**## Live Demo**

Frontend:

https\://linkedin-content-generator-ll1a.onrender.com/

Backend:

https\://linkedin-content-generator-api.onrender.com/

Health check:

https\://linkedin-content-generator-api.onrender.com/health

**## What the assignment asks for**

The assignment asks for:

\- A full-stack Node/Express API and React frontend

\- Profile-driven LinkedIn content generation

\- Use of actual profile signals such as seniority, industry, expertise, and recent post history

\- Structured, parseable output

\- Error handling for malformed or sparse profile data

\- Bright Data LinkedIn profile data

\- Efficient handling of multiple profiles

\- A polished public frontend

\- A public/shared GitHub repository

\- A README explaining the approach, quality bar, tradeoffs, and future improvements

This implementation covers the core single-profile flow and batch profile processing, and is deployed publicly.

**## Features**

\- LinkedIn profile URL input

\- Bright Data LinkedIn profile retrieval

\- Profile normalization into a predictable internal structure

\- Profile analysis using an LLM

\- Content strategy generation

\- Five structured LinkedIn post drafts

\- Grounding checks for generated content

\- JSON validation with Zod

\- Markdown rendering in the frontend

\- Loading and error states

\- Responsive dark-mode UI

\- Production deployment on Render

\- Environment-based configuration

\- Health check endpoint

\- Direct profile payload support for testing
- Batch profile processing with controlled concurrency

**## Architecture**

\`\`\`text

                         +----------------------+

                         \|      React App       |

                         \|      Vite + Tailwind |

                         +----------+-----------+

                                    |

                                    \| POST /api/content/generate

                                    v

                         +----------------------+

                         \|   Node / Express API |

                         +----------+-----------+

                                    |

                                    v

                         +----------------------+

                         \|  Content Controller  |

                         +----------+-----------+

                                    |

                     +--------------+--------------+

                     \|                             |

                     v                             v

             LinkedIn URL flow             Direct profile flow

                     \|                             |

                     v                             |

             +---------------+                     |

             \|  Bright Data  |                     |

             \| LinkedIn API  |                     |

             +-------+-------+                     |

                     \|                             |

                     v                             |

             +---------------+                     |

             \| Profile       |                     |

             \| Normalizer    |                     |

             +-------+-------+                     |

                     +-------------+---------------+

                                   |

                                   v

                         +----------------------+

                         \|   Profile Analyzer   |

                         +----------+-----------+

                                    |

                                    v

                         +----------------------+

                         \|  Content Strategy    |

                         +----------+-----------+

                                    |

                                    v

                         +----------------------+

                         \|    Post Generator    |

                         +----------+-----------+

                                    |

                                    v

                         +----------------------+

                         \| Grounding + Zod      |

                         \| validation           |

                         +----------+-----------+

                                    |

                                    v

                         +----------------------+

                         \| Structured JSON      |

                         +----------------------+

\`\`\`

**## Project Structure**

\`\`\`text

linkedin-content-generator/

├── backend/

│   ├── src/

│   │   ├── controllers/

│   │   │   └── contentController.js

│   │   ├── routes/

│   │   │   └── contentRoutes.js

│   │   ├── services/

│   │   │   ├── llmService.js

│   │   │   ├── profileAnalyzer.js

│   │   │   ├── contentStrategy.js

│   │   │   ├── postGenerator.js

│   │   │   ├── groundingValidator.js

│   │   │   ├── brightDataService.js

│   │   │   ├── profileNormalizer.js

│   │   │   ├── profileService.js

│   │   │   ├── profileEvidence.js

│   │   │   └── strategyGroundingValidator.js

│   │   ├── prompts/

│   │   │   └── linkedinPrompt.js

│   │   ├── schemas/

│   │   │   └── contentSchema.js

│   │   ├── utils/

│   │   │   └── validation.js

│   │   └── server.js

│   ├── package.json

│   └── .env.example

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── ProfileForm.jsx

│   │   │   ├── PostCard.jsx

│   │   │   └── LoadingState.jsx

│   │   ├── services/

│   │   │   └── api.js

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   ├── package.json

│   └── .env.example

├── data/

│   └── sample-profiles.json

├── README.md

├── .gitignore

└── package.json

\`\`\`

**## Content Generation Pipeline**

The generation process is intentionally split into stages instead of using one large prompt.

**### 1. Profile ingestion**

The frontend accepts a public LinkedIn profile URL.

The backend sends the URL to Bright Data's LinkedIn scraper and waits for the asynchronous snapshot to become available.

Relevant profile information is then normalized into a consistent internal format.

**### 2. Profile analysis**

The normalized profile is passed to the profile analysis service.

The analysis extracts signals such as:

\- Seniority

\- Industry

\- Expertise

\- Target audience

\- Content themes

\- Tone

\- Writing style

\- Positioning

These signals become inputs to the content strategy stage.

**### 3. Content strategy**

The strategy stage converts the profile analysis into:

\- Positioning

\- Target audience

\- Content pillars

\- Five content ideas

\- Objectives

\- Key points

\- Suggested hooks

This gives the post generator a structured content plan instead of asking the LLM to generate five unrelated posts.

**### 4. Post generation**

The post generator creates five posts.

Each post has:

\`\`\`json

{

  "contentType": "Educational / How-to",

  "topic": "...",

  "hook": "...",

  "body": "...",

  "callToAction": "...",

  "hashtags": []

}

\`\`\`

**### 5. Validation**

Generated responses are parsed as JSON.

Zod validates the expected structure and the grounding validators check generated content against available profile evidence.

When grounding validation fails, the post generator can retry with the validation errors supplied to the prompt.

**## Why the output is structured**

The assignment specifically calls for structured, parseable output rather than free-form text.

The backend therefore separates:

\`\`\`text

Profile

Profile Analysis

Content Strategy

Generated Posts

\`\`\`

and validates generated post fields before returning the response.

This makes the output easier for the frontend to consume and gives the application a clear contract between the LLM layer and the UI.

**## Grounding Approach**

A major goal was to avoid generic LinkedIn posts that could have been written for anyone.

The prompts establish the profile as the source of truth.

The generation instructions explicitly tell the model not to invent:

\- Companies

\- Job titles

\- Skills

\- Projects

\- Customers

\- Achievements

\- Metrics

\- Production incidents

\- Business outcomes

\- Technologies

The application also performs heuristic grounding validation after generation.

This is not a perfect factuality system. LLM-generated content can still require stronger evidence-level validation. That limitation is documented rather than hidden.

**## Handling Sparse Profiles**

The system does not assume that every profile contains complete information.

The normalizer provides safe defaults for missing fields, and prompts instruct the model to avoid inventing information when evidence is missing.

For example, if a profile has limited recent post history, the generator can fall back to documented professional information and produce more general educational content rather than fabricating personal stories.

**## Error Handling**

The backend handles several failure cases explicitly:

\- Missing LinkedIn URL

\- Invalid LinkedIn URL

\- Missing profile payload

\- Bright Data configuration errors

\- Bright Data API failures

\- Missing Bright Data snapshot ID

\- Snapshot timeout

\- Empty profile results

\- Invalid LLM JSON

\- Invalid content strategy structure

\- Incorrect number of content ideas

\- Post schema validation failures

\- Grounding validation failures

\- LLM provider failures

API errors are returned using a consistent response shape:

\`\`\`json

{

  "success": false,

  "error": "Error message"

}

\`\`\`

Successful generation uses:

\`\`\`json

{

  "success": true,

  "data": {

    "profile": {},

    "profileAnalysis": {},

    "contentStrategy": {},

    "posts": {}

  }

}

\`\`\`

**## API**

**### Health Check**

\`\`\`http

GET /health

\`\`\`

Example response:

\`\`\`json

{

  "success": true,

  "message": "LinkedIn Content Generator API is running"

}

\`\`\`

**### Generate Content**

\`\`\`http

POST /api/content/generate

Content-Type: application/json

\`\`\`

LinkedIn URL request:

\`\`\`json

{

  "linkedinUrl": "https\://www\.linkedin.com/in/username/"

}

\`\`\`

The endpoint also supports a normalized profile payload for development and testing:

\`\`\`json

{

  "profile": {

    "name": "Sarah Chen",

    "headline": "Senior Software Engineer | AI & Cloud",

    "about": "Software engineer focused on scalable systems.",

    "location": "San Francisco, California",

    "currentCompany": "TechNova",

    "currentTitle": "Senior Software Engineer",

    "experience": [],

    "education": [],

    "recentPosts": []

  }

}

\`\`\`

**### Generate Batch Content**

```http
POST /api/content/generate-batch
Content-Type: application/json
```

Request:

```json
{
  "linkedinUrls": [
    "https://www.linkedin.com/in/user-one/",
    "https://www.linkedin.com/in/user-two/"
  ]
}
```

The endpoint accepts up to 10 unique LinkedIn profile URLs. Invalid URLs are rejected before processing. Individual profile failures are returned in the batch result without discarding successful profiles.

**## Testing**

The project was tested at multiple levels during development.

**### Local API test**

\`\`\`bash

cd backend

node test-api.js

\`\`\`

This verifies the complete content generation pipeline using a sample profile.

**### LLM test**

\`\`\`http

GET /test-llm

\`\`\`

**### Profile analysis test**

\`\`\`http

POST /test-profile-analysis

\`\`\`

**### Content strategy test**

\`\`\`http

POST /test-content-strategy

\`\`\`

**### Post generation test**

\`\`\`http

POST /test-post-generation

\`\`\`

**### Production health test**

\`\`\`bash

curl https\://linkedin-content-generator-api.onrender.com/health

\`\`\`

**### Production LLM test**

\`\`\`text

https\://linkedin-content-generator-api.onrender.com/test-llm

\`\`\`

The deployed generation endpoint was also tested successfully using a normalized profile payload.

**### Batch test**

```bash
cd backend
node test-batch.js
```

The deterministic batch test covers:

- Successful batch processing
- Partial profile failure
- Invalid LinkedIn URLs
- Duplicate URL removal
- Maximum batch size validation

All batch tests pass without requiring Bright Data or a live LLM call.

**## How I Decided It Was Good Enough to Ship**

The quality bar for the first version was based on four practical checks.

**### 1. Profile relevance**

Generated topics should clearly connect to the person's:

\- Role

\- Seniority

\- Industry

\- Expertise

\- Recent content

**### 2. Output structure**

The system must consistently return the expected structured fields rather than requiring manual parsing.

**### 3. Robustness**

The API should handle:

\- Invalid input

\- Missing data

\- External API failures

\- LLM failures

\- Invalid model output

without crashing the server.

**### 4. End-to-end usability**

The deployed application should allow a reviewer to:

1\. Open the public URL

2\. Enter a LinkedIn profile URL

3\. Wait while the profile is processed

4\. View the profile summary

5\. View the content strategy

6\. Read five generated posts

The deployed frontend and backend were tested as a complete flow before shipping V1.

**## Batch Processing**

The assignment asks for efficient handling of multiple profiles.

Batch processing is implemented through:

```http
POST /api/content/generate-batch
```

The endpoint accepts up to 10 LinkedIn profile URLs, removes duplicates, validates the URLs, and processes each profile through the same analysis, strategy, post generation, and grounding pipeline used by the single-profile endpoint.

The batch flow is:

```text
Profile URLs
     |
     v
Validate + deduplicate
     |
     v
Batch processing
     |
     +---- Profile 1
     |
     +---- Profile 2
     |
     +---- ...
     |
     v
Controlled concurrency
     |
     v
Per-profile success/failure results
```

The current implementation uses controlled sequential processing to avoid overwhelming Bright Data and LLM rate limits. A failure for one profile does not fail the entire batch.

The response includes:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "successful": 1,
    "failed": 1,
    "results": []
  }
}
```

Each failed profile includes its own error message while successful profiles contain the normal generated content result.

The batch implementation was tested with successful profiles, partial failures, invalid URLs, duplicate URLs, and the maximum batch-size boundary.

**## Data Source**

Bright Data is used for public LinkedIn profile retrieval.

The application uses profile information including:

\- Name

\- Headline

\- About

\- Location

\- Current company/title

\- Experience

\- Education

\- Recent posts

The Bright Data integration uses an asynchronous snapshot workflow:

\`\`\`text

Trigger scraper

      |

      v

Snapshot ID

      |

      v

Poll snapshot

      |

      v

Normalize profile

\`\`\`

**## LLM Provider**

The original assignment suggests Gemini and allows another provider if preferred.

For the deployed V1, Groq is used as the LLM provider.

The provider is configured through environment variables:

\`\`\`env

LLM_PROVIDER=groq

GROQ_MODEL=llama-3.3-70b-versatile

GROQ_API_KEY=

\`\`\`

Gemini was initially integrated during development, but the production V1 was simplified to use the configured Groq provider directly. This avoids using a fallback provider with a different quota and makes production behavior easier to reason about.

**## Frontend**

The frontend uses:

\- React

\- Vite

\- Tailwind CSS

\- Axios

\- React Markdown

The UI includes:

\- LinkedIn URL form

\- Input validation

\- Loading state

\- Error state

\- Profile summary

\- Content strategy

\- Target audience tags

\- Content pillars

\- Generated post cards

\- Markdown rendering

\- Responsive dark theme

No login or authentication is required, matching the assignment scope.

**## Deployment**

**### Backend**

Hosted on Render as a Node web service.

\`\`\`text

Root Directory: backend

Build Command: npm install

Start Command: npm start

\`\`\`

Production backend:

https\://linkedin-content-generator-api.onrender.com/

**### Frontend**

Hosted on Render as a static site.

\`\`\`text

Root Directory: frontend

Build Command: npm install && npm run build

Publish Directory: dist

\`\`\`

Production frontend:

https\://linkedin-content-generator-ll1a.onrender.com/

The frontend receives the backend URL through:

\`\`\`env

VITE_API_BASE_URL=https\://linkedin-content-generator-api.onrender.com/api

\`\`\`

**## Environment Variables**

Backend \`.env\`:

\`\`\`env

PORT=5000

LLM_PROVIDER=groq

GROQ_API_KEY=

GROQ_MODEL=llama-3.3-70b-versatile

GEMINI_API_KEY=

BRIGHT_DATA_API_KEY=

BRIGHT_DATA_DATASET_ID=

\`\`\`

Frontend \`.env\`:

\`\`\`env

VITE_API_BASE_URL=http\://localhost:5000/api

\`\`\`

For production, \`VITE_API_BASE_URL\` points to the deployed backend.

Actual secrets are not committed to GitHub.

**## Local Development**

**### Backend**

\`\`\`bash

cd backend

npm install

npm run dev

\`\`\`

The API runs on:

\`\`\`text

http\://localhost:5000

\`\`\`

**### Frontend**

\`\`\`bash

cd frontend

npm install

npm run dev

\`\`\`

The Vite development server will provide the frontend URL.

**## Security and Configuration**

Sensitive configuration is kept outside source control.

The repository ignores:

\`\`\`text

.env

.env.\*

node_modules/

dist/

build/

\`\`\`

An \`.env.example\` file can be used to document required configuration without storing secrets.

**## Design Decisions**

**### Separate services**

Profile analysis, content strategy, post generation, Bright Data integration, and LLM access are separate services.

This keeps responsibilities small and makes the system easier to test and modify.

**### Normalized profile model**

Bright Data response data is not passed directly through the entire application.

It is normalized first so downstream services work with a predictable structure.

**### Structured generation**

The model is instructed to return JSON, and the application validates the returned structure instead of trusting free-form model output.

**### Validation after generation**

The application performs validation after generation instead of relying entirely on prompt instructions.

This provides an additional layer for detecting unsupported profile claims.

**### Lightweight frontend**

The assignment explicitly says to keep the frontend scope light. The UI therefore focuses on the generation workflow instead of introducing authentication, dashboards, or unnecessary application features.

**## MERN Note**

The assignment describes the application as MERN.

This implementation uses React on the frontend and Node.js/Express on the backend, but does not use MongoDB because V1 does not require persistent application data. Profile data is retrieved and processed per request.

This was a deliberate time-constrained tradeoff. MongoDB or another persistence layer can be introduced if the product later needs saved profiles, generation history, user accounts, or analytics.

**## Tradeoffs**

**### Controlled batch concurrency**

Batch processing is implemented, but the current backend processes profiles sequentially. This reduces the chance of hitting external Bright Data or LLM rate limits and keeps behavior predictable. Higher concurrency can be introduced later if throughput becomes more important.

**### Groq vs Gemini**

The assignment permits another LLM provider. Groq was used for the deployed V1 after testing both providers. The production implementation uses one configured provider to keep runtime behavior predictable.

**### Heuristic grounding**

The grounding validator is intentionally lightweight. It improves protection against obvious unsupported claims but is not equivalent to a formal factuality or entailment evaluation system.

**### No persistence**

Generated results are returned to the client and are not stored. This keeps the application simple and avoids adding a database that the assignment does not require for the core generation flow.

**## What I Would Improve With More Time**

1\. Add a batch generation endpoint with controlled concurrency.

2\. Add a small profile test dataset covering different industries and seniority levels.

3\. Add automated evaluation for profile relevance and unsupported claims.

4\. Improve grounding validation with evidence-level checks rather than heuristic matching.

5\. Add retries and provider-specific handling for rate limits.

6\. Add request-level timeouts and cancellation for long-running Bright Data jobs.

7\. Add automated API and service tests with a test runner.

8\. Add request validation with a formal API schema at the HTTP boundary.

9\. Add result persistence and generation history if the product needs it.

10\. Add rate limiting for the public API.

11\. Add better observability around Bright Data and LLM latency.

12\. Add batch progress reporting in the frontend.

**## Known Limitations**

\- LinkedIn profile availability depends on Bright Data successfully retrieving the public profile.

\- External scraping and LLM services can introduce latency.

\- LLM output is probabilistic and requires validation.

\- The public V1 does not persist generated content.

\- Batch processing is available through the backend API and is not part of the main single-profile UI workflow.
- Batch processing currently uses controlled sequential execution.

\- LLM and scraper rate limits can affect availability.

**## Assignment Requirement Checklist**

\| Requirement | V1 Status |

\|---|---|

\| Full-stack Node/Express API | Done |

\| React frontend | Done |

\| Public deployed frontend | Done |

\| No authentication required | Done |

\| LinkedIn profile input | Done |

\| Bright Data LinkedIn scraper | Done |

\| Profile analysis | Done |

\| Profile-driven content strategy | Done |

\| Structured/parseable output | Done |

\| 3-5 generated posts | Done — 5 posts |

\| Sparse/malformed profile handling | Done |

\| Error handling | Done |

\| Polished frontend | Done |

\| GitHub repository | Done |

\| README with approach | Done |

\| Quality bar / ship decision | Done |

\| Tradeoffs | Done |

\| Future improvements | Done |

\| Batch profile processing | Done |

\| Production deployment | Done |

**## Repository**

GitHub:

https\://github.com/Manawariqbal/linkedin-content-generator

**## Author**

Md Manawar Iqbal

GitHub:

https\://github.com/Manawariqbal