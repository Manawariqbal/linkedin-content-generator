import {
  getLinkedInProfile
} from "./src/services/profileService.js";

const profileUrl =
  "https://www.linkedin.com/in/satyanadella/";

async function main() {
  try {
    console.log(
      "🚀 Testing profile service..."
    );

    const profile =
      await getLinkedInProfile(
        profileUrl
      );

    console.log(
      "✅ Final clean profile:"
    );

    console.log(
      JSON.stringify(
        profile,
        null,
        2
      )
    );
  } catch (error) {
    console.error(
      "❌ Profile service failed:"
    );

    console.error(error.message);
  }
}

main();