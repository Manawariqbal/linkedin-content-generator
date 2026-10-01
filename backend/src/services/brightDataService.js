import dotenv from "dotenv";

dotenv.config();

const BRIGHT_DATA_API_KEY =
  process.env.BRIGHT_DATA_API_KEY;

const BRIGHT_DATA_DATASET_ID =
  process.env.BRIGHT_DATA_DATASET_ID;

const BRIGHT_DATA_TRIGGER_URL =
  "https://api.brightdata.com/datasets/v3/trigger";

const BRIGHT_DATA_SNAPSHOT_URL =
  "https://api.brightdata.com/datasets/v3/snapshot";

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export async function scrapeLinkedInProfiles(
  profileUrls
) {
  if (!BRIGHT_DATA_API_KEY) {
    throw new Error(
      "BRIGHT_DATA_API_KEY is not configured"
    );
  }

  if (!BRIGHT_DATA_DATASET_ID) {
    throw new Error(
      "BRIGHT_DATA_DATASET_ID is not configured"
    );
  }

  if (
    !Array.isArray(profileUrls) ||
    profileUrls.length === 0
  ) {
    throw new Error(
      "At least one LinkedIn profile URL is required"
    );
  }

  const response = await fetch(
    `${BRIGHT_DATA_TRIGGER_URL}?dataset_id=${BRIGHT_DATA_DATASET_ID}&format=json&uncompressed_webhook=true`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${BRIGHT_DATA_API_KEY}`,

        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        profileUrls.map((url) => ({
          url
        }))
      )
    }
  );

  const responseText =
    await response.text();

  console.log(
    "Bright Data status:",
    response.status
  );

  console.log(
    "Bright Data response:",
    responseText
  );

  if (!response.ok) {
    throw new Error(
      `Bright Data API failed (${response.status}): ${responseText}`
    );
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(
      `Bright Data returned invalid JSON: ${responseText}`
    );
  }
}

export async function getBrightDataSnapshot(
  snapshotId
) {
  if (!BRIGHT_DATA_API_KEY) {
    throw new Error(
      "BRIGHT_DATA_API_KEY is not configured"
    );
  }

  if (!snapshotId) {
    throw new Error(
      "Snapshot ID is required"
    );
  }

  const response = await fetch(
    `${BRIGHT_DATA_SNAPSHOT_URL}/${snapshotId}?format=json`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${BRIGHT_DATA_API_KEY}`
      }
    }
  );

  const responseText =
    await response.text();

  if (response.status === 202) {
    return {
      ready: false,
      data: JSON.parse(responseText)
    };
  }

  if (!response.ok) {
    throw new Error(
      `Bright Data snapshot failed (${response.status}): ${responseText}`
    );
  }

  try {
    return {
      ready: true,
      data: JSON.parse(responseText)
    };
  } catch {
    throw new Error(
      `Bright Data returned invalid snapshot JSON: ${responseText}`
    );
  }
}

export async function waitForBrightDataSnapshot(
  snapshotId,
  options = {}
) {
  const maxAttempts =
    options.maxAttempts || 10;

  const intervalMs =
    options.intervalMs || 30000;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    console.log(
      `⏳ Checking snapshot (${attempt}/${maxAttempts})...`
    );

    const result =
      await getBrightDataSnapshot(
        snapshotId
      );

    if (result.ready) {
      console.log(
        "✅ Bright Data snapshot is ready"
      );

      return result.data;
    }

    console.log(
      "⏳ Snapshot still processing..."
    );

    if (attempt < maxAttempts) {
      console.log(
        `Waiting ${intervalMs / 1000} seconds...`
      );

      await sleep(intervalMs);
    }
  }

  throw new Error(
    "Bright Data snapshot was not ready within the maximum waiting time"
  );
}