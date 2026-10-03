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

function getExplicitProfileEvidence(evidence) {
  const anchors = [
    ...(evidence?.identity
      ? Object.values(evidence.identity)
      : []),

    ...(evidence?.experience
      ? [
          ...(evidence.experience.companies || []),
          ...(evidence.experience.jobTitles || []),
          ...(evidence.experience.descriptions || [])
        ]
      : []),

    ...(evidence?.education
      ? [
          ...(evidence.education.institutions || []),
          ...(evidence.education.degrees || []),
          ...(evidence.education.fieldsOfStudy || [])
        ]
      : [])
  ];

  return anchors
    .map(normalizeText)
    .filter(
      (value) => value.length >= 12
    );
}

function containsSpecificProfileEvidence(
  text,
  evidence
) {
  const normalizedText =
    normalizeText(text);

  const anchors =
    getExplicitProfileEvidence(
      evidence
    );

  /*
   * Generic technical concepts are not
   * considered personal evidence.
   */
  const genericTerms = new Set([
    "ai",
    "cloud",
    "software",
    "engineering",
    "engineer",
    "production",
    "systems",
    "system",
    "technology",
    "development",
    "application",
    "applications",
    "distributed",
    "scalable",
    "scalability",
    "data",
    "machine learning",
    "backend",
    "frontend"
  ]);

  const meaningfulAnchors =
    anchors.filter(
      (anchor) =>
        !genericTerms.has(anchor)
    );

  return meaningfulAnchors.some(
    (anchor) =>
      normalizedText.includes(anchor)
  );
}

function containsRecentPostEvidence(
  text,
  evidence
) {
  const normalizedText =
    normalizeText(text);

  const postTexts =
    evidence?.content?.postTexts || [];

  return postTexts.some((postText) => {
    const normalizedPost =
      normalizeText(postText);

    if (!normalizedPost) {
      return false;
    }

    const postWords =
      new Set(
        normalizedPost
          .split(/\W+/)
          .filter(
            (word) =>
              word.length >= 5
          )
      );

    const textWords =
      new Set(
        normalizedText
          .split(/\W+/)
          .filter(
            (word) =>
              word.length >= 5
          )
      );

    let overlap = 0;

    for (const word of textWords) {
      if (postWords.has(word)) {
        overlap++;
      }
    }

    return overlap >= 5;
  });
}

function hasSpecificExperienceEvidence(
  text,
  evidence
) {
  return (
    containsSpecificProfileEvidence(
      text,
      evidence
    ) ||
    containsRecentPostEvidence(
      text,
      evidence
    )
  );
}

function hasExplicitPersonalStoryEvidence(
  evidence
) {
  const experienceDescriptions =
    evidence?.experience?.descriptions || [];

  const postTexts =
    evidence?.content?.postTexts || [];

  const explicitExperiencePatterns = [
    /\bi built\b/i,
    /\bi created\b/i,
    /\bi developed\b/i,
    /\bi implemented\b/i,
    /\bi deployed\b/i,
    /\bi launched\b/i,
    /\bi faced\b/i,
    /\bi encountered\b/i,
    /\bi experienced\b/i,
    /\bi learned\b/i,
    /\bi discovered\b/i,
    /\bi solved\b/i,
    /\bwe built\b/i,
    /\bwe created\b/i,
    /\bwe developed\b/i,
    /\bwe implemented\b/i,
    /\bwe deployed\b/i,
    /\bwe faced\b/i,
    /\bwe encountered\b/i,
    /\bwe learned\b/i
  ];

  const documentedExperienceText =
    [
      ...experienceDescriptions,
      ...postTexts
    ].join(" ");

  return explicitExperiencePatterns.some(
    (pattern) =>
      pattern.test(
        documentedExperienceText
      )
  );
}

function getIdeaSentences(idea) {
  return [
    idea.topic,
    idea.objective,
    idea.suggestedHook,
    ...(idea.keyPoints || [])
  ]
    .map(normalizeText)
    .filter(Boolean);
}

