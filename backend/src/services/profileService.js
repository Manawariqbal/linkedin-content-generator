import {
  scrapeLinkedInProfiles,
  waitForBrightDataSnapshot
} from "./brightDataService.js";

import {
  normalizeLinkedInProfile
} from "./profileNormalizer.js";

export async function getLinkedInProfile(
  profileUrl
) {
  if (!profileUrl) {
    throw new Error(
      "LinkedIn profile URL is required"
    );
  }

  console.log(
    "🔍 Scraping LinkedIn profile..."
  );

  const scrapeResult =
    await scrapeLinkedInProfiles([
      profileUrl
    ]);

  const snapshotId =
    scrapeResult.snapshot_id;

  if (!snapshotId) {
    throw new Error(
      "Bright Data did not return a snapshot ID"
    );
  }

  console.log(
    `📦 Snapshot ID: ${snapshotId}`
  );

  const snapshot =
    await waitForBrightDataSnapshot(
      snapshotId
    );

  if (
    !Array.isArray(snapshot) ||
    snapshot.length === 0
  ) {
    throw new Error(
      "Bright Data returned no LinkedIn profile data"
    );
  }

  const rawProfile =
    snapshot[0];

  const normalizedProfile =
    normalizeLinkedInProfile(
      rawProfile
    );

  console.log(
    "✅ LinkedIn profile normalized"
  );

  return normalizedProfile;
}