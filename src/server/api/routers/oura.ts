import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { 
  personalInfoRequestSchema, 
  personalInfoResponseSchema,
} from "~/lib/validations/oura";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ouraRouter = createTRPCRouter({
  getPersonalInfo: publicProcedure
    .input(personalInfoRequestSchema)
    .output(personalInfoResponseSchema)
    .mutation(async ({ input }) => {
      const token = input.token ?? env.OURA_PAT;

      if (!token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Personal Access Token is required",
        });
      }

      try {
        const response = await fetch(
          "https://api.ouraring.com/v2/usercollection/personal_info",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid Personal Access Token",
            });
          }
          
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Oura API error: ${response.status}`,
          });
        }

        const data: unknown = await response.json();
        
        // Validate response data - tRPC will handle Zod errors automatically
        const validatedData = personalInfoResponseSchema.parse(data);
        return validatedData;
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unexpected errors
        console.error("Error fetching Oura personal info:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch personal info from Oura API",
        });
      }
    }),
}); 