function validatePersonalStory(
  idea,
  evidence,
  issues
) {
  const sentences =
    getIdeaSentences(idea);

  const hasExplicitEvidence =
    hasExplicitPersonalStoryEvidence(
      evidence
    );

  /*
   * If the profile does not contain an
   * explicitly documented personal experience,
   * reject personal-story language.
   */
  if (!hasExplicitEvidence) {
    const storyPatterns = [
      /\bmy journey\b/i,
      /\bmy experience\b/i,
      /\bmy lessons\b/i,
      /\bmy lesson\b/i,
      /\bthree lessons\b/i,
      /\blessons i learned\b/i,
      /\bi learned\b/i,
      /\bi discovered\b/i,
      /\bi realized\b/i,
      /\bi faced\b/i,
      /\bi encountered\b/i,
      /\bi experienced\b/i,
      /\bwhen i\b/i,
      /\bwhen we\b/i,
      /\bwe learned\b/i,
      /\bwe faced\b/i,
      /\bwe encountered\b/i,
      /\bmoving .* to production\b/i,
      /\bfrom .* to production\b/i
    ];

    const storyText = [
      idea.topic,
      idea.objective,
      idea.suggestedHook,
      ...(idea.keyPoints || [])
    ].join(" ");

    for (const pattern of storyPatterns) {
      const match =
        storyText.match(pattern);

      if (match) {
        issues.push(
          `Personal story is not supported by an explicitly documented experience: "${match[0]}"`
        );
      }
    }
  }

  /*
   * These patterns indicate that the content
   * is claiming something personally happened.
   */
  const personalExperiencePatterns = [
    /\bmy journey\b/i,
    /\bmy experience\b/i,
    /\bmy lesson\b/i,
    /\bmy lessons\b/i,
    /\bi learned\b/i,
    /\bi discovered\b/i,
    /\bi experienced\b/i,
    /\bi faced\b/i,
    /\bi encountered\b/i,
    /\bi realized\b/i,
    /\bi struggled\b/i,
    /\bi solved\b/i,
    /\bi built\b/i,
    /\bi created\b/i,
    /\bi developed\b/i,
    /\bi implemented\b/i,
    /\bi deployed\b/i,
    /\bi launched\b/i,
    /\bi moved\b/i,
    /\bwhen i\b/i,
    /\bwhen we\b/i,
    /\bour team\b/i,
    /\bwe learned\b/i,
    /\bwe discovered\b/i,
    /\bwe faced\b/i,
    /\bwe encountered\b/i,
    /\bwe built\b/i,
    /\bwe deployed\b/i,
    /\bwe implemented\b/i
  ];

  const personalClaims =
    sentences.filter((sentence) =>
      personalExperiencePatterns.some(
        (pattern) =>
          pattern.test(sentence)
      )
    );

  /*
   * If there is no explicit personal
   * language, the idea may be a reflective
   * professional observation.
   */
  if (
    personalClaims.length === 0
  ) {
    return;
  }

  /*
   * Every personal claim must have
   * specific evidence.
   */
  for (const claim of personalClaims) {
    const hasEvidence =
      hasSpecificExperienceEvidence(
        claim,
        evidence
      );

    if (!hasEvidence) {
      issues.push(
        `Unsupported personal experience: "${claim}"`
      );
    }
  }
}

function validatePersonalEventLanguage(
  idea,
  evidence,
  issues
) {
  const sentences =
    getIdeaSentences(idea);

  const personalEventPatterns = [
    /\bduring a recent\b/i,
    /\bon a recent project\b/i,
    /\bin a recent project\b/i,
    /\bwhile working at\b/i,
    /\bafter we\b/i,
    /\bafter i\b/i,
    /\bbefore we\b/i,
    /\bbefore i\b/i,
    /\bwhen our team\b/i,
    /\bwhen the team\b/i,
    /\bour production\b/i,
    /\bour system\b/i,
    /\bour application\b/i,
    /\bmy project\b/i,
    /\bmy system\b/i,
    /\bmy application\b/i
  ];

  for (const sentence of sentences) {
    let matchedPattern = null;

    for (
      const pattern of personalEventPatterns
    ) {
      if (pattern.test(sentence)) {
        matchedPattern = pattern;
        break;
      }
    }

    if (!matchedPattern) {
      continue;
    }

    if (
      !hasSpecificExperienceEvidence(
        sentence,
        evidence
      )
    ) {
      issues.push(
        `Potentially unsupported personal event: "${sentence}"`
      );
    }
  }
}

/*
 * Detect claims that should require evidence.
 *
 * Important:
 * Generic technical concepts such as:
 *
 * - retrieval relevance
 * - cache layer
 * - message queue
 * - workflow engine
 * - idempotent ingestion
 * - vector store
 * - container orchestration
 *
 * are NOT considered unsupported simply because
 * they are not present in the LinkedIn profile.
 *
 * The validator focuses on:
 *
 * 1. Quantitative claims
 * 2. Personal/company-specific claims
 * 3. Specific incidents
 * 4. Explicit production claims
 */
