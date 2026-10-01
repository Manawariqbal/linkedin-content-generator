import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function generateContent(linkedinUrl) {
  const response = await api.post(
    "/content/generate",
    { linkedinUrl }
  );

  return response.data;
}