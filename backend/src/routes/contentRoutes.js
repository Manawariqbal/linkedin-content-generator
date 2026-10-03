import express from "express";

import {
  generateContent,
  generateBatchContent
} from "../controllers/contentController.js";


const router = express.Router();


router.post(
  "/generate",
  generateContent
);


router.post(
  "/generate-batch",
  generateBatchContent
);


export default router;