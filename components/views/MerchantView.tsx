"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ── Mock data ── */
const CHART_DATA = [
  { time: "09:00", human: 1.2, agent: 0 },
  { time: "09:30", human: 0.8, agent: 0 },
  { time: "10:00", human: 1.5, agent: 0.5 },
  { time: "10:30", human: 1.0, agent: 1.5 },
  { time: "11:00", human: 1.8, agent: 3.2 },
  { time: "11:05", human: 1.2, agent: 4.8 },
];

const TRANSACTIONS = [
  {
    id: "txn-001",
    ts: "11:05:09",
    buyer: "linkedin-scraper.agent",
    amount: "0.50",
    protocol: "x402",
    status: "released",
  },
  {
    id: "txn-002",
    ts: "10:52:33",
    buyer: "data-enricher.agent",
    amount: "0.25",
    protocol: "x402",
    status: "released",
  },
  {
    id: "txn-003",
    ts: "10:48:11",
    buyer: "human-user@gmail.com",
    amount: "4.99",
    protocol: "stripe",
    status: "settled",
  },
  {
    id: "txn-004",
    ts: "10:31:07",
    buyer: "scraper-bot.agent",
    amount: "0.50",
    protocol: "x402",
    status: "released",
  },
  {
    id: "txn-005",
    ts: "10:12:44",
    buyer: "human-user@company.io",
    amount: "4.99",
    protocol: "stripe",
    status: "settled",
  },
];

/* ── Confetti (lazy-loaded, client-only) ── */
async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#0099cc", "#7c3aed", "#059669", "#d97706"];
  confetti({
    particleCount: 160,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  });
  await new Promise((r) => setTimeout(r, 400));
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors,
  });
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors,
  });
}

/* ── Component ── */
export function MerchantView() {
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const handleWithdraw = useCallback(async () => {
    setWithdrawing(true);
    await new Promise((r) => setTimeout(r, 1600));
    setWithdrawn(true);
    setWithdrawing(false);
    await fireConfetti();
  }, []);

  const totalAgentRevenue = TRANSACTIONS.filter((t) => t.protocol === "x402")
    .reduce((sum, t) => sum + Number(t.amount), 0)
    .toFixed(2);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600">
            Act III · Off-Ramp
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Merchant Portal
            </h1>
            <p className="mt-2 max-w-xl text-slate-500">
              Apify's view. Agentic traffic arrives as x402 payments. One click converts USDC to
              USD — no crypto knowledge required.
            </p>
          </div>
          <button
            id="withdraw-btn"
            type="button"
            onClick={() => setWithdrawModal(true)}
            disabled={withdrawn}
            className="relative rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-emerald-200 hover:shadow-xl disabled:opacity-60"
          >
            {!withdrawn && (
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-emerald-400/40"
              />
            )}
            <span className="relative">
              {withdrawn ? "✓ Withdrawn to Bank" : "Withdraw to Bank"}
            </span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: "$" + (Number(totalAgentRevenue) + 9.98).toFixed(2), sub: "today" },
          { label: "Agent Revenue", value: "$" + totalAgentRevenue, sub: "x402 protocol", highlight: true },
          { label: "Agent Transactions", value: String(TRANSACTIONS.filter(t => t.protocol === "x402").length), sub: "agentic payments" },
          { label: "Avg Latency", value: "3.1s", sub: "request→receipt" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-panel p-5 ${stat.highlight ? "border-[#0099cc]/30" : ""}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                stat.highlight ? "text-[#0099cc]" : "text-slate-900"
              }`}
            >
              {stat.value}
            </p>
            <p className="font-mono text-[10px] text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Recharts traffic graph ── */}
        <section id="panel-traffic" className="glass-panel p-6">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            Agentic Traffic · Revenue (USDC)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                tick={{ fontFamily: "var(--font-fira-code)", fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                tick={{ fontFamily: "var(--font-fira-code)", fontSize: 10, fill: "#94a3b8" }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  fontFamily: "var(--font-fira-code)",
                  fontSize: 11,
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  background: "#ffffff",
                }}
              />
              <Legend
                wrapperStyle={{ fontFamily: "var(--font-fira-code)", fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="human"
                name="Human Traffic"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="agent"
                name="Agent Traffic (x402)"
                stroke="#0099cc"
                strokeWidth={2.5}
                dot={{ fill: "#0099cc", r: 3 }}
                strokeDasharray=""
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* ── Revenue table ── */}
        <section id="panel-revenue" className="glass-panel overflow-hidden p-6">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            Line Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Time
                  </th>
                  <th className="pb-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Buyer
                  </th>
                  <th className="pb-2 text-right font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Amount
                  </th>
                  <th className="pb-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Protocol
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TRANSACTIONS.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">{tx.ts}</td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-700">
                      {tx.buyer}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[11px] font-semibold text-slate-900">
                      +{tx.amount} USDC
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                          tx.protocol === "x402"
                            ? "bg-[#0099cc]/10 text-[#0099cc]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tx.protocol}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Withdraw Modal ── */}
      <AnimatePresence>
        {withdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget && !withdrawing) setWithdrawModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
            >
              {!withdrawn ? (
                <>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M3 14h18M10 18v2M14 18v2M7 6h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Withdraw to Bank</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Converting{" "}
                    <span className="font-semibold text-[#0099cc]">{totalAgentRevenue} USDC</span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-900">
                      ${totalAgentRevenue} USD
                    </span>{" "}
                    via Circle CPN. Funds will appear in your Chase account within 1 business day.
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Destination</span>
                      <span className="font-semibold text-slate-900">Chase ···· 4821</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Network fee</span>
                      <span className="font-semibold text-emerald-600">$0.00 (Circle CPN)</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setWithdrawModal(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleWithdraw}
                      disabled={withdrawing}
                      className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {withdrawing ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                          />
                          Converting…
                        </span>
                      ) : (
                        "Confirm Withdrawal"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900">Withdrawal Initiated</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {totalAgentRevenue} USDC → ${totalAgentRevenue} USD routed to Chase ···· 4821
                    via Circle CPN.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-slate-400">
                    No blockchain knowledge required.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWithdrawModal(false)}
                    className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
