import { analyzeProfile } from "../services/profileAnalyzer.js";
import { createContentStrategy } from "../services/contentStrategy.js";
import { generatePosts } from "../services/postGenerator.js";
import { getLinkedInProfile } from "../services/profileService.js";


let profileFetcher = getLinkedInProfile;
let profileAnalyzer = analyzeProfile;
let strategyCreator = createContentStrategy;
let postGenerator = generatePosts;


export function setBatchDependencies({
  fetchProfile,
  analyze,
  createStrategy,
  generate
}) {
  profileFetcher =
    fetchProfile || getLinkedInProfile;

  profileAnalyzer =
    analyze || analyzeProfile;

  strategyCreator =
    createStrategy || createContentStrategy;

  postGenerator =
    generate || generatePosts;
}


function isProfileUsable(profile) {
  if (!profile || typeof profile !== "object") {
    return false;
  }

  const hasName =
    typeof profile.name === "string" &&
    profile.name.trim().length > 0;

  const hasHeadline =
    typeof profile.headline === "string" &&
    profile.headline.trim().length > 0;

  const hasExperience =
    Array.isArray(profile.experience) &&
    profile.experience.length > 0;

  const hasEducation =
    Array.isArray(profile.education) &&
    profile.education.length > 0;

  const hasAbout =
    typeof profile.about === "string" &&
    profile.about.trim().length > 0;

  return (
    hasName ||
    hasHeadline ||
    hasExperience ||
    hasEducation ||
    hasAbout
  );
}


function isValidLinkedInUrl(url) {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "www.linkedin.com" &&
      /^\/in\/[^/]+\/?$/.test(
        parsedUrl.pathname
      )
    );
  } catch {
    return false;
  }
}


async function generateContentForProfile(profile) {
  const profileAnalysis =
    await profileAnalyzer(profile);

  const contentStrategy =
    await strategyCreator(
      profile,
      profileAnalysis
    );

  const posts =
    await postGenerator(
      profile,
      profileAnalysis,
      contentStrategy
    );

  return {
    profile,
    profileAnalysis,
    contentStrategy,
    posts
  };
}


export async function generateContent(req, res) {
  try {
    const { linkedinUrl, profile } =
      req.body || {};

    let finalProfile;

    if (linkedinUrl) {
      console.log(
        "LinkedIn URL received"
      );

      finalProfile =
        await profileFetcher(
          linkedinUrl
        );

    } else if (
      profile &&
      Object.keys(profile).length > 0
    ) {
      console.log(
        "Using provided profile data"
      );

      finalProfile = profile;

    } else {
      return res.status(400).json({
        success: false,
        error:
          "LinkedIn profile URL or profile data is required"
      });
    }

    console.log(
      "Step 1: Analyzing profile..."
    );

    const result =
      await generateContentForProfile(
        finalProfile
      );

    console.log(
      "Content generation completed"
    );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(
      "Content generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to generate LinkedIn content"
    });
  }
}


async function processBatchItem(linkedinUrl) {
  try {
    console.log(
      `Starting batch profile: ${linkedinUrl}`
    );

    const profile =
      await profileFetcher(
        linkedinUrl
      );

    if (!isProfileUsable(profile)) {
      throw new Error(
        "LinkedIn profile data is empty or insufficient"
      );
    }

    const result =
      await generateContentForProfile(
        profile
      );

    console.log(
      `Batch profile completed: ${linkedinUrl}`
    );

    return {
      linkedinUrl,
      success: true,
      data: result
    };

  } catch (error) {
    console.error(
      `Batch profile failed: ${linkedinUrl}`,
      error.message
    );

    return {
      linkedinUrl,
      success: false,
      error:
        error.message ||
        "Failed to generate content"
    };
  }
}


async function processWithConcurrency(
  items,
  concurrency
) {
  const results =
    new Array(items.length);

  let currentIndex = 0;

  async function worker() {
    while (true) {
      const index = currentIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] =
        await processBatchItem(
          items[index]
        );
    }
  }

  const workers = Array.from(
    {
      length: Math.min(
        concurrency,
        items.length
      )
    },
    () => worker()
  );

  await Promise.all(workers);

  return results;
}


export async function generateBatchContent(
  req,
  res
) {
  try {
    const { linkedinUrls } =
      req.body || {};

    if (
      !Array.isArray(linkedinUrls) ||
      linkedinUrls.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "linkedinUrls must be a non-empty array"
      });
    }

    const uniqueUrls = [
      ...new Set(
        linkedinUrls
          .filter(
            (url) =>
              typeof url === "string"
          )
          .map(
            (url) =>
              url.trim()
          )
          .filter(Boolean)
      )
    ];

    if (uniqueUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "At least one valid LinkedIn URL is required"
      });
    }

    const invalidUrls =
      uniqueUrls.filter(
        (url) =>
          !isValidLinkedInUrl(url)
      );

    if (invalidUrls.length > 0) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid LinkedIn profile URL(s)",
        invalidUrls
      });
    }

    const MAX_BATCH_SIZE = 10;
    const BATCH_CONCURRENCY = 1;

    if (
      uniqueUrls.length >
      MAX_BATCH_SIZE
    ) {
      return res.status(400).json({
        success: false,
        error:
          `Maximum batch size is ${MAX_BATCH_SIZE} profiles`
      });
    }

    console.log(
      `Starting batch processing for ${uniqueUrls.length} profiles`
    );

    const results =
      await processWithConcurrency(
        uniqueUrls,
        BATCH_CONCURRENCY
      );

    const successful =
      results.filter(
        (result) => result.success
      ).length;

    const failed =
      results.filter(
        (result) => !result.success
      ).length;

    return res.status(200).json({
      success: true,

      data: {
        total: results.length,
        successful,
        failed,
        results
      }
    });

  } catch (error) {
    console.error(
      "Batch content generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to process batch"
    });
  }
}