import fs from "fs";

async function main() {
  const profiles = JSON.parse(
    fs.readFileSync(
      "../data/sample-profiles.json",
      "utf8"
    )
  );

  const profile = profiles[0];

  console.log(
    "🚀 Testing production content API..."
  );

  const response = await fetch(
    "http://localhost:5000/api/content/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile
      })
    }
  );

  const result = await response.json();

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch((error) => {
  console.error(
    "❌ API test failed:",
    error
  );
});