export function buildProfileAnalysisPrompt(profile) {
  return `
You are a professional LinkedIn profile analyst.

Analyze the LinkedIn profile below and extract useful signals
for personalized LinkedIn content generation.

PROFILE:
${JSON.stringify(profile, null, 2)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "seniority": "string",
  "industry": "string",
  "expertise": ["string"],
  "targetAudience": ["string"],
  "contentThemes": ["string"],
  "tone": ["string"],
  "writingStyle": {
    "sentenceLength": "string",
    "usesStories": true,
    "usesLists": true,
    "usesQuestions": true,
    "usesPersonalExperience": true
  },
  "positioning": "string"
}

Rules:

1. Base the analysis only on information present in PROFILE.
2. Infer seniority from job titles and experience when possible.
3. Identify professional expertise supported by the profile.
4. Identify audiences reasonably connected to the person's professional background.
5. Identify themes from the person's recent posts.
6. Analyze writing style from the available posts.
7. Do not invent companies, skills, experiences, achievements, metrics,
   projects, customers, or responsibilities.
8. Do not assume information that is not present.
9. Return JSON only.
`;
}


export function buildContentStrategyPrompt(
  profile,
  profileAnalysis
) {
  return `
You are a LinkedIn content strategist.

Create a personalized LinkedIn content strategy based on the
profile and profile analysis below.

PROFILE:
${JSON.stringify(profile, null, 2)}

PROFILE ANALYSIS:
${JSON.stringify(profileAnalysis, null, 2)}

IMPORTANT:

The PROFILE is the source of truth.

The PROFILE ANALYSIS is only an interpretation of information
already present in the PROFILE.

Do not introduce new personal facts.

Generate exactly 5 content ideas using these types:

1. Educational / How-to
2. Personal Experience / Story
3. Industry Insight
4. Practical Framework / Lessons
5. Conversation Starter

Return ONLY valid JSON.

Use exactly this structure:

{
  "positioning": "string",
  "targetAudience": ["string"],
  "contentPillars": ["string"],
  "contentIdeas": [
    {
      "type": "string",
      "topic": "string",
      "objective": "string",
      "targetAudience": ["string"],
      "keyPoints": ["string"],
      "suggestedHook": "string"
    }
  ]
}

GROUNDING RULES:

- Do not invent personal experiences.
- Do not invent projects.
- Do not invent achievements.
- Do not invent companies or roles.
- Do not invent metrics or statistics.
- Do not invent incidents or business outcomes.
- Do not invent technologies unless supported by PROFILE.
- Do not claim the person personally implemented something unless PROFILE
  provides evidence.
- Personal-story ideas must be based only on documented profile facts.
- If there is insufficient evidence for a personal story, make the idea
  reflective/general rather than inventing an event.
- Industry insights may discuss broader concepts, but must not present
  unsupported claims as facts about the person.
- Do not create fictional case studies involving the person.
- Keep the strategy closely connected to the person's actual profile
  and recent content.

Return JSON only.
`;
}


export function buildPostGenerationPrompt(
  profile,
  profileAnalysis,
  contentStrategy,
  groundingErrors = []
) {
  const retryInstruction =
    groundingErrors.length > 0
      ? `
PREVIOUS GENERATION FAILED GROUNDING.

The validator detected these problems:

${groundingErrors
  .map(
    (error) =>
      `- Post ${error.postIndex}: ${error.issues.join(", ")}`
  )
  .join("\n")}

Generate a completely corrected set of posts.

Do not repeat the unsupported claims.
`
      : "";

  return `
You are an expert LinkedIn content writer.

Generate personalized LinkedIn posts using the information below.

PROFILE:
${JSON.stringify(profile, null, 2)}

PROFILE ANALYSIS:
${JSON.stringify(profileAnalysis, null, 2)}

CONTENT STRATEGY:
${JSON.stringify(contentStrategy, null, 2)}

IMPORTANT SOURCE PRIORITY:

1. PROFILE = source of truth
2. PROFILE ANALYSIS = derived interpretation
3. CONTENT STRATEGY = content planning only

The analysis and strategy MUST NOT be treated as evidence for
personal experiences, achievements, projects, metrics, or events.

${retryInstruction}

Generate exactly 5 LinkedIn posts.

The posts must correspond to these content types:

1. Educational / How-to
2. Personal Experience / Story
3. Industry Insight
4. Practical Framework / Lessons
5. Conversation Starter

Return ONLY valid JSON.

Use exactly this structure:

{
  "posts": [
    {
      "contentType": "string",
      "topic": "string",
      "hook": "string",
      "body": "string",
      "callToAction": "string",
      "hashtags": ["string"]
    }
  ]
}

GROUNDING RULES:

- Do not invent experiences.
- Do not invent projects.
- Do not invent achievements.
- Do not invent customers.
- Do not invent incidents.
- Do not invent metrics.
- Do not invent statistics.
- Do not invent production events.
- Do not invent business outcomes.
- Do not invent responsibilities.
- Do not invent technologies.
- Do not invent companies.
- Do not create fictional case studies presented as real.
- Do not make unsupported first-person claims.
- Use first person only when the PROFILE explicitly supports the claim.
- If evidence for a personal story is insufficient, write a general
  professional observation instead.
- Industry insights must not be presented as personal experience unless
  supported by PROFILE.
- Keep every factual personal claim grounded in PROFILE.
- Use a professional LinkedIn tone.
- Use short paragraphs.
- Use lists where appropriate.
- Create a strong but non-clickbait hook.
- Include a useful takeaway.
- Include a natural call to action.
- Include 3-5 relevant hashtags.

Return JSON only.
`;
}