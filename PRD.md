# 📄 Product Requirements Document (PRD): Pooly.AI Agentic Commerce Demo
**The Orchestration & Trust Layer for the Trillion-Dollar Agent Economy (2026)**
**Version: 10 (Demo build)**

## 1. Executive Vision (The VC Pitch)
By 2026, AI agents have evolved from read-only chatbots into autonomous economic actors. But traditional payment rails break when machines try to transact. **Pooly.AI** is the "Stripe for Agentic Commerce."

This demo showcases a fully autonomous, zero-human-in-the-loop transaction between an AI Agent and a 3rd-party vendor (Apify). Pooly.AI sits in the middle, seamlessly combining **x402 protocol monetization**, **cryptographic identity (ANS via GoDaddy/Cloudflare)**, **programmable wallets (Circle)**, and **trustless escrow (ERC-8183)** into a single, visually stunning SaaS orchestration layer.

---

## 2. The "Eye Candy" Design System
To win over enterprise clients and VCs, the demo cannot look like a standard crypto dApp. It must feel like enterprise-grade infrastructure—slick, secure, and magical.

* **Theme:** "Cyber-Corporate." Dark mode by default (Deep Space Black/Slate).
* **Visual Accents:** Neon cyan for success/verifications, electric purple for agentic actions, and smooth glassmorphism (frosted glass) for overlapping UI panels.
* **Typography:** *Inter* for clean dashboard readability; *Fira Code* (monospaced) for the execution terminal.
* **Animations (The Magic):**
  * **The Cryptographic Handshake:** When ANS verifies an agent, a glowing line connects the agent to a Cloudflare/GoDaddy shield icon.
  * **Smart Escrow Visualization:** When funds are locked via ERC-8183, a sleek 3D padlock animation appears over a spinning USDC coin. When the data is delivered, the padlock snaps open, and the coin flies to the merchant side.
  * **The Data Matrix:** API responses don't just appear; they cascade down the terminal in a rapid, Matrix-style reveal before formatting into a clean table.

---

## 3. The "Interactive Auto-Pilot" Demo Button
When presenting to VCs or clients, live typing and manual clicking can break the flow. To solve this, the top navigation bar will feature a prominent, glowing **"Initiate Autonomous Tour"** button.

When clicked, the UI enters **Demo Mode**:
1. **Screen Dimming (Spotlight Effect):** The background dims, and a spotlight highlights the specific UI component currently active.
2. **Ghost Typing:** The system simulates the developer typing in the ANS domain, adding the credit card, and writing the prompt.
3. **Step-by-Step Tooltips:** Floating, elegant tooltips appear next to the terminal logs explaining the invisible tech:
   * *Tooltip 1:* "Circle API instantly converting USD to USDC."
   * *Tooltip 2:* "x402 402-Payment-Required Intercepted."
   * *Tooltip 3:* "ERC-8183 Smart Escrow Locked. Zero counterparty risk."
4. **Speed Control:** The presenter can press `Spacebar` to pause the automation at any moment to answer audience questions, and press it again to resume.

---

## 4. The End-to-End User Journeys & UI Views

The demo is structured as a three-act play across three distinct dashboards.

### View 1: The Developer Orchestration Dashboard (Act I: Setup)
*The developer provisions the agent with identity, money, and boundaries.*
* **Identity Minting (ANS):** The user types `linkedin-scraper` into a domain-search input. A loading spinner activates, followed by a satisfying *DING*. The UI displays a cryptographic certificate: `linkedin-scraper.agent`. A **Cloudflare Verified** badge illuminates.
* **The Fiat On-Ramp:** The user clicks **"Top Up Agent Balance."** A standard credit card widget appears (simulating a Stripe/Click-to-Pay flow). The user inputs $50 USD.
  * *Visual:* A seamless transition graphic shows $50 USD entering a funnel, and **50.00 USDC** popping out into the "Agent Programmable Wallet" balance. No private keys are shown.
* **Setting the Guardrails:** A nodal, drag-and-drop interface (or clean toggle list) where users set limits:
  * *Max Spend:* $10 / Day.
  * *Allowed Vendors:* `*.apify.com/*`
  * *Behavior:* "Auto-escrow via ERC-8183."