function validateSpecificClaims(
  idea,
  evidence,
  issues
) {
  const text = [
    idea.topic,
    idea.objective,
    idea.suggestedHook,
    ...(idea.keyPoints || [])
  ].join(" ");

  const normalizedText =
    normalizeText(text);

  const evidenceText =
    getEvidenceText(evidence);

  /*
   * Explicit quantitative claims.
   */
  const quantitativePatterns = [
    /\b\d+(?:\.\d+)?%\b/i,

    /\b\d+(?:\.\d+)?\s*(?:million|millions)\b/i,

    /\b\d+(?:\.\d+)?\s*(?:thousand|thousands)\b/i,

    /\b\d+(?:\.\d+)?\s*(?:billion|billions)\b/i,

    /\b\d+(?:\.\d+)?\s*(?:users|requests|customers|records|events|documents|transactions)\b/i,

    /\bmillions of users\b/i,

    /\bthousands of users\b/i,

    /\bthousands of requests\b/i,

    /\bmillions of requests\b/i,

    /\bteam of \d+\b/i
  ];

  for (
    const pattern of quantitativePatterns
  ) {
    const match =
      normalizedText.match(pattern);

    if (!match) {
      continue;
    }

    const phrase =
      normalizeText(match[0]);

    if (
      !evidenceText.includes(phrase)
    ) {
      issues.push(
        `Potentially unsupported quantitative claim: "${match[0]}"`
      );
    }
  }

  /*
   * Specific production incidents should not
   * be invented from a generic technical topic.
   */
  const incidentPatterns = [
    /\bproduction incident\b/i,
    /\bproduction outage\b/i,
    /\bproduction failure\b/i,
    /\bproduction issue\b/i,
    /\bdata pipeline failure\b/i,
    /\bservice outage\b/i,
    /\bsystem outage\b/i,
    /\bmajor incident\b/i
  ];

  for (
    const pattern of incidentPatterns
  ) {
    const match =
      normalizedText.match(pattern);

    if (!match) {
      continue;
    }

    const phrase =
      normalizeText(match[0]);

    /*
     * Allow the concept when the profile
     * explicitly documents the same incident.
     */
    if (
      !evidenceText.includes(phrase)
    ) {
      issues.push(
        `Potentially unsupported specific incident: "${match[0]}"`
      );
    }
  }

  /*
   * Personal/company-specific claims.
   *
   * These are different from generic technical
   * statements because they imply something
   * actually happened to the person or their team.
   */
  const personalSpecificPatterns = [
    /\bi improved\b/i,
    /\bi reduced\b/i,
    /\bi increased\b/i,
    /\bi optimized\b/i,
    /\bi migrated\b/i,
    /\bi scaled\b/i,
    /\bi automated\b/i,
    /\bi delivered\b/i,
    /\bi achieved\b/i,
    /\bi introduced\b/i,
    /\bi led\b/i,
    /\bi managed\b/i,

    /\bwe improved\b/i,
    /\bwe reduced\b/i,
    /\bwe increased\b/i,
    /\bwe optimized\b/i,
    /\bwe migrated\b/i,
    /\bwe scaled\b/i,
    /\bwe automated\b/i,
    /\bwe delivered\b/i,

    /\bat [a-z0-9][a-z0-9 .&-]{2,40},?\s+i\b/i,

    /\bwhile working at\b/i,
    /\bduring my time at\b/i,
    /\bat my company\b/i
  ];

  for (
    const pattern of personalSpecificPatterns
  ) {
    const match =
      text.match(pattern);

    if (!match) {
      continue;
    }

    const containingSentence =
      getIdeaSentences(idea).find(
        (sentence) =>
          sentence.includes(
            normalizeText(match[0])
          )
      );

    const claimText =
      containingSentence || match[0];

    if (
      !hasSpecificExperienceEvidence(
        claimText,
        evidence
      )
    ) {
      issues.push(
        `Potentially unsupported personal or company-specific claim: "${claimText}"`
      );
    }
  }
}

function validateContentIdea(
  idea,
  evidence,
  index
) {
  const issues = [];

  const normalizedType =
    normalizeText(idea.type);

  const isPersonalStory =
    normalizedType.includes(
      "personal"
    ) ||
    normalizedType.includes(
      "story"
    );

  if (isPersonalStory) {
    validatePersonalStory(
      idea,
      evidence,
      issues
    );
  }

  validatePersonalEventLanguage(
    idea,
    evidence,
    issues
  );

  validateSpecificClaims(
    idea,
    evidence,
    issues
  );

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
    buildProfileEvidence(
      profile
    );

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
      (result) =>
        result.valid
    ),
    results
  };
}