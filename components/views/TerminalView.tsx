"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EscrowPadlock } from "@/components/animations/EscrowPadlock";

interface LogEntry {
  ts: string;
  icon: string;
  text: string;
  color: string;
  delay: number;
}

type PadlockState = "idle" | "locking" | "locked" | "opening" | "open";

const DEMO_PROMPT = "Find 5 Machine Learning engineers in Tel Aviv using Apify.";

function ts(offsetMs: number) {
  const now = new Date(Date.now() + offsetMs);
  return `[${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}]`;
}

const SEQUENCE: Omit<LogEntry, "ts">[] = [
  { icon: "🤖", text: "Agent computing plan... Target: Apify API.", color: "text-slate-300", delay: 800 },
  { icon: "🌐", text: "HTTP GET /v2/linkedin-scraper?count=5&location=Tel+Aviv", color: "text-sky-300", delay: 600 },
  { icon: "🔴", text: "402 Payment Required received. Price: 0.50 USDC.", color: "text-red-400", delay: 400 },
  { icon: "🛡️", text: "Validating ANS Identity... SUCCESS (linkedin-scraper.agent)", color: "text-emerald-400", delay: 700 },
  { icon: "💸", text: "Guardrail Check: 0.50 USDC < $10.00 daily limit. APPROVED.", color: "text-yellow-300", delay: 500 },
  { icon: "🔗", text: "ERC-8183 Escrow: Locking funds...", color: "text-violet-400", delay: 900 },
  { icon: "🌐", text: "Re-sending HTTP GET with x402 Payment-Signature header...", color: "text-sky-300", delay: 1200 },
  { icon: "📥", text: "Data received (5 records). ZK-Verifier confirms payload.", color: "text-emerald-400", delay: 1000 },
  { icon: "✅", text: "Escrow Released to Vendor. Transaction complete.", color: "text-emerald-300", delay: 600 },
];

const RESULT_ROWS = [
  { name: "Yael Cohen", title: "ML Engineer", company: "Wix", location: "Tel Aviv" },
  { name: "Ido Ben-David", title: "Senior ML Engineer", company: "Mobileye", location: "Tel Aviv" },
  { name: "Noa Shapira", title: "AI/ML Lead", company: "Monday.com", location: "Tel Aviv" },
  { name: "Ariel Levi", title: "ML Research Engineer", company: "Meta TLV", location: "Tel Aviv" },
  { name: "Tamar Goldberg", title: "Applied ML Engineer", company: "Google TLV", location: "Tel Aviv" },
];

