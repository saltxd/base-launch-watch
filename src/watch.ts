import { addressToTopic, devBuyAmount, firstBlockAtNinetyPercent, parseTransfer, topicToAddress, type Transfer } from "./analyze.js";
import {
  BLOCKS_PER_HOUR,
  CLANKER_V4_FACTORY,
  DUMP_WINDOW_BLOCKS,
  TOKEN_CREATED_TOPIC,
  TRANSFER_TOPIC,
} from "./constants.js";
import { getLogs, getLogsPaged } from "./logs.js";
import { RpcError, toHex, type Rpc, type RpcLog } from "./rpc.js";
import { tokenDecimals, tokenSymbol } from "./token.js";

export interface LaunchResult {
  token: string;
  tokenAdmin: string;
  launchTx: string;
  launchBlock: number;
  launchTime: Date;
  launchWallet: string;
  received: bigint;
  /** First block by which 90%+ of `received` had been sent out, within the hour after launch. */
  ninetyBlock: number | null;
  /** False when the hour after launch had not fully passed at scan time. */
  windowComplete: boolean;
  symbol?: string;
  decimals?: number;
}

export interface ScanResult {
  rpcUrl: string;
  hours: number;
  headBlock: number;
  headTime: Date;
  requestedFrom: number;
  coveredFrom: number;
  coveredFromTime: Date;
  launchesFound: number;
  results: LaunchResult[];
  failures: { launchTx: string; token: string; error: string }[];
}

export interface ScanOptions {
  hours: number;
  rpcUrl: string;
  concurrency?: number;
  log?: (msg: string) => void;
}

interface RpcTx {
  from: string;
}
interface RpcReceipt {
  logs: RpcLog[];
}
interface RpcBlock {
  timestamp: string;
}

export async function scan(rpc: Rpc, options: ScanOptions): Promise<ScanResult> {
  const log = options.log ?? (() => {});
  const head = Number(BigInt(await rpc.call<string>("eth_blockNumber", [])));
  const headTime = await blockTime(rpc, head);
  const requestedFrom = Math.max(0, head - Math.round(options.hours * BLOCKS_PER_HOUR) + 1);

  log(`Scanning TokenCreated logs in blocks ${requestedFrom}..${head}`);
  const paged = await getLogsPaged(
    rpc,
    { address: CLANKER_V4_FACTORY, topics: [TOKEN_CREATED_TOPIC] },
    requestedFrom,
    head,
    { onChunk: (r) => log(`  eth_getLogs ${r.from}..${r.to}`) },
  );
  if (paged.coveredFrom > requestedFrom) {
    log(`  The RPC does not serve logs before block ${paged.coveredFrom}; older part of the window skipped.`);
  }
  const coveredFromTime = paged.coveredFrom <= head ? await blockTime(rpc, paged.coveredFrom) : headTime;
  log(`Found ${paged.logs.length} launches. Checking launch wallets...`);

  const results: LaunchResult[] = [];
  const failures: ScanResult["failures"] = [];
  await mapLimit(paged.logs, options.concurrency ?? 3, async (createdLog) => {
    const token = topicToAddress(createdLog.topics[1] ?? "0x");
    try {
      results.push(await checkLaunch(rpc, createdLog, head));
    } catch (err) {
      failures.push({ launchTx: createdLog.transactionHash, token, error: (err as Error).message });
      log(`  failed ${token}: ${(err as Error).message}`);
    }
  });

  const flagged = results.filter((r) => r.ninetyBlock !== null);
  await mapLimit(flagged, options.concurrency ?? 3, async (r) => {
    r.symbol = await tokenSymbol(rpc, r.token);
    r.decimals = await tokenDecimals(rpc, r.token);
  });

  results.sort((a, b) => b.launchBlock - a.launchBlock || b.launchTx.localeCompare(a.launchTx));
  return {
    rpcUrl: options.rpcUrl,
    hours: options.hours,
    headBlock: head,
    headTime,
    requestedFrom,
    coveredFrom: paged.coveredFrom,
    coveredFromTime,
    launchesFound: paged.logs.length,
    results,
    failures,
  };
}

