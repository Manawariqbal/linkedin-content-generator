import fs from "fs";

async function main() {
  const profiles = JSON.parse(
    fs.readFileSync("../data/sample-profiles.json", "utf8")
  );

  const profile = profiles[0];

  console.log("🔍 Step 1: Analyzing profile...");

  const analysisResponse = await fetch(
    "http://localhost:5000/test-profile-analysis",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    }
  );

  const analysisResult = await analysisResponse.json();

  if (!analysisResult.success) {
    throw new Error(
      `Profile analysis failed: ${analysisResult.error}`
    );
  }

  console.log("✅ Profile analysis completed");

  console.log("🧠 Step 2: Creating content strategy...");

  const strategyResponse = await fetch(
    "http://localhost:5000/test-content-strategy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile,
        profileAnalysis: analysisResult.analysis
      })
    }
  );

  const strategyResult = await strategyResponse.json();

  if (!strategyResult.success) {
    throw new Error(
      `Content strategy failed: ${strategyResult.error}`
    );
  }

  console.log("✅ Content strategy generated");

  console.log("✍️ Step 3: Generating LinkedIn posts...");

  const postsResponse = await fetch(
    "http://localhost:5000/test-post-generation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile,
        profileAnalysis: analysisResult.analysis,
        contentStrategy: strategyResult.strategy
      })
    }
  );

  const postsResult = await postsResponse.json();

  if (!postsResult.success) {
    throw new Error(
      `Post generation failed: ${postsResult.error}`
    );
  }

  console.log("✅ LinkedIn posts generated");

  console.log(
    JSON.stringify(postsResult, null, 2)
  );
}

main().catch((error) => {
  console.error("❌ Test failed:", error.message);
});