import { MAX_LOG_BLOCK_RANGE } from "./constants.js";
import { HistoryUnavailableError, toHex, type LogFilter, type Rpc, type RpcLog } from "./rpc.js";

export interface BlockRange {
  from: number;
  to: number;
}

/** Splits the inclusive range [from, to] into consecutive inclusive chunks of at most `size` blocks. */
export function chunkRanges(from: number, to: number, size = MAX_LOG_BLOCK_RANGE): BlockRange[] {
  if (!Number.isInteger(size) || size < 1) throw new Error(`invalid chunk size ${size}`);
  const ranges: BlockRange[] = [];
  for (let start = from; start <= to; start += size) {
    ranges.push({ from: start, to: Math.min(start + size - 1, to) });
  }
  return ranges;
}

export async function getLogs(rpc: Rpc, filter: LogFilter, range: BlockRange): Promise<RpcLog[]> {
  const logs = await rpc.call<RpcLog[]>("eth_getLogs", [
    { ...filter, fromBlock: toHex(range.from), toBlock: toHex(range.to) },
  ]);
  return logs.filter((l) => !l.removed);
}

export interface PagedLogs {
  logs: RpcLog[];
  /** First block actually covered. Greater than the requested `from` when the node does not serve older history. */
  coveredFrom: number;
  coveredTo: number;
}

export interface PagingOptions {
  chunkSize?: number;
  onChunk?: (range: BlockRange) => void;
}

/**
 * Fetches logs for [from, to] in chunks of at most `chunkSize` blocks, newest chunk first.
 * If the node refuses a chunk because it is older than the history it serves, the oldest
 * servable block inside that chunk is located by bisection and paging stops there.
 * Returned logs are sorted oldest first.
 */
export async function getLogsPaged(
  rpc: Rpc,
  filter: LogFilter,
  from: number,
  to: number,
  options: PagingOptions = {},
): Promise<PagedLogs> {
  const ranges = chunkRanges(from, to, options.chunkSize).reverse();
  const pages: RpcLog[][] = [];
  let coveredFrom = to + 1;

  for (const range of ranges) {
    options.onChunk?.(range);
    try {
      pages.push(await getLogs(rpc, filter, range));
      coveredFrom = range.from;
    } catch (err) {
      if (!(err instanceof HistoryUnavailableError)) throw err;
      const partial = await fetchServableTail(rpc, filter, range);
      if (partial) {
        pages.push(partial.logs);
        coveredFrom = partial.from;
      }
      break;
    }
  }

  const logs = pages.flat().sort(compareLogs);
  return { logs, coveredFrom, coveredTo: to };
}

/** Finds the oldest block in `range` the node still serves and returns logs from there to range.to. */
async function fetchServableTail(
  rpc: Rpc,
  filter: LogFilter,
  range: BlockRange,
): Promise<{ from: number; logs: RpcLog[] } | null> {
  let lo = range.from + 1;
  let hi = range.to + 1;
  let best: { from: number; logs: RpcLog[] } | null = null;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    try {
      const logs = await getLogs(rpc, filter, { from: mid, to: range.to });
      best = { from: mid, logs };
      hi = mid;
    } catch (err) {
      if (!(err instanceof HistoryUnavailableError)) throw err;
      lo = mid + 1;
    }
  }
  return best;
}

export function compareLogs(a: RpcLog, b: RpcLog): number {
  const byBlock = Number(BigInt(a.blockNumber) - BigInt(b.blockNumber));
  return byBlock !== 0 ? byBlock : Number(BigInt(a.logIndex) - BigInt(b.logIndex));
}
