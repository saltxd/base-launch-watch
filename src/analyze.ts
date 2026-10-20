import { TRANSFER_TOPIC, ZERO_ADDRESS } from "./constants.js";
import type { RpcLog } from "./rpc.js";

export interface Transfer {
  token: string;
  from: string;
  to: string;
  value: bigint;
  blockNumber: number;
  logIndex: number;
  transactionHash: string;
}

export function topicToAddress(topic: string): string {
  return ("0x" + topic.slice(-40)).toLowerCase();
}

export function addressToTopic(address: string): string {
  return "0x" + address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

/** Decodes an ERC-20 Transfer log. Returns null for anything else (including ERC-721 transfers, which have 4 topics). */
export function parseTransfer(log: RpcLog): Transfer | null {
  if (log.topics.length !== 3 || log.topics[0]?.toLowerCase() !== TRANSFER_TOPIC) return null;
  const data = log.data === "0x" ? "0x0" : log.data;
  return {
    token: log.address.toLowerCase(),
    from: topicToAddress(log.topics[1]!),
    to: topicToAddress(log.topics[2]!),
    value: BigInt(data.length > 66 ? data.slice(0, 66) : data),
    blockNumber: Number(BigInt(log.blockNumber)),
    logIndex: Number(BigInt(log.logIndex)),
    transactionHash: log.transactionHash.toLowerCase(),
  };
}

/**
 * Sums the tokens `wallet` received from a non-zero address in the launch transaction's logs.
 * Mints (from the zero address) are not counted.
 */
export function devBuyAmount(launchTxLogs: RpcLog[], token: string, wallet: string): bigint {
  const t = token.toLowerCase();
  const w = wallet.toLowerCase();
  let total = 0n;
  for (const log of launchTxLogs) {
    const tr = parseTransfer(log);
    if (tr && tr.token === t && tr.to === w && tr.from !== ZERO_ADDRESS) total += tr.value;
  }
  return total;
}

/** True when `sent` is at least 90% of `received`, using exact integer math. */
export function reachedNinetyPercent(sent: bigint, received: bigint): boolean {
  return received > 0n && sent * 10n >= received * 9n;
}

/**
 * Given what the wallet received and its outgoing transfers, returns the first block by which
 * its cumulative outgoing amount reached 90% or more of what it received, or null if it never did.
 * Transfers outside (launchBlock, launchBlock + windowBlocks] are ignored.
 */
export function firstBlockAtNinetyPercent(
  received: bigint,
  outgoing: Transfer[],
  launchBlock: number,
  windowBlocks: number,
): number | null {
  if (received <= 0n) return null;
  const inWindow = outgoing
    .filter((t) => t.blockNumber > launchBlock && t.blockNumber <= launchBlock + windowBlocks)
    .sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex);
  let sent = 0n;
  for (const t of inWindow) {
    sent += t.value;
    if (reachedNinetyPercent(sent, received)) return t.blockNumber;
  }
  return null;
}
