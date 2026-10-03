# LinkedIn Content Strategy Generator

A full-stack application that analyzes a LinkedIn profile and generates a profile-aware content strategy with five structured LinkedIn post drafts.

## Live Demo

Frontend:

https://linkedin-content-generator-ll1a.onrender.com/

Backend:

https://linkedin-content-generator-api.onrender.com/

Health Check:

https://linkedin-content-generator-api.onrender.com/health

## Overview

The application accepts a public LinkedIn profile URL, retrieves profile information using Bright Data, normalizes the profile data, analyzes the profile, creates a content strategy, and generates five LinkedIn posts.

The generation pipeline is designed to keep the generated content aligned with the available profile information rather than relying only on generic prompts.

The application also supports batch processing of multiple LinkedIn profiles.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Markdown

### Backend

- Node.js
- Express.js
- Zod
- JavaScript ES Modules

### AI

- Groq
- OpenAI-compatible LLM API
- Prompt engineering
- Structured JSON generation
- Profile grounding validation

### Data

- Bright Data LinkedIn Dataset

### Deployment

- Render

## Architecture

```text
React Frontend
      |
      | POST /api/content/generate
      v
Express API
      |
      +------------------+
      |                  |
      v                  v
Bright Data          Batch Processing
      |
      v
LinkedIn Profile
      |
      v
Profile Normalizer
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
Zod Validation
      |
      v
Grounding Validation
      |
      +---- Validation Failed
      |           |
      |           v
      |         Retry
      |
      v
Structured JSON Response
      |
      v
React UI
```

## Generation Strategy

The application uses a multi-stage generation pipeline rather than generating posts directly from the LinkedIn profile.

### 1. Profile Retrieval

The user provides a LinkedIn profile URL.

Bright Data is used to retrieve the available LinkedIn profile information.

The external response is normalized into an internal profile structure before being passed to the rest of the application.

This keeps the application independent of the exact structure of the external data source.

### 2. Profile Analysis

The profile is analyzed to identify relevant professional signals such as:

- Seniority
- Industry
- Expertise
- Target audience
- Content themes
- Tone
- Writing style
- Positioning

The analysis provides the context used by the strategy-generation stage.

### 3. Content Strategy

The analyzed profile is converted into a content strategy containing:

- Positioning
- Target audience
- Content pillars
- Five content ideas
- Objectives
- Key points
- Suggested hooks

The strategy acts as an intermediate layer between profile analysis and post generation.

This prevents the post-generation stage from relying only on raw profile information.

### 4. Post Generation

The content strategy and profile context are passed to the post-generation stage.

Five structured LinkedIn posts are generated.

Each post follows the following structure:

```json
{
  "contentType": "...",
  "topic": "...",
  "hook": "...",
  "body": "...",
  "callToAction": "...",
  "hashtags": []
}
```

The frontend uses this structured response to render the generated content consistently.

## Profile Grounding Strategy

A key design goal is to reduce unsupported personal claims in generated content.

The application therefore performs validation after LLM generation.

The validation process checks generated content against available profile evidence and identifies potential unsupported claims.

When grounding validation fails, the generation process is retried with additional constraints describing the detected issues.

The grounding system is intentionally lightweight and heuristic-based. It is designed to catch common unsupported claims rather than provide formal factuality or entailment verification.

## Structured Output

The application does not depend on free-form LLM responses.

LLM responses are parsed as JSON and validated before being returned to the frontend.

For generated posts, Zod schemas validate:

- Number of posts
- Content type
- Topic
- Hook
- Body
- Call to action
- Hashtags

Content strategy responses are also validated before continuing through the pipeline.

This provides a predictable contract between the backend and frontend.

## Batch Processing

The API supports generating content for multiple LinkedIn profiles in a single request.

Endpoint:

```text
POST /api/content/generate-batch
```

The batch workflow includes:

- LinkedIn URL validation
- Duplicate URL removal
- Maximum batch size validation
- Individual profile processing
- Independent success and failure handling
- Structured results for every profile

