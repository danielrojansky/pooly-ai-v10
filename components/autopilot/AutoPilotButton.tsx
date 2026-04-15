"use client";

import { useAutoPilot } from "@/contexts/AutoPilotContext";

export function AutoPilotButton() {
  const { status, toggle, isActive, currentStepIndex, totalSteps } = useAutoPilot();

  const label = (() => {
    if (status === "playing") return "Pause Tour";
    if (status === "paused") return "Resume Tour";
    if (status === "finished") return "Replay Tour";
    return "Initiate Autonomous Tour";
  })();

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative rounded-xl border border-[#0099cc]/30 bg-[#0099cc]/8 px-5 py-2 text-sm font-semibold text-[#0099cc] shadow-sm transition-all hover:bg-[#0099cc]/12 hover:border-[#0099cc]/50 hover:shadow-[0_0_12px_rgba(0,153,204,0.2)]"
    >
      <span className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full bg-[#0099cc] ${status === "playing" ? "animate-pulse" : ""}`}
        />
        {label}
        {isActive && totalSteps > 0 && (
          <span className="ml-1 font-mono text-[10px] text-slate-400">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        )}
      </span>
    </button>
  );
}
