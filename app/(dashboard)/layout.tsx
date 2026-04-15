import Link from "next/link";
import type { ReactNode } from "react";
import { AutoPilotButton } from "@/components/autopilot/AutoPilotButton";

const NAV = [
  { href: "/flow", label: "Full Flow", sub: "End-to-End", color: "text-[#0099cc]" },
  { href: "/developer", label: "Developer", sub: "Act I", color: "text-[#0099cc]" },
  { href: "/terminal", label: "Terminal", sub: "Act II", color: "text-[#7c3aed]" },
  { href: "/merchant", label: "Merchant", sub: "Act III", color: "text-[#059669]" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        {/* Main row: logo + desktop nav + autopilot button */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 flex-none rounded-xl bg-gradient-to-br from-[#0099cc] to-[#7c3aed] glow-cyan sm:h-8 sm:w-8" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">Pooly.AI</span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:block">
                Agentic Payments · v{process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"}
              </span>
            </div>
          </Link>

          {/* Desktop nav — hidden on small screens */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:px-4"
              >
                <span className="block">{item.label}</span>
                <span className={`block text-[10px] uppercase tracking-widest ${item.color}`}>
                  {item.sub}
                </span>
              </Link>
            ))}
          </nav>

          <AutoPilotButton />
        </div>

        {/* Mobile nav row — visible only on small screens (below md) */}
        <div className="flex items-center gap-0.5 overflow-x-auto border-t border-slate-100 px-2 pb-2 pt-1 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-none flex-col items-center rounded-lg px-3 py-1.5 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <span>{item.label}</span>
              <span className={`text-[9px] uppercase tracking-widest ${item.color}`}>
                {item.sub}
              </span>
            </Link>
          ))}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
