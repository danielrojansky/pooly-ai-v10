"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoHandshake } from "@/components/animations/CryptoHandshake";
import { FiatToUSDC } from "@/components/animations/FiatToUSDC";

/* ── Act I: Developer Orchestration Dashboard ── */

type GuardrailMode = "escrow" | "pre-auth";

interface GuardrailState {
  maxSpendPerDay: number;
  allowedVendors: string;
  mode: GuardrailMode;
}

export function DeveloperView() {
  // ── ANS Identity panel ──
  const [domainInput, setDomainInput] = useState("");
  const [ansMinting, setAnsMinting] = useState(false);
  const [ansMinted, setAnsMinted] = useState(false);
  const [ansSuccess, setAnsSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMint = async () => {
    if (!domainInput.trim()) return;
    setAnsMinting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setAnsMinted(true);
    setAnsSuccess(domainInput.trim());
    setAnsMinting(false);
    // Play ding
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  // ── Circle top-up panel ──
  const [topUpAmount, setTopUpAmount] = useState("50");
  const [cardInput, setCardInput] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpDone, setTopUpDone] = useState(false);

  const handleTopUp = async () => {
    if (!cardInput.trim()) return;
    setTopUpLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setTopUpDone(true);
    setTopUpLoading(false);
  };

  // ── Guardrails panel ──
  const [guardrails, setGuardrails] = useState<GuardrailState>({
    maxSpendPerDay: 10,
    allowedVendors: "*.apify.com/*",
    mode: "escrow",
  });
  const [guardrailsSaved, setGuardrailsSaved] = useState(false);

  const handleSaveGuardrails = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setGuardrailsSaved(true);
    setTimeout(() => setGuardrailsSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0099cc]/20 bg-[#0099cc]/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0099cc]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#0099cc]">
            Act I · Orchestration
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Developer Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Provision your agent with a cryptographic identity, a programmable USDC wallet, and
          enterprise guardrails before it touches the internet.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* ── Panel 1: ANS Identity Minting ── */}
        <section id="panel-identity" className="glass-panel p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Step 1
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Identity Minting · ANS
              </h2>
            </div>
            <AnimatePresence>
              {ansMinted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700"
                >
                  Active
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Register a human-readable agent identity on the Agentic Name System (ANS), pinned
            to a Cloudflare-verified cryptographic certificate.
          </p>

          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="ans-domain-input"
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !ansMinting && handleMint()}
                placeholder="linkedin-scraper"
                disabled={ansMinted}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0099cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0099cc]/20 disabled:opacity-60"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                .agent
              </span>
            </div>
            <button
              type="button"
              onClick={handleMint}
              disabled={ansMinting || ansMinted || !domainInput.trim()}
              className="rounded-xl bg-[#0099cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0088bb] disabled:opacity-50"
            >
              {ansMinting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                  />
                  Minting
                </span>
              ) : ansMinted ? (
                "✓ Minted"
              ) : (
                "Mint"
              )}
            </button>
          </div>

          <CryptoHandshake active={ansMinted} agentDomain={ansSuccess} />
        </section>

        {/* ── Panel 2: Circle Fiat On-Ramp ── */}
        <section id="panel-topup" className="glass-panel p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Step 2
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Fiat On-Ramp · Circle
              </h2>
            </div>
            {topUpDone && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-[#0099cc]/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0099cc]"
              >
                Funded
              </motion.span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Load the agent's programmable wallet. USD → USDC via Circle's API. No private
            keys are ever shown.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Amount (USD)
              </label>
              <div className="flex gap-2">
                {[10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    disabled={topUpDone}
                    onClick={() => setTopUpAmount(String(amt))}
                    className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-all disabled:opacity-50 ${
                      topUpAmount === String(amt)
                        ? "border-[#0099cc] bg-[#0099cc]/8 text-[#0099cc]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Card Number (demo)
              </label>
              <input
                id="card-input"
                type="text"
                value={cardInput}
                onChange={(e) => setCardInput(e.target.value)}
                placeholder="4242 4242 4242 4242"
                disabled={topUpDone}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0099cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0099cc]/20 disabled:opacity-60"
              />
            </div>

            <button
              id="topup-btn"
              type="button"
              onClick={handleTopUp}
              disabled={topUpLoading || topUpDone || !cardInput.trim()}
              className="w-full rounded-xl bg-[#0099cc] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0088bb] disabled:opacity-50"
            >
              {topUpLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                  />
                  Converting USD → USDC…
                </span>
              ) : topUpDone ? (
                "✓ Wallet Funded"
              ) : (
                "Top Up Agent Balance"
              )}
            </button>
          </div>

          <FiatToUSDC active={topUpDone} amountUSD={Number(topUpAmount)} />
        </section>

        {/* ── Panel 3: Guardrails ── */}
        <section id="panel-guardrails" className="glass-panel p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Step 3
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Guardrails · ERC-8183
              </h2>
            </div>
            {guardrailsSaved && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-violet-100 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-violet-700"
              >
                Saved
              </motion.span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            The enterprise leash. Hard caps, vendor allow-lists, and trustless escrow
            enforcement — baked into every transaction.
          </p>

          <div className="mt-5 space-y-4">
            {/* Max spend slider */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  Max Spend / Day
                </label>
                <span className="font-mono text-sm font-semibold text-slate-900">
                  ${guardrails.maxSpendPerDay}.00 USDC
                </span>
              </div>
              <input
                id="guardrail-maxspend"
                type="range"
                min={1}
                max={100}
                value={guardrails.maxSpendPerDay}
                onChange={(e) =>
                  setGuardrails((g) => ({
                    ...g,
                    maxSpendPerDay: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#0099cc]"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>$1</span>
                <span>$100</span>
              </div>
            </div>

            {/* Vendor allow-list */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Allowed Vendors
              </label>
              <input
                id="guardrail-vendors"
                type="text"
                value={guardrails.allowedVendors}
                onChange={(e) =>
                  setGuardrails((g) => ({ ...g, allowedVendors: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0099cc]/50 focus:outline-none focus:ring-2 focus:ring-[#0099cc]/20"
              />
              <p className="mt-1 font-mono text-[10px] text-slate-400">
                Glob patterns · comma-separated
              </p>
            </div>

            {/* Escrow mode toggle */}
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Payment Behavior
              </label>
              <div className="flex gap-2">
                {(["escrow", "pre-auth"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    id={`guardrail-mode-${mode}`}
                    onClick={() => setGuardrails((g) => ({ ...g, mode }))}
                    className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-all ${
                      guardrails.mode === mode
                        ? "border-[#7c3aed] bg-violet-50 text-[#7c3aed]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {mode === "escrow" ? "Auto-escrow" : "Pre-auth"}
                  </button>
                ))}
              </div>
              {guardrails.mode === "escrow" && (
                <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                  ERC-8183 trustless escrow · zero counterparty risk
                </p>
              )}
            </div>

            <button
              id="guardrails-save-btn"
              type="button"
              onClick={handleSaveGuardrails}
              className="w-full rounded-xl border border-[#7c3aed]/30 bg-violet-50 py-2.5 text-sm font-semibold text-[#7c3aed] transition-all hover:bg-violet-100"
            >
              Save Guardrails
            </button>
          </div>

          {/* Summary pill */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="font-mono text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700">Active rules:</span>{" "}
              max ${guardrails.maxSpendPerDay}/day · {guardrails.allowedVendors} ·{" "}
              {guardrails.mode === "escrow" ? "ERC-8183 escrow" : "pre-auth"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
