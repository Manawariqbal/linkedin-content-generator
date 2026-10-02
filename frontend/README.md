# LinkedIn Content Strategy Generator

A full-stack application that takes a LinkedIn profile and generates a profile-aware content strategy with five LinkedIn post drafts.

## Live Demo

Frontend:
https://linkedin-content-generator-ll1a.onrender.com/

Backend:
https://linkedin-content-generator-api.onrender.com/

Health:
https://linkedin-content-generator-api.onrender.com/health

## What I Built

The application takes a public LinkedIn profile URL, retrieves the profile using Bright Data, normalizes the data, analyzes the profile, creates a content strategy, and generates five structured posts.

I also added validation after LLM generation to reduce unsupported claims and ensure the response follows the expected structure.

## Tech Stack

- React + Vite
- Node.js + Express
- Groq LLM
- Bright Data LinkedIn Dataset
- Zod
- Tailwind CSS
- Render

## Architecture

```text
React Frontend
      |
      | POST /api/content/generate
      v
Express API
      |
      +---- Bright Data
      |       |
      |       v
      |   LinkedIn Profile
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
Zod + Grounding Validation
      |
      v
Structured JSON Response
```

## Generation Flow

### 1. Profile Retrieval

The user provides a LinkedIn profile URL.

I use Bright Data to retrieve the profile and normalize the response into a predictable internal format.

### 2. Profile Analysis

The LLM analyzes:

- Seniority
- Industry
- Expertise
- Target audience
- Content themes
- Tone
- Writing style
- Positioning

### 3. Content Strategy

The strategy contains:

- Positioning
- Target audience
- Content pillars
- Five content ideas
- Key points
- Suggested hooks

### 4. Post Generation

The system generates five posts with a consistent structure:

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

### 5. Validation

I don't rely only on the LLM prompt.

The backend:

- Parses the LLM response as JSON
- Validates the structure with Zod
- Checks generated content against available profile evidence
- Retries generation when grounding validation fails

## Why I Designed It This Way

### Separate Services

I separated profile analysis, strategy generation, post generation, Bright Data integration, and LLM access.

This makes individual components easier to test and replace.

### Profile Normalization

Bright Data data is normalized before being passed to the rest of the application.

This keeps downstream services independent of the external API response format.

### Structured Output

I use JSON instead of free-form LLM responses so the frontend receives predictable data.

### Grounding Validation

I added a lightweight validation layer to catch obvious unsupported personal claims.

It is heuristic-based rather than a complete factuality system.

## Error Handling

The API handles:

- Invalid LinkedIn URLs
- Missing profile data
- Bright Data failures
- Snapshot timeouts
- Invalid LLM JSON
- Invalid response structures
- Grounding validation failures
- LLM provider failures

Errors use a consistent response format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing

I added tests for:

- Profile analysis
- Content strategy generation
- Strategy grounding
- Post generation
- Post grounding
- API integration
- Bright Data integration

The deterministic generator and validator tests can run without consuming LLM tokens.

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

The backend and frontend are deployed separately on Render.

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

Environment variables are kept outside the repository.

## Current Scope

V1 focuses on the single-profile generation workflow.

Batch processing, persistence, authentication, and generation history are not included in V1.

These can be added later if the application needs them.

## Tradeoffs

### Groq

I used Groq for the deployed version because it provides fast inference and was straightforward to integrate.

The LLM provider and model are configured through environment variables.

### No Database

I did not add MongoDB because the current workflow does not require persistent application data.

### Lightweight Grounding

The grounding validator is intentionally lightweight. It catches common unsupported claims but does not provide formal factuality or entailment verification.

## Future Improvements

- Reduce the number of LLM calls
- Add caching
- Improve batch processing
- Add more precise grounding validation
- Add request/token/latency monitoring
- Add persistence for generated content
- Add authentication if required
