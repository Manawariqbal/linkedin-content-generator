const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/content";


async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "Something went wrong"
    );
  }

  return data;
}


export async function generateContent(
  payload
) {
  const response = await fetch(
    `${API_BASE_URL}/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  return handleResponse(response);
}


export async function generateBatchContent(
  payload
) {
  const response = await fetch(
    `${API_BASE_URL}/generate-batch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  return handleResponse(response);
}