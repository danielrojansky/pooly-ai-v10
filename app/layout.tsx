import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { AutoPilotProvider } from "@/contexts/AutoPilotContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const ver = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

export const metadata: Metadata = {
  title: `Pooly.AI ver 10 · v${ver} — Agentic Payments`,
  description:
    "The orchestration and trust layer for the trillion-dollar agent economy. x402 + ANS + Circle + ERC-8183.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <AutoPilotProvider>{children}</AutoPilotProvider>
      </body>
    </html>
  );
}
