"use client";

import { motion, AnimatePresence } from "framer-motion";

type PadlockState = "idle" | "locking" | "locked" | "opening" | "open";

interface EscrowPadlockProps {
  state: PadlockState;
}

/**
 * 3D-feel padlock that locks → snaps open when escrow is released.
 * The "magic moment" of the terminal view.
 */
export function EscrowPadlock({ state }: EscrowPadlockProps) {
  if (state === "idle") return null;

  const isLocked = state === "locked" || state === "locking";
  const isOpen = state === "open" || state === "opening";

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        {(state === "locking" || state === "locked") && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex flex-col items-center gap-4"
          >
            {/* USDC coin + padlock */}
            <div className="relative">
              {/* Spinning USDC coin */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0099cc] to-[#0066aa] shadow-2xl"
                style={{ perspective: 800 }}
              >
                <div className="flex h-full items-center justify-center text-2xl font-bold text-white">
                  ₿
                </div>
              </motion.div>

              {/* Padlock overlay */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </motion.div>
            </div>

            <div className="rounded-xl bg-black/80 px-5 py-3 backdrop-blur">
              <p className="text-center font-mono text-sm font-semibold text-white">
                ERC-8183 Escrow Locked
              </p>
              <p className="text-center font-mono text-xs text-[#0099cc]">
                0.50 USDC · Zero counterparty risk
              </p>
            </div>
          </motion.div>
        )}

        {(state === "opening" || state === "open") && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              {/* Coin flying right */}
              <motion.div
                animate={{ x: [0, 160], opacity: [1, 0] }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeIn" }}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-[#059669] to-[#0099cc] shadow-2xl"
              >
                <div className="flex h-full items-center justify-center text-2xl font-bold text-white">
                  ₿
                </div>
              </motion.div>

              {/* Open padlock */}
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M12 1C9.24 1 7 3.24 7 6v1H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              </motion.div>
            </div>

            <div className="rounded-xl bg-emerald-900/90 px-5 py-3 backdrop-blur">
              <p className="text-center font-mono text-sm font-semibold text-white">
                ✅ Escrow Released to Vendor
              </p>
              <p className="text-center font-mono text-xs text-emerald-300">
                Data verified · 0.50 USDC transferred
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
