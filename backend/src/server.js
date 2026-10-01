import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { generateWithLLM } from "./services/llmService.js";
import { analyzeProfile } from "./services/profileAnalyzer.js";
import { createContentStrategy } from "./services/contentStrategy.js";
import { generatePosts } from "./services/postGenerator.js";

import contentRoutes from "./routes/contentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "LinkedIn Content Generator API is running"
  });
});

app.get("/test-llm", async (req, res) => {
  try {
    const result = await generateWithLLM(
      "Reply with exactly: LLM connection successful"
    );

    res.json({
      success: true,
      response: result
    });
  } catch (error) {
    console.error("LLM test error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/test-profile-analysis", async (req, res) => {
  try {
    const analysis = await analyzeProfile(req.body);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Profile analysis error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/test-content-strategy", async (req, res) => {
  try {
    const { profile, profileAnalysis } = req.body;

    if (!profile) {
      return res.status(400).json({
        success: false,
        error: "Profile is required"
      });
    }

    if (!profileAnalysis) {
      return res.status(400).json({
        success: false,
        error: "Profile analysis is required"
      });
    }

    const strategy = await createContentStrategy(
      profile,
      profileAnalysis
    );

    res.json({
      success: true,
      strategy
    });
  } catch (error) {
    console.error("Content strategy error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/test-post-generation", async (req, res) => {
  try {
    const {
      profile,
      profileAnalysis,
      contentStrategy
    } = req.body;

    if (!profile) {
      return res.status(400).json({
        success: false,
        error: "Profile is required"
      });
    }

    if (!profileAnalysis) {
      return res.status(400).json({
        success: false,
        error: "Profile analysis is required"
      });
    }

    if (!contentStrategy) {
      return res.status(400).json({
        success: false,
        error: "Content strategy is required"
      });
    }

    const result = await generatePosts(
      profile,
      profileAnalysis,
      contentStrategy
    );

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error("Post generation error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use("/api/content", contentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});