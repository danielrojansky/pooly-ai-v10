/**
 * x402 Protocol — HTTP micropayment facilitator.
 *
 * When a vendor returns HTTP 402 Payment Required, Pooly intercepts, looks up
 * the price + accepted token from the `Payment-Required` headers, validates
 * the agent's guardrails, locks the payment in ERC-8183 escrow, and re-sends
 * the original request with a signed `Payment-Signature` header.
 *
 * Spec reference: x402.org / draft-x402-protocol
 * Header shape (informal):
 *   Payment-Required: amount=0.50; currency=USDC; network=base-sepolia;
 *                     recipient=0x...; nonce=...; expires=...
 *   Payment-Signature: <agent ANS signature over the payment receipt>
 *
 * Phase 1: typed stubs + parser + types. Phase 3 wires the full flow.
 */

import "server-only";

export interface PaymentRequired {
  amount: string;         // decimal USDC, e.g. "0.50"
  currency: "USDC";
  network: "base-sepolia" | "polygon-amoy";
  recipient: `0x${string}`;
  nonce: string;
  expiresAt: number;
}

export interface PaymentReceipt {
  agentDomain: string;
  escrowId: `0x${string}`;
  payment: PaymentRequired;
  signature: `0x${string}`;
}

/** Parse the `Payment-Required` header shape. */
export function parsePaymentRequired(header: string): PaymentRequired {
  const parts = Object.fromEntries(
    header.split(";").map((p) => {
      const [k, v] = p.trim().split("=");
      return [k, v];
    }),
  );
  return {
    amount: parts.amount ?? "0",
    currency: "USDC",
    network: (parts.network as PaymentRequired["network"]) ?? "base-sepolia",
    recipient: (parts.recipient as `0x${string}`) ?? "0x0000000000000000000000000000000000000000",
    nonce: parts.nonce ?? "",
    expiresAt: parts.expires ? Number(parts.expires) : Date.now() + 60_000,
  };
}

/** Build the `Payment-Signature` header value from an escrow receipt. */
export function buildPaymentSignature(receipt: PaymentReceipt): string {
  return `receipt=${receipt.escrowId}; agent=${receipt.agentDomain}; sig=${receipt.signature}`;
}

/** TODO Phase 3: sign a payment receipt with the agent's ANS-bound key. */
export async function signReceipt(
  _agentDomain: string,
  _payment: PaymentRequired,
  _escrowId: `0x${string}`,
): Promise<`0x${string}`> {
  throw new Error("signReceipt: not implemented (wire in Phase 3)");
}