export function TerminalView() {
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [padlock, setPadlock] = useState<PadlockState>("idle");
  const [results, setResults] = useState<typeof RESULT_ROWS | null>(null);
  const [matrixPhase, setMatrixPhase] = useState<"hidden" | "cascading" | "done">("hidden");
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const runSequence = useCallback(async (userPrompt: string) => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setResults(null);
    setMatrixPhase("hidden");
    setPadlock("idle");
    abortRef.current = false;

    const now = Date.now();

    for (let i = 0; i < SEQUENCE.length; i++) {
      if (abortRef.current) break;
      const s = SEQUENCE[i];
      await new Promise((r) => setTimeout(r, s.delay));
      if (abortRef.current) break;

      setLogs((prev) => [
        ...prev,
        {
          ts: ts(i * 1000),
          icon: s.icon,
          text: s.text,
          color: s.color,
          delay: s.delay,
        },
      ]);

      // Escrow lock animation after entry 5
      if (i === 5) {
        setPadlock("locking");
        await new Promise((r) => setTimeout(r, 600));
        setPadlock("locked");
        await new Promise((r) => setTimeout(r, 1000));
        setPadlock("idle");
      }

      // Escrow release after entry 7
      if (i === 7) {
        setPadlock("opening");
        await new Promise((r) => setTimeout(r, 500));
        setPadlock("open");
        await new Promise((r) => setTimeout(r, 1200));
        setPadlock("idle");
      }

      // Matrix cascade after last entry
      if (i === SEQUENCE.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
        setMatrixPhase("cascading");
        // Generate random matrix chars
        const chars = Array.from({ length: 120 }, () =>
          Math.random() > 0.5
            ? String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
            : String.fromCharCode(48 + Math.floor(Math.random() * 10)),
        );
        setMatrixChars(chars);
        await new Promise((r) => setTimeout(r, 1400));
        setMatrixPhase("done");
        setResults(RESULT_ROWS);
      }
    }

    setRunning(false);
  }, [running]);

  const handleSubmit = () => {
    const text = prompt.trim() || DEMO_PROMPT;
    runSequence(text);
  };

  const handleReset = () => {
    abortRef.current = true;
    setRunning(false);
    setLogs([]);
    setResults(null);
    setMatrixPhase("hidden");
    setPadlock("idle");
    setPrompt("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <EscrowPadlock state={padlock} />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/20 bg-violet-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7c3aed]">
            Act II · Showtime
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Execution Terminal
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Watch the agent hit a 402, negotiate payment, lock escrow, and retrieve data —
          zero humans in the loop.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
        {/* ── Left: Intent Pane ── */}
        <div className="flex flex-col gap-4">
          <section id="panel-intent" className="glass-panel p-4 sm:p-5">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Agent Intent
            </h2>
            <textarea
              id="intent-input"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={DEMO_PROMPT}
              disabled={running}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7c3aed]/50 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/15 disabled:opacity-60"
            />
            <div className="mt-3 flex gap-2">
              <button
                id="run-btn"
                type="button"
                onClick={handleSubmit}
                disabled={running}
                className="flex-1 rounded-xl bg-[#7c3aed] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6d28d9] disabled:opacity-50"
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                    />
                    Running…
                  </span>
                ) : (
                  "Run Agent"
                )}
              </button>
              {(logs.length > 0 || results) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-all hover:border-slate-300"
                >
                  Reset
                </button>
              )}
            </div>
          </section>

          {/* Protocol legend */}
          <section className="glass-panel p-4 sm:p-5">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Protocol Stack
            </h2>
            <div className="space-y-2">
              {[
                { label: "ANS", desc: "Agent Name System · Cloudflare", color: "bg-sky-500" },
                { label: "x402", desc: "402 Payment Required intercept", color: "bg-red-400" },
                { label: "ERC-8183", desc: "Trustless escrow · Base Sepolia", color: "bg-violet-500" },
                { label: "Circle", desc: "Programmable wallets · USDC", color: "bg-[#0099cc]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-2 w-2 flex-none rounded-full ${item.color}`} />
                  <span className="w-20 flex-none font-mono text-xs font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right: Live Ledger Terminal ── */}
        <section id="panel-ledger" className="terminal-panel flex min-h-[340px] flex-col p-4 sm:min-h-[520px] sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 font-mono text-[10px] text-slate-400">
              pooly-agent · x402 execution log
            </span>
            {running && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-auto h-2 w-2 rounded-full bg-emerald-400"
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {logs.length === 0 && !running && (
              <p className="font-mono text-sm text-slate-500">
                <span className="text-[#0099cc]">$</span> Waiting for intent… Type a prompt and
                click Run Agent.
              </p>
            )}

            <div className="space-y-1.5">
              <AnimatePresence>
                {logs.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 font-mono text-xs sm:text-sm ${entry.color}`}
                  >
                    <span className="hidden flex-none text-slate-500 sm:inline">{entry.ts}</span>
                    <span className="flex-none">{entry.icon}</span>
                    <span className="break-all">{entry.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Matrix cascade */}
            {matrixPhase === "cascading" && (
              <div className="mt-3 flex flex-wrap gap-[2px] overflow-hidden rounded-lg bg-black/30 p-3">
                {matrixChars.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: [0, 1, 0.6] }}
                    transition={{
                      delay: i * 0.009,
                      duration: 0.3,
                    }}
                    className="font-mono text-xs text-emerald-400"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Results table */}
            {results && matrixPhase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 overflow-hidden rounded-xl border border-white/10"
              >
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:px-4">
                        Name
                      </th>
                      <th className="hidden px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:table-cell sm:px-4">
                        Title
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:px-4">
                        Company
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <motion.tr
                        key={row.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-white sm:px-4">{row.name}</td>
                        <td className="hidden px-3 py-2 font-mono text-xs text-slate-300 sm:table-cell sm:px-4">{row.title}</td>
                        <td className="px-3 py-2 font-mono text-xs text-[#0099cc] sm:px-4">{row.company}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="border-t border-white/10 bg-white/5 px-4 py-2">
                  <p className="font-mono text-[10px] text-emerald-400">
                    ✓ 5 records retrieved · ZK proof verified · Cost: 0.50 USDC
                  </p>
                </div>
              </motion.div>
            )}

            <div ref={logEndRef} />
          </div>
        </section>
      </div>
    </div>
  );
}
