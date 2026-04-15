# Pooly.AI ver 10 — Claude Code Guide

## What this project is

A Next.js 16 demo app showing autonomous AI agent micro-payments via x402 + ERC-8183 escrow + Circle USDC. The UI is fully functional with simulated integrations. Real blockchain/Circle/Postgres integrations are stubbed and labelled "Phase 3".

## Current build status

- **Phase 1 ✅** — Scaffold, light theme, AutoPilot state machine, Drizzle schema, lib stubs
- **Phase 2 ✅** — All three views + End-to-End Flow page, Framer Motion animations, build clean
- **Phase 3 ⏳** — Real integrations (NextAuth, Neon, Circle sandbox, Base Sepolia) — NOT YET IMPLEMENTED. Credentials required first.

**Live:** https://pooly-ai-v10.vercel.app | **Repo:** https://github.com/danielrojansky/pooly-ai-v10

## Key architectural decisions

- **Single theme: light only.** No dark mode. The terminal panels (`terminal-panel` CSS class) are dark by design, not from a theme toggle.
- **No "Stripe for Agentic Commerce."** The tagline is **"Agentic payments"** — do not reintroduce the Stripe phrase.
- **`@neondatabase/serverless` not `@vercel/postgres`** — Vercel deprecated their Postgres package, migrated to Neon.
- **Stubs use `import "server-only"`** — lib modules (circle.ts, escrow.ts, x402.ts, db/index.ts) are server-only. Don't call them from client components. The `server-only` package is in dependencies (not devDependencies).
- **AutoPilotContext drives all demo automation** — steps are loaded via `useAutoPilot().load(steps)`. Spacebar pauses, Escape stops, arrow keys step.
- **All pages are static** (`○` in build output) — no server-side rendering currently. API routes will become dynamic when Phase 3 is wired.

## Files that are stubs (TODO Phase 3)

These export typed interfaces and throw "not implemented" errors:

- `lib/circle.ts` — `createAgentWallet`, `topUpWallet`, `getWalletBalance`, `withdrawToBank`
- `lib/escrow.ts` — `lockFunds`, `releaseToVendor`, `refundToAgent`, `getEscrowStatus`
- `lib/db/index.ts` — `db` will be `null` if `DATABASE_URL` is not set (safe in dev)

These are fully implemented:
- `lib/x402.ts` — `parsePaymentRequired`, `buildPaymentSignature` work; `signReceipt` is stubbed
- `lib/guardrails.ts` — `evaluateGuardrails` + `matchesVendorPattern` are fully implemented

## Coding conventions in this codebase

- All view components live in `components/views/`, animation components in `components/animations/`
- Pages are thin wrappers: `page.tsx` imports and renders the view component, nothing else
- Tailwind utilities: use `glass-panel` for frosted cards, `terminal-panel` for dark terminal areas, `glow-cyan` / `glow-purple` for neon accents
- Brand colors: cyan `#0099cc`, purple `#7c3aed`, green `#059669` — use these directly in JSX, not via arbitrary Tailwind classes
- Font: `font-sans` = Inter (body), `font-mono` = Fira Code (terminal, labels, tags)
- Do NOT use `dark:` Tailwind variants — there is no dark mode
- Label sub-headers with `font-mono text-[10px] uppercase tracking-widest text-slate-400`

## Running

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (must pass before pushing)
npm run lint    # eslint
```

## Before pushing

Always run `npm run build` and confirm it passes with zero TypeScript errors. The Vercel deployment will fail if it doesn't pass locally — Vercel uses the same `next build` command.
