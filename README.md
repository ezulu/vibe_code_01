# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## tRPC Implementation Guide

This project uses tRPC for type-safe API communication. Here's how to properly implement new API endpoints:

### Creating New tRPC Procedures

1. **Create a new router** in `src/server/api/routers/[feature].ts`
2. **Add the router** to `src/server/api/root.ts`
3. **Use the API** in your React components via the tRPC hooks

### Example Implementation

```typescript
// 1. Create router: src/server/api/routers/example.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: "Example" };
    }),
});

// 2. Add to root router: src/server/api/root.ts
export const appRouter = createTRPCRouter({
  post: postRouter,
  example: exampleRouter, // Add this line
});

// 3. Use in components:
const { data } = api.example.getById.useQuery({ id: "123" });
```

### Best Practices

- ✅ Use tRPC procedures for all internal API communication
- ✅ Add proper Zod validation for inputs and outputs
- ✅ Use `publicProcedure` for unauthenticated endpoints
- ✅ Use `protectedProcedure` for authenticated endpoints
- ❌ Avoid creating manual Next.js API routes for business logic
- ❌ Only use `/api` routes for webhooks or third-party integrations

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
