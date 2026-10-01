import dotenv from "dotenv";

dotenv.config();

console.log("GROQ:", Boolean(process.env.GROQ_API_KEY));
console.log("GEMINI:", Boolean(process.env.GEMINI_API_KEY));
console.log("PROVIDER:", process.env.LLM_PROVIDER);
console.log("MODEL:", process.env.GROQ_MODEL);