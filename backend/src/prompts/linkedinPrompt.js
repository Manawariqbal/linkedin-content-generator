export function buildProfileAnalysisPrompt(profile) {
  return `
You are analyzing a LinkedIn profile to support personalized content generation.

Your job is to extract signals that are directly supported by the profile.
Do not create facts that are not present.

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

Analysis rules:

1. Base the analysis only on PROFILE.

2. Determine seniority from documented job titles and experience.

3. Determine industry only when the profile provides enough evidence.
   If the industry cannot be determined reliably, use:
   "Not clearly specified".

4. Identify expertise from:
   - job titles
   - experience descriptions
   - education
   - documented technologies
   - recent posts

5. Do not turn a technology mentioned in a post into a claim that the
   person professionally specializes in that technology unless the profile
   provides supporting evidence.

6. Identify target audiences that are reasonably connected to the person's
   documented professional background.

7. Identify content themes from the person's recent posts and professional
   background.

8. Analyze writing style only from available post content.
   If there are not enough posts to determine a writing characteristic,
   use a conservative interpretation.

9. Do not invent:
   - companies
   - roles
   - skills
   - technologies
   - projects
   - achievements
   - responsibilities
   - customers
   - metrics
   - events
   - business outcomes

10. Do not convert assumptions into facts.

11. Keep expertise, audience, themes and positioning concise and specific.
    Avoid generic statements such as:
    "technology", "business", "professionals", or "industry".

12. The positioning should describe the professional identity supported
    by the profile, not an aspirational identity.

Return JSON only.
`;
}


