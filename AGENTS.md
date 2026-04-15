@CLAUDE.md

<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 — breaking changes from prior versions

This project uses Next.js 16.2.3 with Turbopack. APIs, conventions, and file structure
may differ from training data. Key changes relevant to this project:

- App Router only — no `pages/` directory
- `"use client"` required for any component using hooks, event handlers, or browser APIs
- Server Components are the default — keep them for static/data-fetching work
- Route handlers at `app/api/*/route.ts` replace `pages/api/*.ts`
- `import "server-only"` prevents a module from being imported in client components
- `next/font/google` is the correct font import path
- Metadata is exported as `export const metadata` or `export async function generateMetadata`
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-agent-rules -->
# Project-specific rules for agents

## Scope
- **Do not implement Phase 3** (real Circle/Neon/blockchain integrations) unless the user
  explicitly says "implement Phase 3" and has confirmed credentials are in `.env.local`.
- The stubs in `lib/circle.ts`, `lib/escrow.ts` throw intentionally. Leave them as-is.

## Theme
- Light theme only. Never add `dark:` variants or toggle dark mode.
- The `terminal-panel` CSS class is intentionally dark — it's a design element, not a theme.

## Copy
- Do not use "Stripe for Agentic Commerce" anywhere. The tagline is "Agentic payments".

## Animations
- All animations use Framer Motion (`framer-motion` package, `motion.*` components).
- Do not introduce CSS-only animations for complex sequences — use `motion.div` with variants.

## State
- Demo automation state lives in `AutoPilotContext`. Use `useAutoPilot()` to read/write it.
- Do not introduce a new global state library (Redux, Zustand, etc.).

## Database
- Use `@neondatabase/serverless` with Drizzle ORM. Never use `@vercel/postgres` (deprecated).
- `db` in `lib/db/index.ts` may be `null` when `DATABASE_URL` is unset — always null-check.

## Build gate
- `npm run build` must pass with zero TypeScript errors before any commit.

## Versioning & releases — CONSTANT RULE
- **Never `git push origin main` directly.** Always use a release script.
- Regular production push (new feature, improvement): `npm run deploy` → bumps minor (0.x → 0.x+1)
- Big change (new section, major rework): `npm run deploy:major` → bumps major (x → x+1)
- Hotfix / docs / config only: `npm run deploy:patch` → bumps patch (0.0.x → 0.0.x+1)
- The pre-push hook will block a bare `git push` to main if no version bump is present.
- All release scripts run `npm run build` first — deployment never happens on a broken build.
<!-- END:project-agent-rules -->
