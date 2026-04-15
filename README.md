# Pooly.AI ver 10 — Agentic Payments Demo

**The orchestration and trust layer for the trillion-dollar agent economy.**

A fully interactive demo showing end-to-end autonomous agent micro-transactions: an AI agent hits an HTTP 402, negotiates payment via x402, locks USDC in ERC-8183 trustless escrow, retrieves data, and releases funds to the vendor — with zero human involvement after the initial intent is set.

**Live demo:** https://pooly-ai-v10.vercel.app  
**GitHub:** https://github.com/danielrojansky/pooly-ai-v10

---

## The Three-Act Structure

| Route | Act | What it shows |
|---|---|---|
| `/flow` | End-to-End | 5-step wizard: wallet → guardrails → intent → 402 → result. Best for live pitches. |
| `/developer` | Act I | ANS identity minting, Circle fiat on-ramp, ERC-8183 guardrail editor |
| `/terminal` | Act II | Split-pane x402 execution log with Matrix data cascade and 3D escrow padlock animation |
| `/merchant` | Act III | Recharts agentic traffic graph, revenue table, Circle CPN withdrawal + confetti |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Shadcn UI v4 |
| Animations | Framer Motion v12 |
| Charts | Recharts v3 |
| Database | Neon serverless Postgres + Drizzle ORM |
| Auth | NextAuth.js v4 (GitHub provider) |
| Payments | Circle Programmable Wallets (Developer Sandbox) |
| Blockchain | Base Sepolia testnet via viem + wagmi |
| Protocol | x402 (HTTP micropayment) + ERC-8183 (trustless escrow) |
| Deployment | Vercel (auto-deploys from `main`) |

---

## Project Structure

```
pooly-ai-v10/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Nav with "Initiate Autonomous Tour" button
│   │   ├── flow/page.tsx         # End-to-end 5-step pitch wizard
│   │   ├── developer/page.tsx    # Act I
│   │   ├── terminal/page.tsx     # Act II
│   │   └── merchant/page.tsx     # Act III
│   ├── api/
│   │   ├── proxy/route.ts        # x402 facilitator (Phase 3)
│   │   ├── mock-apify/route.ts   # 402-throwing mock vendor (Phase 3)
│   │   ├── wallet/route.ts       # Circle wallet handlers (Phase 3)
│   │   └── auth/[...nextauth]/   # NextAuth GitHub (Phase 3)
│   ├── globals.css               # Light Cyber-Corporate theme
│   ├── layout.tsx                # Root layout: Inter + Fira Code fonts, AutoPilotProvider
│   └── page.tsx                  # Landing page
├── components/
│   ├── animations/
│   │   ├── CryptoHandshake.tsx   # ANS glow-line + Cloudflare verified badge
│   │   ├── EscrowPadlock.tsx     # Full-screen padlock lock/open overlay
│   │   └── FiatToUSDC.tsx        # USD → USDC funnel animation
│   ├── autopilot/
│   │   └── AutoPilotButton.tsx   # "Initiate Autonomous Tour" nav button
│   └── views/
│       ├── DeveloperView.tsx     # Act I full view
│       ├── FlowView.tsx          # End-to-end 5-step wizard
│       ├── MerchantView.tsx      # Act III full view
│       └── TerminalView.tsx      # Act II full view
├── contexts/
│   └── AutoPilotContext.tsx      # Demo Mode state machine (Spacebar pause/resume)
├── lib/
│   ├── circle.ts                 # Circle SDK wrapper (stubs — Phase 3)
│   ├── escrow.ts                 # ERC-8183 contract client via viem (stubs — Phase 3)
│   ├── guardrails.ts             # Spend-limit evaluation (implemented)
│   ├── x402.ts                   # 402 interceptor + signature helpers (implemented)
│   └── db/
│       ├── index.ts              # Neon Postgres + Drizzle client
│       └── schema.ts             # agents, guardrails, transactions, merchants tables
└── PRD.md                        # Full product requirements document
```

---

## Running Locally

```bash
git clone https://github.com/danielrojansky/pooly-ai-v10
cd pooly-ai-v10
npm install
npm run dev
```

Open http://localhost:3000. The demo is fully functional without any credentials — all integrations are simulated in the UI. See Phase 3 below for wiring real services.

---

## Environment Variables (Phase 3)

Copy `.env.local.example` to `.env.local` and populate before enabling real integrations:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=          # openssl rand -base64 32
GITHUB_ID=                # github.com/settings/developers → OAuth App
GITHUB_SECRET=

# Neon Postgres (vercel env pull fills these automatically)
DATABASE_URL=             # neon connection string

# Circle Developer Sandbox
CIRCLE_API_KEY=
CIRCLE_ENTITY_SECRET=

# Base Sepolia
BASE_SEPOLIA_RPC_URL=     # Alchemy or public RPC
ESCROW_CONTRACT_ADDRESS=  # deployed ERC-8183 contract
ESCROW_DEPLOYER_PRIVATE_KEY=   # testnet-only key
```

---

## Demo Flow (The Pitch)

Navigate to `/flow` for the recommended single-page pitch experience:

1. **Create Wallet** — mint `linkedin-scraper.agent` ANS identity + seed with 50 USDC
2. **Set Guardrails** — cap at $10/day, allow-list `*.apify.com/*`, auto-escrow mode
3. **Submit Intent** — "Find 5 ML engineers in Tel Aviv using Apify." Last human action.
4. **402 → Escrow** — live terminal: agent intercepts 402, locks 0.50 USDC in ERC-8183 escrow, retries with x402 signature
5. **Result Delivered** — 5 records returned, ZK proof verified, escrow released, receipt shown

**Presenter tip:** press `Spacebar` at any point to pause the Auto-Pilot tour and answer audience questions. Press again to resume.

---

## The Pitch in One Sentence

> "The machine just paid the machine. No card, no checkout, no human. Pooly is the invisible tollbooth for the trillion-dollar agent economy."

---

## Deployment

Every push to `main` auto-deploys to Vercel via the connected GitHub integration.

```bash
# Manual prod deploy
vercel --prod --scope danielrojansky-8273s-projects
```

---

## Roadmap

- **Phase 3** — Wire real integrations: NextAuth GitHub login, Neon Postgres persistence, Circle sandbox wallets, ERC-8183 on Base Sepolia
- **Phase 4** — Playwright E2E tests, Playwright-based auto-pilot verification, performance polish
- **Phase 5** — Multi-agent swarm demo (several agents coordinating a single task with shared escrow)
