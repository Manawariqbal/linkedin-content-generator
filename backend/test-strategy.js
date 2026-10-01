import fs from "fs";

async function main() {
  const profiles = JSON.parse(
    fs.readFileSync("../data/sample-profiles.json", "utf8")
  );

  const profile = profiles[0];

  console.log("🔍 Analyzing profile...");

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
    console.error("❌ Profile analysis failed:");
    console.error(analysisResult);
    return;
  }

  console.log("✅ Profile analysis completed");

  console.log("🧠 Creating content strategy...");

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
    console.error("❌ Content strategy failed:");
    console.error(strategyResult);
    return;
  }

  console.log("✅ Content strategy generated");

  console.log(
    JSON.stringify(strategyResult, null, 2)
  );
}

main().catch((error) => {
  console.error("❌ Test failed:", error);
});