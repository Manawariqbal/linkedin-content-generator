import { buildProfileEvidence } from "./profileEvidence.js";

const FIRST_PERSON_PATTERNS = [
  /\bi built\b/gi,
  /\bi created\b/gi,
  /\bi developed\b/gi,
  /\bi implemented\b/gi,
  /\bi launched\b/gi,
  /\bi deployed\b/gi,
  /\bi designed\b/gi,
  /\bi worked on\b/gi,
  /\bi experienced\b/gi,
  /\bi faced\b/gi,
  /\bi learned\b/gi,
  /\bi took\b/gi,
  /\bi shipped\b/gi,
  /\bi solved\b/gi,
  /\bi saw\b/gi,
  /\bi've seen\b/gi,
  /\bi have seen\b/gi,
  /\bwe built\b/gi,
  /\bwe created\b/gi,
  /\bwe developed\b/gi,
  /\bwe launched\b/gi,
  /\bwe deployed\b/gi,
  /\bwe implemented\b/gi
];

const INCIDENT_PATTERNS = [
  /\bi encountered\b/gi,
  /\bi ran into\b/gi,
  /\bi faced\b/gi,
  /\bi experienced\b/gi,
  /\bi discovered\b/gi,
  /\bi found\b/gi,
  /\bi saw\b/gi,
  /\bi've seen\b/gi,
  /\bwe encountered\b/gi,
  /\bwe ran into\b/gi,
  /\bwe faced\b/gi,
  /\bwe experienced\b/gi
];

const TEAM_PATTERNS = [
  /\bour system\b/gi,
  /\bour service\b/gi,
  /\bour application\b/gi,
  /\bour team\b/gi,
  /\bour customers\b/gi,
  /\bour users\b/gi,
  /\bour production\b/gi,
  /\bour deployment\b/gi
];

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getPostText(post) {
  return normalizeText(
    [
      post.topic,
      post.hook,
      post.body,
      post.callToAction
    ].join(" ")
  );
}

function getEvidenceText(evidence) {
  return normalizeText(
    JSON.stringify(evidence)
  );
}

function getEvidenceTerms(evidence) {
  const rawText = getEvidenceText(evidence);

  return rawText
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

function getSentences(post) {
  return [
    post.topic,
    post.hook,
    post.body,
    post.callToAction
  ]
    .join(". ")
    .split(/[.!?]+/)
    .map(normalizeText)
    .filter(Boolean);
}

function hasMeaningfulEvidence(
  sentence,
  evidence
) {
  const normalizedSentence =
    normalizeText(sentence);

  const evidenceText =
    getEvidenceText(evidence);

  /*
   * Strong evidence:
   * Check whether the sentence contains
   * important profile-specific anchors.
   */

  const anchorTerms = [
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
      (value) => value.length >= 4
    );

  /*
   * Exact phrase from the profile.
   */
  for (const anchor of anchorTerms) {
    if (
      anchor.length >= 8 &&
      normalizedSentence.includes(anchor)
    ) {
      return true;
    }
  }

  /*
   * Token overlap.
   *
   * Example:
   *
   * Profile:
   * "building AI-powered cloud applications"
   *
   * Post:
   * "I built an AI-powered cloud application"
   *
   * Enough meaningful tokens overlap.
   */
  const sentenceWords =
    new Set(
      normalizedSentence
        .split(/\W+/)
        .filter(
          (word) =>
            word.length >= 4
        )
    );

  const evidenceTerms =
    getEvidenceTerms(evidence);

  let overlap = 0;

  for (const word of sentenceWords) {
    if (
      evidenceTerms.includes(word)
    ) {
      overlap++;
    }
  }

  return overlap >= 2;
}

function findUnsupportedFirstPersonClaims(
  post,
  evidence
) {
  const postText = getPostText(post);
  const sentences = getSentences(post);

  const issues = [];

  for (const pattern of FIRST_PERSON_PATTERNS) {
    const matches =
      postText.match(pattern);

    if (!matches) {
      continue;
    }

    for (const match of matches) {
      const containingSentence =
        sentences.find(
          (sentence) =>
            sentence.includes(
              normalizeText(match)
            )
        );

      if (!containingSentence) {
        continue;
      }

      /*
       * If the sentence contains meaningful
       * profile evidence, allow it.
       */
      if (
        hasMeaningfulEvidence(
          containingSentence,
          evidence
        )
      ) {
        continue;
      }

      issues.push(
        `Unsupported personal claim: "${match}"`
      );
    }
  }

  return issues;
}

function findUnsupportedIncidents(
  post,
  evidence
) {
  const postText = getPostText(post);
  const sentences = getSentences(post);

  const issues = [];

  for (const pattern of INCIDENT_PATTERNS) {
    const matches =
      postText.match(pattern);

    if (!matches) {
      continue;
    }

    for (const match of matches) {
      const containingSentence =
        sentences.find(
          (sentence) =>
            sentence.includes(
              normalizeText(match)
            )
        );

      if (!containingSentence) {
        continue;
      }

      if (
        !hasMeaningfulEvidence(
          containingSentence,
          evidence
        )
      ) {
        issues.push(
          `Potentially unsupported incident/experience: "${containingSentence}"`
        );
      }
    }
  }

  return issues;
}

function findUnsupportedTeamClaims(
  post,
  evidence
) {
  const postText = getPostText(post);
  const evidenceText =
    getEvidenceText(evidence);

  const issues = [];

  for (const pattern of TEAM_PATTERNS) {
    const matches =
      postText.match(pattern);

    if (!matches) {
      continue;
    }

    for (const match of matches) {
      if (
        evidenceText.includes(
          normalizeText(match)
        )
      ) {
        continue;
      }

      issues.push(
        `Unsupported team/production claim: "${match}"`
      );
    }
  }

  return issues;
}

function findSuspiciousNumbers(
  post,
  evidence
) {
  const postText = getPostText(post);
  const evidenceText =
    getEvidenceText(evidence);

  const numbers =
    postText.match(
      /\b\d+(?:\.\d+)?%?\b/g
    ) || [];

  const suspiciousNumbers = [];

  for (const number of numbers) {
    const numericValue =
      parseFloat(number);

    /*
     * Small numbers are usually list
     * numbering rather than factual claims.
     */
    if (
      numericValue <= 10 &&
      !number.includes("%")
    ) {
      continue;
    }

    if (
      !evidenceText.includes(
        normalizeText(number)
      )
    ) {
      suspiciousNumbers.push(number);
    }
  }

  return suspiciousNumbers;
}

export function validatePostGrounding(
  post,
  profile
) {
  const evidence =
    buildProfileEvidence(profile);

  const issues = [];

  issues.push(
    ...findUnsupportedFirstPersonClaims(
      post,
      evidence
    )
  );

  issues.push(
    ...findUnsupportedIncidents(
      post,
      evidence
    )
  );

  issues.push(
    ...findUnsupportedTeamClaims(
      post,
      evidence
    )
  );

  const suspiciousNumbers =
    findSuspiciousNumbers(
      post,
      evidence
    );

  if (
    suspiciousNumbers.length > 0
  ) {
    issues.push(
      `Potentially unsupported numbers: ${suspiciousNumbers.join(
        ", "
      )}`
    );
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function validatePostsGrounding(
  posts,
  profile
) {
  const results =
    posts.map((post, index) => {
      const validation =
        validatePostGrounding(
          post,
          profile
        );

      return {
        postIndex: index + 1,
        contentType:
          post.contentType,
        valid:
          validation.valid,
        issues:
          validation.issues
      };
    });

  return {
    valid: results.every(
      (result) => result.valid
    ),
    results
  };
}