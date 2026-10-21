import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { LaunchResult, ScanResult } from "./watch.js";

/** One flagged launch, as stored in history/flagged.jsonl. */
export interface FlaggedEntry {
  token: string;
  symbol: string | null;
  decimals: number | null;
  tokenAdmin: string;
  launchTx: string;
  launchBlock: number;
  /** ISO 8601, UTC. */
  launchTime: string;
  launchWallet: string;
  /** Raw token units, as a decimal string (JSON has no bigint). */
  received: string;
  ninetyBlock: number;
  /** ISO 8601 head time of the scan that first flagged this launch. */
  firstSeenAt: string;
}

/** One scan run, as stored in history/scans.jsonl. Used for coverage notes across runs. */
export interface ScanRecord {
  headBlock: number;
  /** ISO 8601, UTC. */
  headTime: string;
  requestedFrom: number;
  coveredFrom: number;
  /** ISO 8601, UTC. */
  coveredFromTime: string;
  launchesChecked: number;
  withDevBuy: number;
  flagged: number;
  failures: number;
}

export function toFlaggedEntry(r: LaunchResult, seenAt: Date): FlaggedEntry {
  if (r.ninetyBlock === null) throw new Error(`launch ${r.token} is not flagged`);
  return {
    token: r.token.toLowerCase(),
    symbol: r.symbol ?? null,
    decimals: r.decimals ?? null,
    tokenAdmin: r.tokenAdmin.toLowerCase(),
    launchTx: r.launchTx.toLowerCase(),
    launchBlock: r.launchBlock,
    launchTime: r.launchTime.toISOString(),
    launchWallet: r.launchWallet.toLowerCase(),
    received: r.received.toString(),
    ninetyBlock: r.ninetyBlock,
    firstSeenAt: seenAt.toISOString(),
  };
}

export function fromFlaggedEntry(e: FlaggedEntry): LaunchResult {
  return {
    token: e.token,
    tokenAdmin: e.tokenAdmin,
    launchTx: e.launchTx,
    launchBlock: e.launchBlock,
    launchTime: new Date(e.launchTime),
    launchWallet: e.launchWallet,
    received: BigInt(e.received),
    ninetyBlock: e.ninetyBlock,
    windowComplete: true,
    symbol: e.symbol ?? undefined,
    decimals: e.decimals ?? undefined,
  };
}

export function toScanRecord(scan: ScanResult): ScanRecord {
  return {
    headBlock: scan.headBlock,
    headTime: scan.headTime.toISOString(),
    requestedFrom: scan.requestedFrom,
    coveredFrom: scan.coveredFrom,
    coveredFromTime: scan.coveredFromTime.toISOString(),
    launchesChecked: scan.results.length,
    withDevBuy: scan.results.filter((r) => r.received > 0n).length,
    flagged: scan.results.filter((r) => r.ninetyBlock !== null).length,
    failures: scan.failures.length,
  };
}

/**
 * Adds newly flagged launches to the history, one entry per token address. An entry already in
 * the history is kept as first recorded; only its missing symbol or decimals are filled in.
 * The result is sorted oldest launch first, so new launches append to the end of the file.
 */
export function mergeFlagged(existing: FlaggedEntry[], incoming: FlaggedEntry[]): { entries: FlaggedEntry[]; added: number } {
  const byToken = new Map<string, FlaggedEntry>();
  for (const e of existing) {
    const key = e.token.toLowerCase();
    if (!byToken.has(key)) byToken.set(key, e);
  }
  let added = 0;
  for (const e of incoming) {
    const key = e.token.toLowerCase();
    const prev = byToken.get(key);
    if (!prev) {
      byToken.set(key, e);
      added++;
    } else if (prev.symbol === null || prev.decimals === null) {
      byToken.set(key, { ...prev, symbol: prev.symbol ?? e.symbol, decimals: prev.decimals ?? e.decimals });
    }
  }
  const entries = [...byToken.values()].sort(
    (a, b) => a.launchBlock - b.launchBlock || a.launchTx.localeCompare(b.launchTx) || a.token.localeCompare(b.token),
  );
  return { entries, added };
}

export function parseJsonl<T>(text: string, file: string, check: (v: unknown) => v is T): T[] {
  const out: T[] = [];
  text.split("\n").forEach((line, i) => {
    if (line.trim() === "") return;
    let value: unknown;
    try {
      value = JSON.parse(line);
    } catch {
      throw new Error(`${file}:${i + 1}: not valid JSON`);
    }
    if (!check(value)) throw new Error(`${file}:${i + 1}: unexpected record shape`);
    out.push(value);
  });
  return out;
}

export function toJsonl(items: unknown[]): string {
  return items.map((i) => JSON.stringify(i) + "\n").join("");
}

export function isFlaggedEntry(v: unknown): v is FlaggedEntry {
  if (typeof v !== "object" || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.token === "string" &&
    (e.symbol === null || typeof e.symbol === "string") &&
    (e.decimals === null || typeof e.decimals === "number") &&
    typeof e.tokenAdmin === "string" &&
    typeof e.launchTx === "string" &&
    typeof e.launchBlock === "number" &&
    typeof e.launchTime === "string" &&
    !Number.isNaN(Date.parse(e.launchTime)) &&
    typeof e.launchWallet === "string" &&
    typeof e.received === "string" &&
    /^\d+$/.test(e.received) &&
    typeof e.ninetyBlock === "number" &&
    typeof e.firstSeenAt === "string"
  );
}

export function isScanRecord(v: unknown): v is ScanRecord {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.headBlock === "number" &&
    typeof s.headTime === "string" &&
    typeof s.requestedFrom === "number" &&
    typeof s.coveredFrom === "number" &&
    typeof s.coveredFromTime === "string" &&
    typeof s.launchesChecked === "number" &&
    typeof s.withDevBuy === "number" &&
    typeof s.flagged === "number" &&
    typeof s.failures === "number"
  );
}

export async function readJsonl<T>(file: string, check: (v: unknown) => v is T): Promise<T[]> {
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  return parseJsonl(text, file, check);
}

/** Writes via a temp file and rename, so an interrupted run cannot leave a half-written history. */
export async function writeJsonl(file: string, items: unknown[]): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, toJsonl(items), "utf8");
  await rename(tmp, file);
}
