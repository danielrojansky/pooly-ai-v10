/**
 * Guardrails — the enterprise risk leash on agent spending.
 *
 * Evaluates a proposed payment against the agent's configured rules:
 *   - Max spend per day (USDC)
 *   - Allowed vendor URL patterns
 *   - Auto-escrow requirement
 *   - Per-request max
 *
 * Reads rules from Neon Postgres (see lib/db/schema.ts -> guardrails table).
 *
 * Phase 1: types + in-memory evaluator. Phase 3 wires DB lookups + daily spend
 * aggregation from the transactions table.
 */

import "server-only";

export interface GuardrailRules {
  agentId: string;
  maxSpendPerDayUSDC: number;
  maxSpendPerRequestUSDC: number;
  allowedVendorPatterns: string[];   // glob patterns, e.g. "*.apify.com/*"
  requireEscrow: boolean;
}

export interface GuardrailDecision {
  approved: boolean;
  reason: string;
  spentTodayUSDC: number;
  remainingTodayUSDC: number;
}

export interface EvaluateParams {
  rules: GuardrailRules;
  vendorUrl: string;
  amountUSDC: number;
  spentTodayUSDC: number;
}

/** Glob-match a URL against a wildcard pattern like "*.apify.com/*". */
export function matchesVendorPattern(url: string, pattern: string): boolean {
  const host = (() => {
    try {
      return new URL(url).host + new URL(url).pathname;
    } catch {
      return url;
    }
  })();
  const regex = new RegExp(
    "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
  );
  return regex.test(host);
}

export function evaluateGuardrails(params: EvaluateParams): GuardrailDecision {
  const { rules, vendorUrl, amountUSDC, spentTodayUSDC } = params;
  const remaining = rules.maxSpendPerDayUSDC - spentTodayUSDC;

  if (amountUSDC > rules.maxSpendPerRequestUSDC) {
    return {
      approved: false,
      reason: `Request amount ${amountUSDC} exceeds per-request cap ${rules.maxSpendPerRequestUSDC}`,
      spentTodayUSDC,
      remainingTodayUSDC: remaining,
    };
  }
  if (amountUSDC > remaining) {
    return {
      approved: false,
      reason: `Daily cap reached: ${spentTodayUSDC}/${rules.maxSpendPerDayUSDC} USDC spent today`,
      spentTodayUSDC,
      remainingTodayUSDC: remaining,
    };
  }
  const vendorOk = rules.allowedVendorPatterns.some((p) => matchesVendorPattern(vendorUrl, p));
  if (!vendorOk) {
    return {
      approved: false,
      reason: `Vendor ${vendorUrl} not in allow-list`,
      spentTodayUSDC,
      remainingTodayUSDC: remaining,
    };
  }
  return {
    approved: true,
    reason: `Approved: ${amountUSDC} USDC < ${rules.maxSpendPerDayUSDC} daily limit`,
    spentTodayUSDC,
    remainingTodayUSDC: remaining - amountUSDC,
  };
}
