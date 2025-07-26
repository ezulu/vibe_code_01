# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack application built with Next.js 15, TypeScript, tRPC, Prisma, NextAuth.js, and Tailwind CSS. The project follows the T3 Stack conventions and architecture patterns.

## Commands

### Development
- `npm run dev` - Start development server with Turbo
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run typecheck` - Run TypeScript type checking
- `npm run check` - Run both linting and type checking
- `npm run format:check` - Check code formatting with Prettier
- `npm run format:write` - Format code with Prettier

### Database
- `npm run db:generate` - Generate Prisma client and run migrations
- `npm run db:migrate` - Deploy database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Architecture

### tRPC API Structure
- **Root Router**: `src/server/api/root.ts` - Central router configuration
- **API Routers**: `src/server/api/routers/` - Feature-specific tRPC routers
- **tRPC Setup**: `src/server/api/trpc.ts` - tRPC configuration with context, middleware, and procedures
- **Client Setup**: `src/trpc/react.tsx` - tRPC React Query integration

### Authentication
- **NextAuth Config**: `src/server/auth/config.ts` - Authentication providers and callbacks
- **Auth Entry**: `src/server/auth/index.ts` - Main auth export
- Currently configured with Discord provider

### Database
- **Prisma Schema**: `prisma/schema.prisma` - Database schema with SQLite
- **Database Client**: `src/server/db.ts` - Prisma client configuration
- Models: User, Account, Session, VerificationToken (NextAuth), Post

### Environment Variables
- **Environment Config**: `src/env.js` - Type-safe environment variable validation using @t3-oss/env-nextjs
- Required variables: `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `DATABASE_URL`

### Frontend Structure
- **App Router**: `src/app/` - Next.js 15 App Router structure
- **Components**: `src/app/_components/` - Shared React components
- **API Routes**: `src/app/api/` - Next.js API routes for tRPC and NextAuth
- **Styling**: `src/styles/globals.css` - Global Tailwind CSS styles

### Key Patterns
- tRPC procedures use `publicProcedure` for unauthenticated endpoints and `protectedProcedure` for authenticated ones
- Database operations go through Prisma ORM with type safety
- Client-side tRPC calls use React Query for caching and state management
- Environment variables are validated at build time using Zod schemas

## tRPC Implementation Guidelines

### Creating New tRPC Routers

1. **Create Router File**: Add new routers in `src/server/api/routers/[feature].ts`
2. **Import in Root**: Add the router to `src/server/api/root.ts`
3. **Use Proper Procedures**: Choose between `publicProcedure` and `protectedProcedure`
4. **Add Input/Output Validation**: Use Zod schemas for type safety

### Example tRPC Router Structure

```typescript
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const featureRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ data: z.string() }))
    .query(async ({ input }) => {
      // Implementation
    }),

  createData: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),
});
```

### Frontend tRPC Usage

```typescript
// In React components
const { data, isLoading, error } = api.feature.getData.useQuery({ id: "123" });

const mutation = api.feature.createData.useMutation({
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

### Error Handling Best Practices

- Use `TRPCError` for structured error responses
- Let tRPC handle Zod validation errors automatically
- Use appropriate error codes: `UNAUTHORIZED`, `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`, etc.
- Log errors for debugging while providing user-friendly messages

### DON'T Use Next.js API Routes

- **Avoid**: Creating manual API routes in `src/app/api/` for business logic
- **Exception**: Only use for webhooks, authentication callbacks, or third-party integrations that require specific endpoints
- **Instead**: Use tRPC procedures for all internal API communication