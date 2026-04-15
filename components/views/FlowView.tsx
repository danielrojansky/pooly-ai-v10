"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * End-to-end agentic payments flow — single page that walks a user through:
 *   Step 1: Create wallet (Circle USDC mint)
 *   Step 2: Set guardrails (spend cap, vendor allow-list)
 *   Step 3: Submit agent intent
 *   Step 4: Agent hits 402, escrow locks
 *   Step 5: Data delivered, escrow released, vendor paid
 *
 * Designed for live demos: each step auto-advances OR the user can click through.
 */

const STEPS = [
  { id: 1, label: "Create Wallet", icon: "💳", color: "#0099cc" },
  { id: 2, label: "Set Guardrails", icon: "🛡️", color: "#7c3aed" },
  { id: 3, label: "Submit Intent", icon: "🤖", color: "#d97706" },
  { id: 4, label: "402 → Escrow", icon: "🔒", color: "#dc2626" },
  { id: 5, label: "Result Delivered", icon: "✅", color: "#059669" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WalletState {
  domain: string;
  balance: string;
  address: string;
}

interface GuardrailState {
  maxDay: number;
  vendor: string;
}

const LOG_LINES = [
  { delay: 0,    icon: "🤖", color: "text-slate-300", text: "Agent computing plan… Target: Apify API." },
  { delay: 800,  icon: "🌐", color: "text-sky-300",   text: "HTTP GET /v2/linkedin-scraper?count=5&location=Tel+Aviv" },
  { delay: 600,  icon: "🔴", color: "text-red-400",   text: "402 Payment Required. Price: 0.50 USDC." },
  { delay: 700,  icon: "🛡️", color: "text-emerald-400", text: "ANS Identity validated. SUCCESS (linkedin-scraper.agent)" },
  { delay: 500,  icon: "💸", color: "text-yellow-300", text: "Guardrail check: 0.50 USDC < $10.00 limit. APPROVED." },
  { delay: 900,  icon: "🔗", color: "text-violet-400", text: "ERC-8183 Escrow locked — 0.50 USDC." },
  { delay: 1200, icon: "🌐", color: "text-sky-300",   text: "Retry HTTP GET with x402 Payment-Signature header." },
  { delay: 1000, icon: "📥", color: "text-emerald-400", text: "Data received (5 records). ZK-Verifier confirms payload." },
  { delay: 600,  icon: "✅", color: "text-emerald-300", text: "Escrow released to vendor. 0.50 USDC → apify.com." },
];

const MOCK_RESULTS = [
  { name: "Yael Cohen",    title: "ML Engineer",              company: "Wix" },
  { name: "Ido Ben-David", title: "Senior ML Engineer",       company: "Mobileye" },
  { name: "Noa Shapira",   title: "AI/ML Lead",               company: "Monday.com" },
  { name: "Ariel Levi",    title: "ML Research Engineer",     company: "Meta TLV" },
  { name: "Tamar Goldberg",title: "Applied ML Engineer",      company: "Google TLV" },
];

export function FlowView() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  // Step 1
  const [domain, setDomain] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletState | null>(null);

  // Step 2
  const [maxDay, setMaxDay] = useState(10);
  const [vendor, setVendor] = useState("*.apify.com/*");
  const [guardrailsDone, setGuardrailsDone] = useState(false);

  // Step 3
  const [intent, setIntent] = useState("");

  // Step 4
  const [logs, setLogs] = useState<string[]>([]);
  const [escrowLocked, setEscrowLocked] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);
  const [running, setRunning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Step 5
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const completeStep = (id: StepId) => {
    setCompletedSteps((prev) => new Set([...prev, id]));
    if (id < 5) setCurrentStep((id + 1) as StepId);
  };

  const handleCreateWallet = async () => {
    if (!domain.trim()) return;
    setWalletLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setWallet({
      domain: domain.trim(),
      balance: "50.00",
      address: "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "…",
    });
    setWalletLoading(false);
    completeStep(1);
  };

  const handleSaveGuardrails = () => {
    setGuardrailsDone(true);
    completeStep(2);
  };

  const handleRunAgent = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setEscrowLocked(false);
    setEscrowReleased(false);
    setResults(null);
    completeStep(3);

    let accumulated = 0;
    for (let i = 0; i < LOG_LINES.length; i++) {
      accumulated += LOG_LINES[i].delay;
      await new Promise((r) => setTimeout(r, LOG_LINES[i].delay));
      const { icon, text } = LOG_LINES[i];
      setLogs((prev) => [...prev, `${icon} ${text}`]);
      if (i === 5) setEscrowLocked(true);
      if (i === 7) {
        setEscrowLocked(false);
        setEscrowReleased(true);
        completeStep(4);
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    setResults(MOCK_RESULTS);
    setRunning(false);
    completeStep(5);
  }, [running]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0099cc]/20 bg-[#0099cc]/5 px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0099cc]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#0099cc]">
            End-to-End Flow
          </span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Agentic Payments, start to finish
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          From wallet creation to paid result — the complete lifecycle of an autonomous agent
          micro-transaction. No humans in the loop after step 3.
        </p>
      </div>

      {/* Step progress */}
      <div className="mb-10 flex items-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className="flex flex-col items-center gap-1.5 transition-opacity"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all ${
                  completedSteps.has(step.id)
                    ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                    : currentStep === step.id
                    ? "border-[#0099cc] bg-[#0099cc]/5 shadow-md"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
                style={currentStep === step.id ? { borderColor: step.color } : {}}
              >
                {completedSteps.has(step.id) ? "✓" : step.icon}
              </div>
              <span
                className={`text-center font-mono text-[9px] uppercase tracking-widest ${
                  currentStep === step.id ? "font-bold text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-[2px] flex-1 rounded-full transition-all duration-500 ${
                  completedSteps.has(step.id) ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        {/* ── Step 1: Create Wallet ── */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-panel p-8"
          >
            <StepHeader step={1} icon="💳" color="#0099cc" title="Create Agent Wallet" />
            <p className="mb-6 text-slate-500">
              Every agent needs a programmable wallet funded with USDC before it can transact
              autonomously. We mint an ANS identity (<code className="font-mono text-sm text-[#0099cc]">{domain || "your-agent"}.agent</code>) and seed a Circle programmable wallet with $50 USDC.
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !walletLoading && handleCreateWallet()}
                  placeholder="linkedin-scraper"
                  disabled={!!wallet}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0099cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0099cc]/15 disabled:opacity-60"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">.agent</span>
              </div>
              <button
                type="button"
                onClick={handleCreateWallet}
                disabled={walletLoading || !!wallet || !domain.trim()}
                className="rounded-xl bg-[#0099cc] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0088bb] disabled:opacity-50"
              >
                {walletLoading ? <Spinner /> : wallet ? "✓ Done" : "Create Wallet"}
              </button>
            </div>

            <AnimatePresence>
              {wallet && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 grid grid-cols-3 gap-4"
                >
                  <WalletCard label="Identity" value={`${wallet.domain}.agent`} color="text-[#0099cc]" />
                  <WalletCard label="Balance" value={`${wallet.balance} USDC`} color="text-emerald-600" />
                  <WalletCard label="Address" value={wallet.address} color="text-slate-500" />
                </motion.div>
              )}
            </AnimatePresence>

            {wallet && (
              <div className="mt-6 flex justify-end">
                <NextButton onClick={() => completeStep(1)} />
              </div>
            )}
          </motion.div>
        )}

        {/* ── Step 2: Guardrails ── */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-panel p-8"
          >
            <StepHeader step={2} icon="🛡️" color="#7c3aed" title="Set Spending Guardrails" />
            <p className="mb-6 text-slate-500">
              Before the agent touches the internet, lock it down. These rules are enforced
              cryptographically via ERC-8183 — the agent literally cannot exceed them.
            </p>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Max Spend / Day</label>
                  <span className="font-mono text-sm font-bold text-slate-900">${maxDay}.00 USDC</span>
                </div>
                <input
                  type="range" min={1} max={100} value={maxDay}
                  onChange={(e) => setMaxDay(Number(e.target.value))}
                  disabled={guardrailsDone}
                  className="w-full accent-[#7c3aed]"
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-slate-400">Allowed Vendor Pattern</label>
                <input
                  type="text" value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  disabled={guardrailsDone}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 focus:border-[#7c3aed]/50 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/15 disabled:opacity-60"
                />
                <p className="mt-1 font-mono text-[10px] text-slate-400">Glob · agent will reject any vendor not on this list</p>
              </div>

              <div className="rounded-xl bg-violet-50 p-4">
                <p className="font-mono text-[11px] text-slate-600">
                  <span className="font-semibold text-[#7c3aed]">Active policy:</span>{" "}
                  max ${maxDay} USDC/day · vendor: {vendor} · behavior: ERC-8183 auto-escrow
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveGuardrails}
                disabled={guardrailsDone}
                className="rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] disabled:opacity-50"
              >
                {guardrailsDone ? "✓ Guardrails Saved" : "Save & Continue"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Submit Intent ── */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-panel p-8"
          >
            <StepHeader step={3} icon="🤖" color="#d97706" title="Submit Agent Intent" />
            <p className="mb-6 text-slate-500">
              This is the last human action. The agent receives your intent, computes a plan,
              and executes autonomously from here — including paying for the data it needs.
            </p>

            <textarea
              rows={3}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Find 5 Machine Learning engineers in Tel Aviv using Apify."
              disabled={running || completedSteps.has(3)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/15 disabled:opacity-60"
            />

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-mono text-[11px] text-amber-700">
                <span className="font-semibold">After this step:</span> no human action needed.
                The agent will negotiate, pay, and deliver the result autonomously.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleRunAgent}
                disabled={running || completedSteps.has(3)}
                className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {running ? <span className="flex items-center gap-2"><Spinner />Running…</span> : completedSteps.has(3) ? "✓ Agent Running" : "Launch Agent →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: 402 → Escrow ── */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-panel overflow-hidden"
          >
            <div className="border-b border-slate-100 p-8">
              <StepHeader step={4} icon="🔒" color="#dc2626" title="Agent Handles the 402" />
              <p className="text-slate-500">
                Apify responds with HTTP 402. Pooly intercepts, validates guardrails, locks
                0.50 USDC in escrow, and retries with a cryptographic payment signature —
                all automatically.
              </p>
            </div>

            {/* Terminal */}
            <div className="terminal-panel min-h-[280px] rounded-none p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  {wallet?.domain ?? "agent"}.agent · x402 execution log
                </span>
                {running && (
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-auto h-2 w-2 rounded-full bg-emerald-400"
                  />
                )}
              </div>
              <div className="space-y-1.5">
                {logs.length === 0 && (
                  <p className="font-mono text-sm text-slate-500">Waiting for agent…</p>
                )}
                {logs.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-sm text-slate-200"
                  >
                    {line}
                  </motion.div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Escrow status bar */}
            <div className="border-t border-slate-100 p-6">
              <div className="flex items-center gap-6">
                <EscrowBadge locked={escrowLocked} released={escrowReleased} />
                {escrowReleased && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[11px] text-emerald-600"
                  >
                    0.50 USDC released to apify.com · guardrails enforced throughout
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 5: Result Delivered ── */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-panel p-8"
          >
            <StepHeader step={5} icon="✅" color="#059669" title="Result Delivered" />
            <p className="mb-6 text-slate-500">
              5 records returned. ZK proof confirms payload integrity. Escrow released. The
              agent paid for the data it needed — without a human ever touching a wallet.
            </p>

            {/* Transaction receipt */}
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-emerald-600">
                Transaction Receipt
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Buyer",    value: `${wallet?.domain ?? "agent"}.agent` },
                  { label: "Vendor",   value: "apify.com" },
                  { label: "Amount",   value: "0.50 USDC" },
                  { label: "Protocol", value: "x402 + ERC-8183" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-600">{item.label}</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results table */}
            {results && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Name</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Title</th>
                      <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <motion.tr
                        key={r.name}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-4 py-2.5 font-semibold text-slate-900">{r.name}</td>
                        <td className="px-4 py-2.5 text-slate-500">{r.title}</td>
                        <td className="px-4 py-2.5 font-mono text-sm text-[#0099cc]">{r.company}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-slate-50 px-4 py-2.5">
                  <p className="font-mono text-[10px] text-emerald-600">
                    ✓ 5 records · ZK proof verified · cost: 0.50 USDC · remaining budget: ${(maxDay - 0.5).toFixed(2)} USDC today
                  </p>
                </div>
              </motion.div>
            )}

            {!results && (
              <p className="font-mono text-sm text-slate-400">
                Complete steps 3–4 first to see results here.
              </p>
            )}

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">The pitch in one sentence</p>
              <p className="text-slate-700 font-medium leading-relaxed">
                "The machine just paid the machine. No card, no checkout, no human.
                Pooly is the invisible tollbooth for the trillion-dollar agent economy."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setCurrentStep(step.id)}
            className={`h-2 rounded-full transition-all ${
              currentStep === step.id ? "w-6 bg-[#0099cc]" : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Small helpers ── */

function StepHeader({ step, icon, color, title }: { step: number; icon: string; color: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-xl"
        style={{ background: color + "14" }}
      >
        {icon}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Step {step}</p>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
  );
}

function WalletCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 font-mono text-sm font-semibold truncate ${color}`}>{value}</p>
    </div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
    >
      Continue
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
    />
  );
}

function EscrowBadge({ locked, released }: { locked: boolean; released: boolean }) {
  if (released) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2"
      >
        <span className="text-lg">🔓</span>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700">Escrow Released</p>
          <p className="font-mono text-[9px] text-emerald-500">0.50 USDC → vendor</p>
        </div>
      </motion.div>
    );
  }
  if (locked) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-lg"
        >
          🔒
        </motion.span>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-violet-700">ERC-8183 Locked</p>
          <p className="font-mono text-[9px] text-violet-500">0.50 USDC · zero counterparty risk</p>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2">
      <span className="text-lg text-slate-400">🔓</span>
      <p className="font-mono text-[10px] text-slate-400">Escrow idle</p>
    </div>
  );
}
