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
  /\bi moved\b/gi,
  /\bi led\b/gi,
  /\bi managed\b/gi,
  /\bi improved\b/gi,
  /\bi reduced\b/gi,
  /\bi increased\b/gi,
  /\bi delivered\b/gi,
  /\bi achieved\b/gi,
  /\bi drove\b/gi,
  /\bi introduced\b/gi,
  /\bi migrated\b/gi,
  /\bi optimized\b/gi,
  /\bi scaled\b/gi,
  /\bi automated\b/gi,
  /\bi mentored\b/gi,
  /\bi advised\b/gi,
  /\bi helped\b/gi,
  /\bwe built\b/gi,
  /\bwe created\b/gi,
  /\bwe developed\b/gi,
  /\bwe launched\b/gi,
  /\bwe deployed\b/gi,
  /\bwe implemented\b/gi,
  /\bwe improved\b/gi,
  /\bwe reduced\b/gi,
  /\bwe increased\b/gi,
  /\bwe delivered\b/gi
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
  /\bi have seen\b/gi,
  /\bwe encountered\b/gi,
  /\bwe ran into\b/gi,
  /\bwe faced\b/gi,
  /\bwe experienced\b/gi,
  /\bwe discovered\b/gi,
  /\bwe found\b/gi
];

const TEAM_PATTERNS = [
  /\bour system\b/gi,
  /\bour service\b/gi,
  /\bour application\b/gi,
  /\bour team\b/gi,
  /\bour customers\b/gi,
  /\bour users\b/gi,
  /\bour production\b/gi,
  /\bour deployment\b/gi,
  /\bmy team\b/gi,
  /\bmy customers\b/gi,
  /\bmy users\b/gi,
  /\bmy system\b/gi,
  /\bmy service\b/gi,
  /\bmy application\b/gi,
  /\bmy production\b/gi
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

  const anchorTerms = [
    ...(evidence.identity
      ? Object.values(evidence.identity)
      : []),

    ...(evidence.experience
      ? [
          ...(evidence.experience.companies || []),
          ...(evidence.experience.jobTitles || []),
          ...(evidence.experience.descriptions || [])
        ]
      : []),

    ...(evidence.education
      ? [
          ...(evidence.education.institutions || []),
          ...(evidence.education.degrees || []),
          ...(evidence.education.fieldsOfStudy || [])
        ]
      : [])
  ]
    .map(normalizeText)
    .filter(
      (value) => value.length >= 15
    );

  for (const anchor of anchorTerms) {
    if (
      normalizedSentence.includes(anchor)
    ) {
      return true;
    }
  }

  const profilePosts =
    evidence.content?.postTexts || [];

  const sentenceWords =
    new Set(
      normalizedSentence
        .split(/\W+/)
        .filter(
          (word) => word.length >= 5
        )
    );

  for (const postText of profilePosts) {
    const postWords =
      new Set(
        normalizeText(postText)
          .split(/\W+/)
          .filter(
            (word) => word.length >= 5
          )
      );

    let overlap = 0;

    for (const word of sentenceWords) {
      if (postWords.has(word)) {
        overlap++;
      }
    }

    if (overlap >= 4) {
      return true;
    }
  }

  return false;
}

function findUnsupportedFirstPersonClaims(
  post,
  evidence
) {
  const postText =
    getPostText(post);

  const sentences =
    getSentences(post);

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

      if (
        hasMeaningfulEvidence(
          containingSentence,
          evidence
        )
      ) {
        continue;
      }

      issues.push(
        `Unsupported personal claim: "${containingSentence}"`
      );
    }
  }

  return [
    ...new Set(issues)
  ];
}

function findUnsupportedIncidents(
  post,
  evidence
) {
  const postText =
    getPostText(post);

  const sentences =
    getSentences(post);

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

  return [
    ...new Set(issues)
  ];
}

function findUnsupportedTeamClaims(
  post,
  evidence
) {
  const postText =
    getPostText(post);

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

  return [
    ...new Set(issues)
  ];
}

function isYear(number) {
  const numericValue =
    parseInt(number, 10);

  return (
    !number.includes(".") &&
    !number.includes("%") &&
    numericValue >= 1900 &&
    numericValue <= 2100
  );
}

function sentenceContainsPersonalContext(
  sentence
) {
  const normalizedSentence =
    normalizeText(sentence);

  const allPatterns = [
    ...FIRST_PERSON_PATTERNS,
    ...INCIDENT_PATTERNS,
    ...TEAM_PATTERNS
  ];

  return allPatterns.some(
    (pattern) => {
      pattern.lastIndex = 0;

      return pattern.test(
        normalizedSentence
      );
    }
  );
}

function findSuspiciousNumbers(
  post,
  evidence
) {
  const postText =
    getPostText(post);

  const evidenceText =
    getEvidenceText(evidence);

  const sentences =
    getSentences(post);

  /*
   * Important:
   * The previous regex could extract "85" instead
   * of "85%" because \b after % does not behave
   * as intended. This version captures percentages
   * correctly.
   */
  const numbers =
    postText.match(
      /\b\d+(?:\.\d+)?%?/g
    ) || [];

  const suspiciousNumbers = [];

  for (const number of numbers) {
    const numericValue =
      parseFloat(number);

    /*
     * Calendar years are contextual information,
     * not automatically personal claims.
     */
    if (isYear(number)) {
      continue;
    }

    /*
     * Small numbers are usually simple quantities
     * or non-suspicious values.
     */
    if (
      numericValue <= 10 &&
      !number.includes("%")
    ) {
      continue;
    }

    /*
     * Numbers already present in the profile
     * evidence are considered grounded.
     */
    if (
      evidenceText.includes(
        normalizeText(number)
      )
    ) {
      continue;
    }

    const containingSentence =
      sentences.find(
        (sentence) =>
          sentence.includes(
            normalizeText(number)
          )
      );

    if (!containingSentence) {
      continue;
    }

    /*
     * Percentages represent measurable metrics.
     * Unsupported percentages should always be
     * flagged, even if the sentence is written
     * as a general industry statement.
     */
    const isPercentage =
      number.includes("%");

    /*
     * Other unsupported numbers are flagged only
     * when they appear in a personal, incident,
     * team, or production claim.
     */
    if (
      isPercentage ||
      sentenceContainsPersonalContext(
        containingSentence
      )
    ) {
      suspiciousNumbers.push(number);
    }
  }

  return [
    ...new Set(suspiciousNumbers)
  ];
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
    issues: [
      ...new Set(issues)
    ]
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