A failure for one profile does not terminate processing for the remaining profiles.

Example request:

```json
{
  "linkedinUrls": [
    "https://www.linkedin.com/in/example-one/",
    "https://www.linkedin.com/in/example-two/"
  ]
}
```

Example response structure:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "results": []
  }
}
```

## API Endpoints

### Generate content

```text
POST /api/content/generate
```

Accepts a LinkedIn profile URL and returns profile analysis, content strategy, and five generated posts.

### Generate batch content

```text
POST /api/content/generate-batch
```

Accepts multiple LinkedIn profile URLs and processes them independently.

### Health check

```text
GET /health
```

Returns the current backend health status.

## Error Handling

The backend handles errors across the different stages of the pipeline, including:

- Invalid LinkedIn URLs
- Missing profile data
- Bright Data API failures
- Snapshot processing failures
- Snapshot timeouts
- Invalid LLM JSON
- Invalid response structures
- Grounding validation failures
- LLM provider failures
- Batch profile failures

Errors are returned using a consistent response structure:

```json
{
  "success": false,
  "error": "Error message"
}
```

For batch requests, individual profile failures are included in the batch results so that successful profiles can still be returned.

## Project Structure

```text
linkedin-content-generator/
|
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── prompts/
│       ├── schemas/
│       ├── utils/
│       └── server.js
|
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
|
├── data/
├── README.md
└── package.json
```

## Design Decisions

### Separate Services

Profile retrieval, profile analysis, content strategy, post generation, grounding validation, and LLM access are separated into individual services.

This keeps responsibilities isolated and makes individual components easier to test and replace.

### Profile Normalization

The Bright Data response is normalized before entering the application pipeline.

This prevents downstream components from depending directly on the external API response format.

### Intermediate Content Strategy

The application uses profile analysis followed by content strategy before generating posts.

This provides a structured planning layer between profile information and final content generation.

### Structured LLM Output

LLM responses are required to follow a defined JSON structure.

Zod validation is used to prevent malformed responses from reaching the frontend.

### Grounding Validation

Generated content is checked against available profile evidence.

When unsupported claims are detected, generation is retried with additional grounding constraints.

## Testing

The project includes tests for the main generation and validation components.

Test coverage includes:

- Profile analysis
- Content strategy generation
- Strategy grounding
- Post generation
- Post grounding
- API integration
- Bright Data integration
- Batch processing

Deterministic generator and validator tests can run without consuming LLM tokens.

Example:

```bash
cd backend

node test-strategy-validator.js
node test-strategy-generator.js
node test-post-validator.js
node test-post-generator.js
```

The end-to-end API test uses the configured LLM provider:

```bash
node test-api.js
```

## Deployment

The frontend and backend are deployed separately on Render.

### Backend

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Frontend

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Environment variables are configured through the deployment environment and are not committed to the repository.

## LLM Provider

The application uses Groq for LLM inference.

The provider and model are configured through environment variables, allowing the model to be changed without modifying the application code.

Example:

```env
LLM_PROVIDER=groq
GROQ_MODEL=your-model
```

Groq was selected for its fast inference and straightforward API integration.

## Tradeoffs

### Lightweight Grounding

The grounding validator is heuristic-based.

It is useful for catching common unsupported profile claims but is not intended to replace a formal factuality or entailment system.

### No Database

The application does not require persistent application data for the generation workflow, so a database is not required by the current architecture.

### Controlled Batch Processing

Batch generation uses controlled processing to avoid overwhelming external services and the configured LLM provider.

This favors predictable behavior and error isolation over maximum parallelism.

## Environment Variables

The application expects the following environment variables:

```env
LLM_PROVIDER=groq
GROQ_API_KEY=...
GROQ_MODEL=...
BRIGHT_DATA_API_KEY=...
BRIGHT_DATA_DATASET_ID=...
```

These values should be configured locally through `.env` and through the deployment platform's environment settings.