async function checkLaunch(rpc: Rpc, createdLog: RpcLog, head: number): Promise<LaunchResult> {
  const token = topicToAddress(createdLog.topics[1]!);
  const tokenAdmin = topicToAddress(createdLog.topics[2]!);
  const launchTx = createdLog.transactionHash.toLowerCase();
  const launchBlock = Number(BigInt(createdLog.blockNumber));

  const tx = await rpc.call<RpcTx | null>("eth_getTransactionByHash", [launchTx]);
  if (!tx) throw new Error(`launch transaction ${launchTx} not found`);
  const launchWallet = tx.from.toLowerCase();
  const launchTime = await blockTime(rpc, launchBlock);

  const txLogs = await launchTxTransferLogs(rpc, launchTx, launchBlock, token, launchWallet);
  const received = devBuyAmount(txLogs, token, launchWallet);

  const windowEnd = launchBlock + DUMP_WINDOW_BLOCKS;
  const result: LaunchResult = {
    token,
    tokenAdmin,
    launchTx,
    launchBlock,
    launchTime,
    launchWallet,
    received,
    ninetyBlock: null,
    windowComplete: head >= windowEnd,
  };
  if (received === 0n || launchBlock + 1 > head) return result;

  const outgoingLogs = await getLogsPaged(
    rpc,
    { address: token, topics: [TRANSFER_TOPIC, addressToTopic(launchWallet)] },
    launchBlock + 1,
    Math.min(head, windowEnd),
  );
  if (outgoingLogs.coveredFrom > launchBlock + 1) {
    throw new Error(`RPC does not serve logs back to block ${launchBlock + 1}`);
  }
  const outgoing = outgoingLogs.logs
    .map(parseTransfer)
    .filter((t): t is Transfer => t !== null && t.from === launchWallet && t.to !== launchWallet);
  result.ninetyBlock = firstBlockAtNinetyPercent(received, outgoing, launchBlock, DUMP_WINDOW_BLOCKS);
  return result;
}

/**
 * The launch receipt's logs. Some public nodes refuse receipts for anything but the newest blocks,
 * so on failure this falls back to eth_getLogs for the token's Transfer logs to the launch wallet
 * in the launch block, restricted to the launch transaction. Both give the same Transfer logs.
 */
async function launchTxTransferLogs(
  rpc: Rpc,
  launchTx: string,
  launchBlock: number,
  token: string,
  launchWallet: string,
): Promise<RpcLog[]> {
  try {
    const receipt = await rpc.call<RpcReceipt | null>("eth_getTransactionReceipt", [launchTx]);
    if (receipt) return receipt.logs;
  } catch (err) {
    if (!(err instanceof RpcError)) throw err;
  }
  const logs = await getLogs(
    rpc,
    { address: token, topics: [TRANSFER_TOPIC, null, addressToTopic(launchWallet)] },
    { from: launchBlock, to: launchBlock },
  );
  return logs.filter((l) => l.transactionHash.toLowerCase() === launchTx);
}

const blockTimeCache = new Map<number, Promise<Date>>();

async function blockTime(rpc: Rpc, block: number): Promise<Date> {
  let cached = blockTimeCache.get(block);
  if (!cached) {
    cached = rpc.call<RpcBlock | null>("eth_getBlockByNumber", [toHex(block), false]).then((b) => {
      if (!b) throw new Error(`block ${block} not found`);
      return new Date(Number(BigInt(b.timestamp)) * 1000);
    });
    blockTimeCache.set(block, cached);
    cached.catch(() => blockTimeCache.delete(block));
  }
  return cached;
}

async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++]!;
      await fn(item);
    }
  });
  await Promise.all(workers);
}
