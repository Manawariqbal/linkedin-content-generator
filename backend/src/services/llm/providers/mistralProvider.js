import { Mistral } from "@mistralai/mistralai";

export function createMistralProvider() {
  const apiKey =
    process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "MISTRAL_API_KEY is not configured"
    );
  }

  const client = new Mistral({
    apiKey
  });

  const model =
    process.env.MISTRAL_MODEL ||
    "mistral-large-latest";

  return {
    name: "mistral",

    async generate(prompt) {
      const response =
        await client.chat.complete({
          model,

          messages: [
            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7,

          responseFormat: {
            type: "json_object"
          }
        });

      const content =
        response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(
          "Mistral returned an empty response"
        );
      }

      if (typeof content === "string") {
        return content;
      }

      throw new Error(
        "Mistral returned an unexpected response format"
      );
    }
  };
}