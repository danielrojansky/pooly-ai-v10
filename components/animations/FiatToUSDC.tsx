"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FiatToUSDCProps {
  active: boolean;
  amountUSD: number;
}

/**
 * Animated funnel showing $USD entering and 50.00 USDC popping out.
 * Triggered after credit card confirmation.
 */
export function FiatToUSDC({ active, amountUSD }: FiatToUSDCProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="flex items-center justify-center gap-3">
            {/* USD input */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm"
            >
              <span className="text-xl font-bold text-slate-700">${amountUSD}.00</span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                USD · Fiat
              </span>
            </motion.div>

            {/* Arrow + Circle logo */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className="rounded-full bg-gradient-to-br from-[#0099cc] to-[#7c3aed] p-2 text-white shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-mono text-[9px] text-[#0099cc]"
              >
                Circle API
              </motion.span>
            </div>

            {/* USDC output */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center rounded-xl border border-[#0099cc]/30 bg-[#0099cc]/5 px-5 py-3 shadow-sm"
            >
              <span className="text-xl font-bold text-[#0099cc]">{amountUSD}.00</span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[#0099cc]">
                USDC · Wallet
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-3 text-center font-mono text-[11px] text-emerald-600"
          >
            ✓ {amountUSD}.00 USDC minted to agent programmable wallet · No private keys shown
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
