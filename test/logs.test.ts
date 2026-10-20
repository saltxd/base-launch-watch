import { describe, expect, it } from "vitest";
import { chunkRanges, getLogsPaged } from "../src/logs.js";
import { HistoryUnavailableError, type Rpc, type RpcLog } from "../src/rpc.js";

interface GetLogsParams {
  fromBlock: string;
  toBlock: string;
}

/** A fake node holding one log per listed block. It enforces the 5,000 block limit and an optional history cutoff. */
class FakeNode implements Rpc {
  calls: { from: number; to: number }[] = [];

  constructor(
    private readonly logBlocks: number[],
    private readonly oldestServed = 0,
    private readonly maxRange = 5000,
  ) {}

  async call<T>(method: string, params: unknown[]): Promise<T> {
    if (method !== "eth_getLogs") throw new Error(`unexpected ${method}`);
    const p = params[0] as GetLogsParams;
    const from = Number(BigInt(p.fromBlock));
    const to = Number(BigInt(p.toBlock));
    this.calls.push({ from, to });
    if (to - from + 1 > this.maxRange) throw new Error("block range too large");
    if (from < this.oldestServed) throw new HistoryUnavailableError("Archive requests require a personal token");
    const logs: RpcLog[] = this.logBlocks
      .filter((b) => b >= from && b <= to)
      .map((b) => ({
        address: "0xe85a59c628f7d27878aceb4bf3b35733630083a9",
        topics: [],
        data: "0x",
        blockNumber: "0x" + b.toString(16),
        transactionHash: "0x" + b.toString(16).padStart(64, "0"),
        logIndex: "0x0",
      }));
    return logs as T;
  }
}

describe("chunkRanges", () => {
  it("splits an inclusive range into 5,000 block chunks", () => {
    expect(chunkRanges(100, 12099)).toEqual([
      { from: 100, to: 5099 },
      { from: 5100, to: 10099 },
      { from: 10100, to: 12099 },
    ]);
  });

  it("covers every block exactly once with no chunk over the limit", () => {
    const ranges = chunkRanges(52813000, 52856199);
    expect(ranges).toHaveLength(9);
    for (const r of ranges) expect(r.to - r.from + 1).toBeLessThanOrEqual(5000);
    for (let i = 1; i < ranges.length; i++) expect(ranges[i]!.from).toBe(ranges[i - 1]!.to + 1);
    expect(ranges[0]!.from).toBe(52813000);
    expect(ranges.at(-1)!.to).toBe(52856199);
  });

  it("handles a single block and an exact multiple", () => {
    expect(chunkRanges(7, 7)).toEqual([{ from: 7, to: 7 }]);
    expect(chunkRanges(1, 10000)).toEqual([
      { from: 1, to: 5000 },
      { from: 5001, to: 10000 },
    ]);
    expect(chunkRanges(10, 9)).toEqual([]);
  });

  it("rejects a bad chunk size", () => {
    expect(() => chunkRanges(1, 10, 0)).toThrow();
  });
});

describe("getLogsPaged", () => {
  it("pages the whole window in 5,000 block calls and returns logs oldest first", async () => {
    const blocks = [100, 5099, 5100, 9000, 12099, 12100];
    const node = new FakeNode(blocks);
    const res = await getLogsPaged(node, {}, 100, 12099);
    expect(node.calls).toEqual([
      { from: 10100, to: 12099 },
      { from: 5100, to: 10099 },
      { from: 100, to: 5099 },
    ]);
    expect(res.logs.map((l) => Number(BigInt(l.blockNumber)))).toEqual([100, 5099, 5100, 9000, 12099]);
    expect(res.coveredFrom).toBe(100);
    expect(res.coveredTo).toBe(12099);
  });

  it("stops at the node's history limit and reports the covered start", async () => {
    const blocks = [200, 3000, 7000, 7500, 11000];
    const node = new FakeNode(blocks, 6789);
    const res = await getLogsPaged(node, {}, 100, 12099);
    expect(res.coveredFrom).toBe(6789);
    expect(res.logs.map((l) => Number(BigInt(l.blockNumber)))).toEqual([7000, 7500, 11000]);
    expect(node.calls.every((c) => c.to - c.from + 1 <= 5000)).toBe(true);
    expect(node.calls.some((c) => c.from < 5100)).toBe(false);
  });

  it("reports nothing covered when even the newest chunk is refused", async () => {
    const node = new FakeNode([50], 10_000_000);
    const res = await getLogsPaged(node, {}, 0, 99);
    expect(res.logs).toEqual([]);
    expect(res.coveredFrom).toBe(100);
  });

  it("propagates errors that are not history limits", async () => {
    const node = new FakeNode([], 0, 10);
    await expect(getLogsPaged(node, {}, 0, 100, { chunkSize: 50 })).rejects.toThrow("block range too large");
  });
});
