import { z } from "zod";

// Request validation schema
export const personalInfoRequestSchema = z.object({
  token: z.string().min(1, "Personal Access Token is required"),
});

// Response validation schema based on Oura API documentation
export const personalInfoResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  biological_sex: z.enum(["male", "female"]).optional(),
  date_of_birth: z.string().optional(),
});

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
});

// Type exports
export type PersonalInfoRequest = z.infer<typeof personalInfoRequestSchema>;
export type PersonalInfoResponse = z.infer<typeof personalInfoResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;