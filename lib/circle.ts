/**
 * Circle Programmable Wallets — developer sandbox integration.
 *
 * Wraps @circle-fin/developer-controlled-wallets SDK for:
 *  - Creating a programmable wallet for a Pooly agent identity
 *  - Minting testnet USDC (on-ramp simulation)
 *  - Querying balance
 *  - Initiating USDC → USD off-ramp via Circle CPN (merchant withdrawal)
 *
 * All functions are server-only (route handlers). Keys come from env vars:
 *   CIRCLE_API_KEY
 *   CIRCLE_ENTITY_SECRET
 *
 * Phase 1: typed stubs with clear interfaces, no real SDK calls yet.
 * Phase 3 wires the real sandbox.
 */

import "server-only";

export interface CircleWallet {
  id: string;
  address: `0x${string}`;
  blockchain: "BASE-SEPOLIA";
  balanceUSDC: string;
  createdAt: string;
}

export interface TopUpParams {
  walletId: string;
  amountUSD: number;
}

export interface TopUpResult {
  walletId: string;
  mintedUSDC: string;
  newBalanceUSDC: string;
  transactionHash?: `0x${string}`;
}

export interface WithdrawParams {
  walletId: string;
  amountUSDC: number;
  destinationBankAccountId: string;
}

export interface WithdrawResult {
  payoutId: string;
  status: "pending" | "complete";
  amountUSD: string;
}

/** TODO Phase 3: create developer-controlled wallet in sandbox. */
export async function createAgentWallet(_agentDomain: string): Promise<CircleWallet> {
  throw new Error("createAgentWallet: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: simulate Stripe fiat → USDC mint by minting sandbox USDC. */
export async function topUpWallet(_params: TopUpParams): Promise<TopUpResult> {
  throw new Error("topUpWallet: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: fetch live balance. */
export async function getWalletBalance(_walletId: string): Promise<string> {
  throw new Error("getWalletBalance: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: Circle CPN off-ramp USDC → USD to a merchant bank account. */
export async function withdrawToBank(_params: WithdrawParams): Promise<WithdrawResult> {
  throw new Error("withdrawToBank: not implemented (wire in Phase 3)");
}
