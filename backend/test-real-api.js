async function main() {
  const response = await fetch(
    "http://localhost:5000/api/content/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        linkedinUrl:
          "https://www.linkedin.com/in/satyanadella/"
      })
    }
  );

  const result =
    await response.json();

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(
    "❌ API test failed:",
    error
  );
});