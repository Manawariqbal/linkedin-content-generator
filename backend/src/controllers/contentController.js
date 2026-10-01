import { analyzeProfile } from "../services/profileAnalyzer.js";
import { createContentStrategy } from "../services/contentStrategy.js";
import { generatePosts } from "../services/postGenerator.js";
import { getLinkedInProfile } from "../services/profileService.js";

export async function generateContent(req, res) {
  try {
    const { linkedinUrl, profile } = req.body || {};

    let finalProfile;

    // Option 1: Real LinkedIn URL
    if (linkedinUrl) {
      console.log("🔗 LinkedIn URL received");

      finalProfile =
        await getLinkedInProfile(linkedinUrl);
    }

    // Option 2: Existing profile object
    else if (
      profile &&
      Object.keys(profile).length > 0
    ) {
      console.log(
        "📦 Using provided profile data"
      );

      finalProfile = profile;
    }

    else {
      return res.status(400).json({
        success: false,
        error:
          "LinkedIn profile URL or profile data is required"
      });
    }

    console.log(
      "🔍 Step 1: Analyzing profile..."
    );

    const profileAnalysis =
      await analyzeProfile(finalProfile);

    console.log(
      "✅ Profile analysis completed"
    );

    console.log(
      "🧠 Step 2: Creating content strategy..."
    );

    const contentStrategy =
      await createContentStrategy(
        finalProfile,
        profileAnalysis
      );

    console.log(
      "✅ Content strategy generated"
    );

    console.log(
      "✍️ Step 3: Generating LinkedIn posts..."
    );

    const posts =
      await generatePosts(
        finalProfile,
        profileAnalysis,
        contentStrategy
      );

    console.log(
      "✅ LinkedIn posts generated"
    );

    return res.status(200).json({
      success: true,

      data: {
        profile: finalProfile,
        profileAnalysis,
        contentStrategy,
        posts
      }
    });

  } catch (error) {
    console.error(
      "❌ Content generation error:",
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