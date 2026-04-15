import Link from "next/link";

const ACTS = [
  {
    href: "/developer",
    tag: "Act I",
    title: "Orchestration Dashboard",
    desc: "Mint an ANS identity, top up the wallet via Circle, set enterprise guardrails.",
    borderColor: "hover:border-[#0099cc]/50",
    tagColor: "text-[#0099cc]",
  },
  {
    href: "/terminal",
    tag: "Act II",
    title: "Execution Terminal",
    desc: "Watch the x402 handshake, ERC-8183 escrow lock, and data cascade in real time.",
    borderColor: "hover:border-[#7c3aed]/50",
    tagColor: "text-[#7c3aed]",
  },
  {
    href: "/merchant",
    tag: "Act III",
    title: "Merchant Off-Ramp",
    desc: "Apify's dashboard — USDC in, USD out, one click to a legacy bank account.",
    borderColor: "hover:border-[#059669]/50",
    tagColor: "text-[#059669]",
  },
];

export default function Home() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0099cc]/20 bg-[#0099cc]/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0099cc]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0099cc]">
            Pooly.AI · ver 10
          </span>
        </div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
          Agentic payments,{" "}
          <span className="text-glow-purple">fully autonomous</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
          The orchestration and trust layer for the trillion-dollar agent economy. x402
          monetization, ANS identity, Circle programmable wallets, and ERC-8183 trustless
          escrow — in one stack.
        </p>
      </div>

      <div className="grid w-full gap-5 md:grid-cols-3">
        {ACTS.map((act) => (
          <Link
            key={act.href}
            href={act.href}
            className={`glass-panel glass-panel-hover group relative overflow-hidden p-8 ${act.borderColor}`}
          >
            <p className={`font-mono text-[11px] uppercase tracking-[0.25em] ${act.tagColor}`}>
              {act.tag}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{act.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{act.desc}</p>
            <p className={`mt-6 font-mono text-[11px] uppercase tracking-widest ${act.tagColor}`}>
              Enter →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
