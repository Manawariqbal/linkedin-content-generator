function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function buildProfileEvidence(profile) {
  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  const recentPosts = Array.isArray(profile.recentPosts)
    ? profile.recentPosts
    : [];

  const education = Array.isArray(profile.education)
    ? profile.education
    : [];

  const companies = unique(
    experience.map((item) =>
      clean(item.company)
    )
  );

  const jobTitles = unique(
    experience.map((item) =>
      clean(item.title)
    )
  );

  const experienceDescriptions = unique(
    experience.map((item) =>
      clean(item.description)
    )
  );

  const educationInstitutions = unique(
    education.map((item) =>
      clean(item.institution)
    )
  );

  const degrees = unique(
    education.map((item) =>
      clean(item.degree)
    )
  );

  const fieldsOfStudy = unique(
    education.map((item) =>
      clean(item.field)
    )
  );

  const postTitles = unique(
    recentPosts.map((post) =>
      clean(post.title)
    )
  );

  const postTexts = unique(
    recentPosts.map((post) =>
      clean(post.text)
    )
  );

  return {
    identity: {
      name: clean(profile.name),
      headline: clean(profile.headline),
      about: clean(profile.about),
      location: clean(profile.location),
      currentCompany: clean(
        profile.currentCompany
      ),
      currentTitle: clean(
        profile.currentTitle
      )
    },

    experience: {
      companies,
      jobTitles,
      descriptions: experienceDescriptions
    },

    education: {
      institutions: educationInstitutions,
      degrees,
      fieldsOfStudy
    },

    content: {
      postTitles,
      postTexts
    }
  };
}