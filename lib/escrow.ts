/**
 * ERC-8183 Smart Escrow — Base Sepolia testnet.
 *
 * Handles the lock/release lifecycle for agent micro-payments:
 *  1. `lockFunds` — agent commits USDC into escrow pending data delivery
 *  2. `verifyPayload` — ZK-verifier confirms vendor returned valid data
 *  3. `releaseToVendor` — escrow releases funds to the merchant
 *  4. `refundToAgent` — if vendor fails, refund the agent
 *
 * Uses viem to interact with a deployed ERC-8183-compliant contract on
 * Base Sepolia. Contract ABI lives in contracts/erc8183.abi.json.
 *
 * Env vars:
 *   BASE_SEPOLIA_RPC_URL
 *   ESCROW_CONTRACT_ADDRESS
 *   ESCROW_DEPLOYER_PRIVATE_KEY  (testnet only)
 *
 * Phase 1: typed stubs. Phase 3 wires the real contract.
 */

import "server-only";

export type EscrowId = `0x${string}`;
export type EscrowStatus = "locked" | "released" | "refunded" | "expired";

export interface EscrowLock {
  id: EscrowId;
  agentDomain: string;
  vendorAddress: `0x${string}`;
  amountUSDC: string;
  lockTxHash: `0x${string}`;
  expiresAt: number;
  status: EscrowStatus;
}

export interface LockFundsParams {
  agentDomain: string;
  agentWalletId: string;
  vendorAddress: `0x${string}`;
  amountUSDC: number;
  requestHash: `0x${string}`;
  timeoutSeconds?: number;
}

export interface ReleaseParams {
  escrowId: EscrowId;
  payloadHash: `0x${string}`;
  zkProof?: `0x${string}`;
}

/** TODO Phase 3: call lockFunds on the ERC-8183 contract via viem. */
export async function lockFunds(_params: LockFundsParams): Promise<EscrowLock> {
  throw new Error("lockFunds: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: verify vendor payload hash + release escrow to vendor address. */
export async function releaseToVendor(_params: ReleaseParams): Promise<`0x${string}`> {
  throw new Error("releaseToVendor: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: refund the agent if vendor fails or times out. */
export async function refundToAgent(_escrowId: EscrowId): Promise<`0x${string}`> {
  throw new Error("refundToAgent: not implemented (wire in Phase 3)");
}

/** TODO Phase 3: read the on-chain status of an escrow lock. */
export async function getEscrowStatus(_escrowId: EscrowId): Promise<EscrowLock> {
  throw new Error("getEscrowStatus: not implemented (wire in Phase 3)");
}