### View 2: The Execution Terminal (Act II: Showtime)
*The VC/Client watches the agent act autonomously in a split-screen view.*
* **Left Pane (The Intent):** A chat box where the user types: *"Find 5 Machine Learning engineers in Tel Aviv using Apify."*
* **Right Pane (The Live Ledger):** A Hacker-style terminal outputting the agent's network requests in real-time, heavily color-coded:
  ```text
  [11:05:01] 🤖 Agent computing plan... Target: Apify API.
  [11:05:02] 🌐 HTTP GET /v2/linkedin-scraper
  [11:05:02] 🔴 402 Payment Required received. Price: 0.50 USDC.
  [11:05:03] 🛡️ Validating ANS Identity... SUCCESS (linkedin-scraper.agent)
  [11:05:03] 💸 Guardrail Check: 0.50 USDC < $10.00 limit. APPROVED.
  [11:05:04] 🔗 ERC-8183 Escrow: Locking funds...
  [11:05:05] 🌐 Re-sending HTTP GET with x402 Payment-Signature...
  [11:05:08] 📥 Data received (5 records). ZK-Verifier confirms payload.
  [11:05:09] ✅ Escrow Released to Vendor.
  ```
  *(A 3D padlock animation snaps open in the center of the screen).*

### View 3: The Merchant Off-Ramp Portal (Act III: The Vendor)
*Apify's dashboard, showing revenue collection.*
* **Agentic Traffic Graph:** A line chart showing revenue separated by "Human Traffic" vs "Agent Traffic (x402)".
* **Revenue Table:** Shows line items of incoming payments: `+0.50 USDC | Buyer: linkedin-scraper.agent | Protocol: x402`.
* **The Fiat Off-Ramp:** The merchant clicks a massive, pulsing **"Withdraw to Bank"** button. A modal confirms: "Converting 0.50 USDC to $0.50 USD via Circle CPN." A success confetti animation fires as the funds are "routed" to a legacy Chase bank account.

---

## 5. Technical Architecture

**Stack (latest versions, no backward-compat):**
* **Frontend:** Next.js 16 (App Router, Turbopack) on Vercel.
* **Styling & UI:** Tailwind CSS v4 + Shadcn UI + Framer Motion (for smooth escrow and crypto animations).
* **Database:** Neon serverless Postgres (Vercel's current Postgres offering) via `@neondatabase/serverless` + Drizzle ORM. Stores agent configs, guardrail rules, transaction history.
* **Authentication:** NextAuth.js with GitHub provider.
* **Blockchain Infrastructure:**
  * Network: Base Sepolia testnet (free gas).
  * Wallets & Escrow: Circle Programmable Wallets (Developer Sandbox) to mint testnet USDC.
  * Contract access via `viem` + `wagmi`.
* **The x402 Facilitator (Middleware):** Implemented as a Next.js Route Handler at `/api/proxy`. This acts as the middleware that intercepts the 402 error, checks Neon Postgres guardrails, locks the testnet escrow, and retries the request with the cryptographic receipt.
* **Mock Vendor:** A `mock-apify` route handler at `/api/mock-apify` that throws the initial 402 error and returns dummy JSON data upon successful receipt validation.

---

## 6. The Pitch Presentation Script (How to sell it)

When using the "Auto-Pilot Demo Button," follow these verbal beats:

* **The Hook (Empty Terminal):** "Right now, your AI agent is financially paralyzed. If it hits a paywall, it stops. If you give it your corporate credit card, it might spend $50,000 on AWS in a night. We are solving the trust gap."
* **The Setup (Dashboard):** "Watch as we mint an identity so the internet knows who this bot is. We give it $50 in fiat, instantly converted to USDC. But critically, we put a hard leash on it: maximum $10 a day. Enterprise risk teams love this."
* **The Climax (Terminal Scrolling):** "The agent tries to scrape LinkedIn via Apify. Apify throws an HTTP 402 Payment Required. No human steps in. Pooly catches the 402, verifies the guardrails, locks the micro-payment in a trustless escrow, and gets the data. The machine just paid the machine."
* **The Close (Merchant Portal):** "And for the merchants? They don't need to understand crypto. They just see a dashboard with their earnings, click a button, and USD lands in their Chase account. Pooly is the invisible tollbooth for the trillion-dollar agent economy."

---

## 7. Deployment Checklist
* [x] Create Next.js app and push to GitHub.
* [ ] Deploy to Vercel (enable Auto-CI/CD).
* [ ] Provision Neon Postgres database via Vercel integration.
* [ ] Setup Circle Developer Sandbox account (generate API keys for programmable wallets).
* [ ] Build the three UI Views (Developer, Terminal, Vendor).
* [ ] Implement the `Auto-Pilot Mode` React Context (to manage the automated demo state and animations).
* [ ] Write the `/api/proxy` Next.js route handler to execute the x402 handshake and ERC-8183 escrow flow.
