import {
  scrapeLinkedInProfiles,
  waitForBrightDataSnapshot
} from "./src/services/brightDataService.js";

import {
  normalizeLinkedInProfile
} from "./src/services/profileNormalizer.js";

const profileUrl =
  "https://www.linkedin.com/in/satyanadella/";

async function main() {
  try {
    console.log(
      "🔍 Triggering Bright Data scraper..."
    );

    const result =
      await scrapeLinkedInProfiles([
        profileUrl
      ]);

    console.log(
      "📦 Snapshot ID:",
      result.snapshot_id
    );

    const snapshot =
      await waitForBrightDataSnapshot(
        result.snapshot_id
      );

    const rawProfile =
      Array.isArray(snapshot)
        ? snapshot[0]
        : snapshot;

    console.log(
      "🧹 Normalizing profile..."
    );

    const normalizedProfile =
      normalizeLinkedInProfile(
        rawProfile
      );

    console.log(
      "✅ Normalized profile:"
    );

    console.log(
      JSON.stringify(
        normalizedProfile,
        null,
        2
      )
    );
  } catch (error) {
    console.error(
      "❌ Bright Data test failed:"
    );

    console.error(error.message);
  }
}

main();