import Groq from "groq-sdk";

export function createGroqProvider() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured"
    );
  }

  const client = new Groq({
    apiKey
  });

  const model =
    process.env.GROQ_MODEL ||
    "llama-3.3-70b-versatile";

  return {
    name: "groq",

    async generate(prompt) {
      const response =
        await client.chat.completions.create({
          model,

          messages: [
            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7,

          response_format: {
            type: "json_object"
          }
        });

      const content =
        response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(
          "Groq returned an empty response"
        );
      }

      return content;
    }
  };
}