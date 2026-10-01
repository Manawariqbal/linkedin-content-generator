import { z } from "zod";

export const ProfileAnalysisSchema = z.object({
  seniority: z.string(),
  industry: z.string(),
  expertise: z.array(z.string()),
  targetAudience: z.array(z.string()),
  contentThemes: z.array(z.string()),
  tone: z.array(z.string()),
  writingStyle: z.object({
    sentenceLength: z.string(),
    usesStories: z.boolean(),
    usesLists: z.boolean(),
    usesQuestions: z.boolean(),
    usesPersonalExperience: z.boolean()
  }),
  positioning: z.string()
});