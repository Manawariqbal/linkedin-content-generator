import { buildProfileEvidence } from "./profileEvidence.js";

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getEvidenceText(evidence) {
  return normalizeText(
    JSON.stringify(evidence)
  );
}

function getEvidenceTerms(evidence) {
  return getEvidenceText(evidence)
    .split(/[^a-z0-9+#.-]+/)
    .filter(
      (word) =>
        word.length >= 4 &&
        ![
          "that",
          "this",
          "with",
          "from",
          "have",
          "been",
          "will",
          "your",
          "their",
          "they",
          "about",
          "into",
          "while",
          "also",
          "were",
          "what",
          "when"
        ].includes(word)
    );
}

function hasEvidence(text, evidence) {
  const normalizedText =
    normalizeText(text);

  const evidenceText =
    getEvidenceText(evidence);

  /*
   * Strong evidence:
   * exact phrase appears in profile.
   */
  const anchors = [
    ...evidence.identity
      ? Object.values(evidence.identity)
      : [],

    ...evidence.experience
      ? [
          ...evidence.experience.companies,
          ...evidence.experience.jobTitles,
          ...evidence.experience.descriptions
        ]
      : [],

    ...evidence.education
      ? [
          ...evidence.education.institutions,
          ...evidence.education.degrees,
          ...evidence.education.fieldsOfStudy
        ]
      : [],

    ...evidence.content
      ? [
          ...evidence.content.postTitles,
          ...evidence.content.postTexts
        ]
      : []
  ]
    .map(normalizeText)
    .filter(
      (value) => value.length >= 8
    );

  for (const anchor of anchors) {
    if (
      normalizedText.includes(anchor)
    ) {
      return true;
    }
  }

  /*
   * Check meaningful token overlap.
   */
  const textWords =
    new Set(
      normalizedText
        .split(/\W+/)
        .filter(
          (word) =>
            word.length >= 4
        )
    );

  const evidenceTerms =
    getEvidenceTerms(evidence);

  let overlap = 0;

  for (const word of textWords) {
    if (
      evidenceTerms.includes(word)
    ) {
      overlap++;
    }
  }

  return overlap >= 2;
}

function validateContentIdea(
  idea,
  evidence,
  index
) {
  const issues = [];

  const text = [
    idea.topic,
    idea.objective,
    idea.suggestedHook,
    ...(idea.keyPoints || [])
  ].join(" ");

  /*
   * Personal-story content needs
   * stronger grounding.
   */
  const isPersonalStory =
    normalizeText(
      idea.type
    ).includes("personal");

  if (
    isPersonalStory &&
    !hasEvidence(text, evidence)
  ) {
    issues.push(
      "Personal story is not sufficiently supported by profile evidence"
    );
  }

  /*
   * Detect strongly specific invented claims.
   */
  const unsupportedPatterns = [
    /\bmillions of users\b/i,
    /\bthousands of users\b/i,
    /\bsingle gpu\b/i,
    /\bproduction incident\b/i,
    /\bproduction outage\b/i,
    /\bdata pipeline failure\b/i,
    /\bteam of\b/i,
    /\bai researchers?\b/i,
    /\bvector[- ]store latency\b/i,
    /\bcache layer\b/i,
    /\bmessage queue\b/i,
    /\bcontainer orchestration\b/i
  ];

  for (
    const pattern of unsupportedPatterns
  ) {
    const match =
      text.match(pattern);

    if (match) {
      const phrase =
        match[0];

      if (
        !getEvidenceText(
          evidence
        ).includes(
          normalizeText(phrase)
        )
      ) {
        issues.push(
          `Potentially unsupported specific claim: "${phrase}"`
        );
      }
    }
  }

  return {
    ideaIndex: index + 1,
    valid: issues.length === 0,
    issues
  };
}

export function validateStrategyGrounding(
  contentStrategy,
  profile
) {
  const evidence =
    buildProfileEvidence(profile);

  const ideas =
    Array.isArray(
      contentStrategy?.contentIdeas
    )
      ? contentStrategy.contentIdeas
      : [];

  const results =
    ideas.map(
      (idea, index) =>
        validateContentIdea(
          idea,
          evidence,
          index
        )
    );

  return {
    valid: results.every(
      (result) => result.valid
    ),
    results
  };
}