/**
 * Drizzle ORM schema for Pooly.AI ver 10.
 *
 * Tables:
 *   agents        — ANS-minted agent identities
 *   guardrails    — spending + vendor rules per agent
 *   transactions  — mock + real x402 payment history for graphs/tables
 *   merchants     — vendor off-ramp accounts
 *
 * Backed by Neon serverless Postgres.
 */

import {
  pgTable,
  serial,
  text,
  timestamp,
  numeric,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "escrow_locked",
  "released",
  "refunded",
  "failed",
]);

export const trafficTypeEnum = pgEnum("traffic_type", ["agent", "human"]);

export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),                  // NextAuth user
  ansDomain: text("ans_domain").notNull().unique(),   // e.g. "linkedin-scraper.agent"
  displayName: text("display_name").notNull(),
  circleWalletId: text("circle_wallet_id"),
  walletAddress: text("wallet_address"),
  balanceUSDC: numeric("balance_usdc", { precision: 18, scale: 6 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const guardrails = pgTable("guardrails", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  maxSpendPerDayUSDC: numeric("max_spend_per_day_usdc", { precision: 18, scale: 6 })
    .notNull()
    .default("10"),
  maxSpendPerRequestUSDC: numeric("max_spend_per_request_usdc", { precision: 18, scale: 6 })
    .notNull()
    .default("1"),
  allowedVendorPatterns: jsonb("allowed_vendor_patterns").$type<string[]>().notNull().default([]),
  requireEscrow: boolean("require_escrow").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "set null" }),
  vendorUrl: text("vendor_url").notNull(),
  merchantDomain: text("merchant_domain"),
  amountUSDC: numeric("amount_usdc", { precision: 18, scale: 6 }).notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  trafficType: trafficTypeEnum("traffic_type").notNull().default("agent"),
  escrowId: text("escrow_id"),
  escrowTxHash: text("escrow_tx_hash"),
  releaseTxHash: text("release_tx_hash"),
  payloadHash: text("payload_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchants = pgTable("merchants", {
  id: uuid("id").primaryKey().defaultRandom(),
  domain: text("domain").notNull().unique(),          // e.g. "apify.com"
  walletAddress: text("wallet_address").notNull(),
  bankAccountId: text("bank_account_id"),             // Circle CPN destination
  totalRevenueUSDC: numeric("total_revenue_usdc", { precision: 18, scale: 6 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Guardrails = typeof guardrails.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Merchant = typeof merchants.$inferSelect;
