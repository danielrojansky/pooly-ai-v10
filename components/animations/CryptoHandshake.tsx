"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CryptoHandshakeProps {
  active: boolean;
  agentDomain: string;
}

/**
 * Renders a glowing connection line between the agent cert and a Cloudflare
 * shield icon — the "ANS cryptographic handshake" animation.
 */
export function CryptoHandshake({ active, agentDomain }: CryptoHandshakeProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 overflow-hidden rounded-xl border border-[#0099cc]/20 bg-slate-50 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Agent cert card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex min-w-0 flex-col rounded-xl border border-[#0099cc]/30 bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Agent Certificate
              </span>
              <span className="mt-1 font-mono text-sm font-semibold text-[#0099cc]">
                {agentDomain}.agent
              </span>
              <span className="mt-0.5 font-mono text-[10px] text-slate-400">
                ANS v1.0 · ed25519
              </span>
            </motion.div>

            {/* Animated connection line */}
            <div className="relative flex-1 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
                className="h-[2px] origin-left rounded-full bg-gradient-to-r from-[#0099cc] to-[#7c3aed]"
                style={{ boxShadow: "0 0 8px rgba(0,153,204,0.6)" }}
              />
              {/* Travelling dot */}
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{
                  delay: 0.9,
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 h-3 w-3 rounded-full bg-[#0099cc] shadow-[0_0_8px_rgba(0,153,204,0.8)]"
                style={{ transform: "translateX(-50%)" }}
              />
            </div>

            {/* Cloudflare Verified shield */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex min-w-0 flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-emerald-500"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-600"
              >
                Verified
              </motion.span>
              <span className="font-mono text-[9px] text-emerald-400">Cloudflare ANS</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] text-emerald-600">
              Identity minted · {agentDomain}.agent · cryptographic certificate bound
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
