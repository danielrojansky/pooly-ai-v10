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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0099cc] to-[#7c3aed] glow-cyan" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">Pooly.AI</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Agentic Payments
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
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
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
