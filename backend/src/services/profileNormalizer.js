export function normalizeLinkedInProfile(
  rawProfile
) {
  if (!rawProfile) {
    throw new Error(
      "LinkedIn profile data is required"
    );
  }

  const recentPosts =
    Array.isArray(rawProfile.posts)
      ? rawProfile.posts.slice(0, 10).map((post) => ({
          title: post.title || "",
          text:
            post.attribution || "",
          date:
            post.created_at || null
        }))
      : [];

  const experience =
    Array.isArray(rawProfile.experience)
      ? rawProfile.experience.map((item) => ({
          company:
            item.company || "",
          title:
            item.title || "",
          startDate:
            item.start_date || null,
          endDate:
            item.end_date || null,
          description:
            item.description_html || ""
        }))
      : [];

  const education =
    Array.isArray(rawProfile.education)
      ? rawProfile.education.map((item) => ({
          institution:
            item.title || "",
          degree:
            item.degree || "",
          field:
            item.field || "",
          startYear:
            item.start_year || null,
          endYear:
            item.end_year || null
        }))
      : [];

  return {
    id:
      rawProfile.linkedin_id ||
      rawProfile.id ||
      null,

    name:
      rawProfile.name ||
      `${rawProfile.first_name || ""} ${
        rawProfile.last_name || ""
      }`.trim(),

    headline:
      rawProfile.position || "",

    about:
      rawProfile.about || "",

    location:
      rawProfile.city ||
      rawProfile.location ||
      "",

    currentCompany:
      rawProfile.current_company?.name ||
      rawProfile.current_company_name ||
      "",

    currentTitle:
      rawProfile.current_company?.title ||
      rawProfile.position ||
      "",

    experience,

    education,

    recentPosts,

    followers:
      rawProfile.followers || 0,

    connections:
      rawProfile.connections || 0,

    profileUrl:
      rawProfile.input_url ||
      rawProfile.url ||
      ""
  };
}