export function buildContentStrategyPrompt(
  profile,
  profileAnalysis
) {
  return `
You are a LinkedIn content strategist.

Create a personalized content strategy using ONLY facts that are explicitly
supported by the PROFILE.

PROFILE:
${JSON.stringify(profile, null, 2)}

PROFILE ANALYSIS:
${JSON.stringify(profileAnalysis, null, 2)}

SOURCE OF TRUTH:

The PROFILE is the ONLY source of evidence for personal facts.

PROFILE ANALYSIS is only a derived interpretation.
It must NOT be used to create new personal experiences, events, achievements,
projects, incidents, metrics, outcomes, responsibilities, or implementation
details.

The content strategy is a planning document.
A proposed topic or key point does NOT become evidence that the profile owner
actually experienced it.

Generate exactly 5 content ideas with these content types:

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

CRITICAL GROUNDING RULES:

1. PROFILE is the only source of personal evidence.

2. Never infer a personal event from a technology, job title, company,
   industry, or general responsibility.

3. Never convert a professional capability into a personal experience.

For example:

If PROFILE says:
"Builds AI-powered cloud applications"

You MUST NOT infer:
- "I moved an AI prototype to production"
- "I faced latency problems"
- "I solved scaling issues"
- "I encountered data quality problems"
- "I implemented circuit breakers"
- "I improved system reliability"

unless those exact experiences are explicitly documented in PROFILE.

4. Never invent:
- projects
- incidents
- failures
- challenges
- achievements
- metrics
- results
- customer experiences
- team experiences
- production events
- implementation details
- architectural decisions
- lessons learned
- technologies
- responsibilities
- business outcomes

5. Do not infer that a person implemented something merely because the
   technology appears in their profile.

6. Do not infer a specific event from a recent LinkedIn post unless the post
   itself explicitly documents that the person experienced that event.

7. Do not infer a result from a responsibility.

8. Do not infer a lesson from a technology.

9. Do not infer a personal story from a job title.

10. Do not infer a production incident from words such as:
    "production", "cloud", "distributed systems", "AI", "scaling",
    "deployment", "reliability", "performance", or "monitoring".

PERSONAL EXPERIENCE / STORY RULE:

This is the most important rule.

The Personal Experience / Story idea MUST be based on a specific experience
that is explicitly documented in PROFILE.

A specific experience requires evidence such as:
- an explicitly described project
- an explicitly described challenge
- an explicitly described incident
- an explicitly described achievement
- an explicitly described transition
- an explicitly described lesson
- an explicitly described implementation
- an explicitly described outcome

If PROFILE does not contain a specific documented experience, DO NOT create
a personal story.

Instead, make the Personal Experience / Story idea a REFLECTIVE PROFESSIONAL
OBSERVATION.

A reflective professional observation must NOT describe an event that happened
to the person.

Use wording such as:
- "A perspective on..."
- "A professional reflection on..."
- "What engineers should consider when..."
- "A lesson worth considering when..."
- "Questions to ask before..."
- "A practical perspective on..."

Do NOT use wording that implies an undocumented event, such as:
- "When I..."
- "When we..."
- "I learned..."
- "I discovered..."
- "I faced..."
- "I encountered..."
- "I realized..."
- "I struggled..."
- "I solved..."
- "I built..."
- "I implemented..."
- "I experienced..."
- "Our team..."
- "At my company..."
- "In production..."
- "After we..."

unless PROFILE explicitly supports the statement.

PERSONAL STORY TEST:

Before creating the Personal Experience / Story idea, ask internally:

"Can I point to a specific piece of PROFILE evidence that proves this exact
experience happened?"

If the answer is NO:

Do NOT create a personal story.

Create a reflective professional observation instead.

If the answer is YES:

Use only the documented experience.
Do not add causes, problems, solutions, metrics, outcomes, technologies,
or details that are not explicitly documented.

CONTENT TYPE RULES:

Educational / How-to:
- Teach a concept connected to documented expertise.
- Do not imply personal implementation unless PROFILE supports it.
- The content should remain educational.

Personal Experience / Story:
- Use a documented personal experience only when explicit evidence exists.
- Otherwise use a reflective professional observation.
- Never create a fictional event.

Industry Insight:
- Discuss a broader professional or industry topic.
- It may use general knowledge.
- Do not present general knowledge as something personally experienced.

Practical Framework / Lessons:
- Provide a framework, checklist, process, or lessons.
- The framework does not need to have been personally invented.
- Do not present it as the profile owner's experience unless documented.

Conversation Starter:
- Ask a meaningful question related to the person's professional domain.
- Do not invent a personal story to make the question more engaging.

PROFILE ANALYSIS RESTRICTION:

Do not use PROFILE ANALYSIS to introduce facts that are absent from PROFILE.

For example, if PROFILE ANALYSIS says:
"Expertise: distributed systems"

that does NOT prove:
- a specific distributed-system project
- a production incident
- a scaling problem
- a reliability improvement
- a particular architecture
- a specific implementation

Those details may only be used if PROFILE explicitly documents them.

CONTENT QUALITY RULES:

- Every idea must have a clear connection to the profile.
- The five ideas must be meaningfully different.
- Avoid generic motivational content.
- Avoid generic ideas that could apply to any professional.
- Keep topics specific to the documented professional domain.
- Keep the strategy practical enough to convert into LinkedIn posts.
- Use concise and natural language.
- Do not exaggerate the person's expertise.
- Do not create aspirational positioning.
- Positioning must describe the professional identity actually supported by
  PROFILE.

POSITIONING RULE:

The positioning must describe what the person is demonstrably associated with
based on PROFILE.

Do not create aspirational positioning such as:
- "AI thought leader"
- "industry expert"
- "scaling expert"
- "cloud architecture expert"

unless PROFILE explicitly provides sufficient evidence for such a description.

KEY POINT RULE:

Every key point for a Personal Experience / Story idea must be directly
supported by PROFILE.

Do not create a sequence such as:

problem -> attempted solution -> failure -> redesign -> result

unless PROFILE explicitly documents those events.

If PROFILE only supports a topic, keep the idea at the topic level.

HOOK RULE:

The suggestedHook must not contain an unsupported personal event.

Avoid hooks such as:

"When I moved..."
"When I built..."
"When I deployed..."
"When I faced..."
"When I discovered..."
"When our team..."
"One production incident taught me..."

unless explicitly supported by PROFILE.

If evidence is insufficient, use a non-personal hook.

FINAL VALIDATION:

Before returning the JSON, verify every content idea.

For each Personal Experience / Story idea ask:

1. What exact PROFILE evidence supports this?
2. Does the evidence describe an actual event or experience?
3. Does every key point stay within that evidence?
4. Did I add any problem, solution, result, metric, technology, or event that
   is not explicitly documented?

If any answer fails, convert the idea into a reflective professional
observation.

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

The analysis and strategy MUST NOT be treated as evidence for personal
experiences, achievements, projects, metrics, or events.

A topic, hook, key point, or suggested idea in CONTENT STRATEGY does not
prove that the person experienced or achieved it.

Before making a factual personal claim, verify that the claim is supported
by PROFILE.

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

CONTENT QUALITY RULES:

- Each post must be meaningfully different from the other four.
- Follow the intended content type for each post.
- Avoid repeating the same topic, hook, structure, or takeaway.
- Avoid generic motivational content.
- Avoid generic statements that could apply to almost any professional.
- Make the content useful to the specified target audience.
- Use a professional and natural LinkedIn tone.
- Write as a knowledgeable professional rather than as an AI assistant.
- Avoid phrases such as:
  "In today's fast-paced world"
  "As we all know"
  "In the ever-evolving world of"
  "I'm excited to share"
  "Here are some valuable insights"
- Avoid excessive use of emojis.
- Avoid clickbait.
- Avoid exaggerated claims.
- Avoid unnecessary corporate jargon.
- Avoid repeating the person's job title unnecessarily.

POST FORMAT RULES:

Educational / How-to:
- Teach a practical concept, process, or lesson.
- Provide actionable information.
- Do not claim the person personally implemented the approach unless
  PROFILE supports that claim.

Personal Experience / Story:
- Use a documented experience from PROFILE when sufficient evidence exists.
- If there is not enough evidence for a specific story, write a reflective
  professional observation instead.
- Never invent an event, challenge, failure, success, or outcome.

Industry Insight:
- Discuss a relevant industry or professional topic.
- Clearly separate general industry knowledge from personal experience.
- Do not invent statistics or industry data.

Practical Framework / Lessons:
- Present a useful framework, checklist, process, or set of lessons.
- The framework does not need to be presented as something personally
  invented by the profile owner.

Conversation Starter:
- Focus on a relevant professional question or discussion.
- Encourage meaningful discussion rather than engagement bait.
- The question should be connected to the person's professional domain.

HOOK RULES:

- The hook should create genuine curiosity.
- Keep it concise.
- Avoid clickbait.
- Avoid exaggerated claims.
- Do not use unsupported personal achievements as hooks.

BODY RULES:

- Use short paragraphs.
- Make the post easy to scan.
- Use lists when they improve readability.
- Include a clear takeaway.
- Avoid unnecessary repetition.
- Keep the writing natural and conversational.

CALL TO ACTION:

- Use a natural CTA relevant to the post.
- Prefer thoughtful questions or practical discussion prompts.
- Avoid generic engagement bait such as:
  "Agree?"
  "Thoughts?"
  "Like and share."
- Do not ask the reader to perform an action unrelated to the post.

HASHTAGS:

- Include 3 to 5 relevant hashtags.
- Hashtags must be related to the actual topic.
- Do not use unrelated popular hashtags just to increase reach.

Return JSON only.
`;
}