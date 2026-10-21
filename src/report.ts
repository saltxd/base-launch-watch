import { BASESCAN, BLOCKS_PER_HOUR, SECONDS_PER_BLOCK } from "./constants.js";
import { fromFlaggedEntry, type FlaggedEntry, type ScanRecord } from "./history.js";
import type { LaunchResult, ScanResult } from "./watch.js";

export const DISCLAIMER = [
  "> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.",
  "> \"Sent out\" means the tokens left that wallet. It is not proof of a sale.",
  "> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.",
].join("\n");

export function formatUnits(value: bigint, decimals: number, maxFraction = 2): string {
  const base = 10n ** BigInt(decimals);
  const scale = 10n ** BigInt(maxFraction);
  const scaled = (value * scale + base / 2n) / base;
  const whole = scaled / scale;
  const frac = (scaled % scale).toString().padStart(maxFraction, "0").replace(/0+$/, "");
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

export function formatUtc(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

/**
 * The RPC endpoint's host only. Paid endpoints often carry an API key in the path, query or
 * user info, and the report is published, so the full URL must never appear in it.
 */
export function rpcHost(url: string): string {
  try {
    return new URL(url).host || "unknown host";
  } catch {
    return "unknown host";
  }
}

export function minutesUntilNinety(r: LaunchResult): number | null {
  if (r.ninetyBlock === null) return null;
  return ((r.ninetyBlock - r.launchBlock) * SECONDS_PER_BLOCK) / 60;
}

/** Keeps arbitrary on-chain token symbols from breaking the markdown table. */
export function sanitizeSymbol(symbol: string): string {
  const clean = symbol
    .replace(/[\u0000-\u001f\u007f\u2013\u2014]/g, " ")
    .replace(/[|`*_[\]<>\\]/g, "")
    .trim();
  const short = [...clean].slice(0, 24).join("");
  return short || "?";
}

export const REPEAT_WINDOW_DAYS = 7;

export interface ReportInput {
  /** The scan that just ran. Its head block is the end of the report window. */
  scan: ScanResult;
  /** All flagged launches from history/flagged.jsonl, including the ones from `scan`. */
  flagged: FlaggedEntry[];
  /** All scan records from history/scans.jsonl, including the one for `scan`. */
  scans: ScanRecord[];
}

export interface BlockRange {
  from: number;
  to: number;
}

export function renderReport(input: ReportInput): string {
  const { scan } = input;
  const windowFrom = scan.requestedFrom;
  const flagged = input.flagged
    .filter((e) => e.launchBlock >= windowFrom && e.launchBlock <= scan.headBlock)
    .map(fromFlaggedEntry)
    .sort((a, b) => b.launchBlock - a.launchBlock || b.launchTx.localeCompare(a.launchTx));
  const withDevBuy = scan.results.filter((r) => r.received > 0n);
  const flaggedThisScan = scan.results.filter((r) => r.ninetyBlock !== null);

  const lines: string[] = [];
  lines.push("# Base launch watch");
  lines.push("");
  lines.push(DISCLAIMER);
  lines.push("");
  lines.push(
    `New Clanker v4 launches on Base from the last ${scan.hours} hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.`,
  );
  lines.push("");
  lines.push(`Generated ${formatUtc(scan.headTime)} UTC at block ${scan.headBlock}.`);
  lines.push("");

  if (flagged.length === 0) {
    lines.push("_No launches in the checked window matched the rule._");
  } else {
    lines.push(
      "| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |",
    );
    lines.push("| --- | --- | --- | --- | ---: | ---: | --- |");
    for (const r of flagged) {
      const minutes = minutesUntilNinety(r)!;
      lines.push(
        [
          "",
          sanitizeSymbol(r.symbol ?? "?"),
          `\`${r.token}\``,
          formatUtc(r.launchTime),
          `\`${r.launchWallet}\``,
          formatUnits(r.received, r.decimals ?? 18),
          minutes.toFixed(1),
          `[token](${BASESCAN}/token/${r.token}), [launch tx](${BASESCAN}/tx/${r.launchTx})`,
          "",
        ]
          .join(" | ")
          .trim(),
      );
    }
  }
  lines.push("");
  lines.push(
    `Launches flagged in the last ${scan.hours} hours: ${flagged.length}. Latest scan: launches checked: ${scan.results.length}. Launches with a dev buy: ${withDevBuy.length}. Launches flagged: ${flaggedThisScan.length}.`,
  );
  lines.push("");
  lines.push(...repeatWalletSection(input));
  lines.push("");
  lines.push(...coverageNotes(input));
  return lines.join("\n") + "\n";
}

export interface RepeatWallet {
  wallet: string;
  /** Newest launch first. */
  launches: FlaggedEntry[];
}

/** Launch wallets with more than one flagged launch at or after `fromBlock`, most recent launch first. */
export function repeatWallets(entries: FlaggedEntry[], fromBlock: number, toBlock: number): RepeatWallet[] {
  const byWallet = new Map<string, FlaggedEntry[]>();
  for (const e of entries) {
    if (e.launchBlock < fromBlock || e.launchBlock > toBlock) continue;
    const key = e.launchWallet.toLowerCase();
    const list = byWallet.get(key) ?? [];
    list.push(e);
    byWallet.set(key, list);
  }
  const newestFirst = (a: FlaggedEntry, b: FlaggedEntry) =>
    b.launchBlock - a.launchBlock || b.launchTx.localeCompare(a.launchTx) || b.token.localeCompare(a.token);
  return [...byWallet.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([wallet, list]) => ({ wallet, launches: list.sort(newestFirst) }))
    .sort((a, b) => newestFirst(a.launches[0]!, b.launches[0]!) || a.wallet.localeCompare(b.wallet));
}

function repeatWalletSection({ scan, flagged, scans }: ReportInput): string[] {
  const out: string[] = [];
  const fromBlock = Math.max(0, scan.headBlock - REPEAT_WINDOW_DAYS * 24 * BLOCKS_PER_HOUR + 1);
  out.push(`## Launch wallets flagged more than once (last ${REPEAT_WINDOW_DAYS} days)`);
  out.push("");
  const repeats = repeatWallets(flagged, fromBlock, scan.headBlock);
  if (repeats.length === 0) {
    out.push(`_No launch wallet was flagged more than once in the last ${REPEAT_WINDOW_DAYS} days._`);
  } else {
    out.push("| Launch wallet | Flagged launches | Token addresses (newest first) |");
    out.push("| --- | ---: | --- |");
    for (const r of repeats) {
      const tokens = r.launches.map((e) => `\`${e.token}\``).join(", ");
      out.push(`| [\`${r.wallet}\`](${BASESCAN}/address/${r.wallet}) | ${r.launches.length} | ${tokens} |`);
    }
  }
  out.push("");
  const covered = coveredBlocks(scans, fromBlock, scan.headBlock);
  const total = scan.headBlock - fromBlock + 1;
  const coveredHours = (covered * SECONDS_PER_BLOCK) / 3600;
  if (covered < total) {
    out.push(
      `Based on the saved scan history, which covers about ${coveredHours.toFixed(1)} of the last ${REPEAT_WINDOW_DAYS * 24} hours. Launches outside the scanned blocks are not counted.`,
    );
  } else {
    out.push(`Based on the saved scan history, which covers the full ${REPEAT_WINDOW_DAYS} days.`);
  }
  return out;
}

/** Merges the block ranges the scans read logs for, clipped to [from, to]. */
export function coveredRanges(scans: ScanRecord[], from: number, to: number): BlockRange[] {
  const ranges = scans
    .map((s) => ({ from: Math.max(s.coveredFrom, from), to: Math.min(s.headBlock, to) }))
    .filter((r) => r.from <= r.to)
    .sort((a, b) => a.from - b.from);
  const merged: BlockRange[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.from <= last.to + 1) last.to = Math.max(last.to, r.to);
    else merged.push({ ...r });
  }
  return merged;
}

/** The parts of [from, to] that no scan covered. */
export function uncoveredRanges(scans: ScanRecord[], from: number, to: number): BlockRange[] {
  const gaps: BlockRange[] = [];
  let next = from;
  for (const r of coveredRanges(scans, from, to)) {
    if (r.from > next) gaps.push({ from: next, to: r.from - 1 });
    next = r.to + 1;
  }
  if (next <= to) gaps.push({ from: next, to });
  return gaps;
}

function coveredBlocks(scans: ScanRecord[], from: number, to: number): number {
  return coveredRanges(scans, from, to).reduce((n, r) => n + r.to - r.from + 1, 0);
}

/** Estimated time of a block, from the scan head and 2 seconds per block. */
function blockTimeEstimate(scan: ScanResult, block: number): Date {
  return new Date(scan.headTime.getTime() - (scan.headBlock - block) * SECONDS_PER_BLOCK * 1000);
}

function coverageNotes({ scan, scans }: ReportInput): string[] {
  const notes: string[] = [];
  const windowFrom = scan.requestedFrom;
  const head = scan.headBlock;
  const windowScans = scans.filter((s) => s.headBlock >= windowFrom && s.coveredFrom <= head);
  const gaps = uncoveredRanges(scans, windowFrom, head);
  const coveredHours = (coveredBlocks(scans, windowFrom, head) * SECONDS_PER_BLOCK) / 3600;
  const latestHours = ((head - scan.coveredFrom + 1) * SECONDS_PER_BLOCK) / 3600;

  notes.push("## Coverage");
  notes.push("");
  notes.push(`- Requested window: last ${scan.hours} hours, blocks ${windowFrom} to ${head}.`);
  notes.push(
    `- This report merges ${windowScans.length} scan(s) that read logs in this window. Flagged launches are kept in \`history/flagged.jsonl\` (one line per token) and each scan's block range in \`history/scans.jsonl\`.`,
  );
  if (gaps.length > 0) {
    const list = gaps
      .map(
        (g) =>
          `blocks ${g.from} to ${g.to} (about ${formatUtc(blockTimeEstimate(scan, g.from))} to ${formatUtc(blockTimeEstimate(scan, g.to))} UTC)`,
      )
      .join("; ");
    notes.push(
      `- **Partial window.** The scans covered about ${coveredHours.toFixed(1)} of ${scan.hours} hours. Not covered: ${list}. Launches in those blocks were not checked. Use \`--rpc\` with a node that serves older logs for the full window.`,
    );
  } else {
    notes.push(`- Full window covered by the merged scans.`);
  }
  if (scan.coveredFrom > scan.requestedFrom) {
    notes.push(
      `- Latest scan: the RPC (${rpcHost(scan.rpcUrl)}) only served logs from block ${scan.coveredFrom} (${formatUtc(scan.coveredFromTime)} UTC), about ${latestHours.toFixed(1)} hours.`,
    );
  } else {
    notes.push(`- Latest scan: full window served (${rpcHost(scan.rpcUrl)}).`);
  }
  const open = scan.results.filter((r) => r.received > 0n && !r.windowComplete && r.ninetyBlock === null).length;
  if (open > 0) {
    notes.push(
      `- ${open} launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.`,
    );
  }
  if (scan.failures.length > 0) {
    notes.push(
      `- ${scan.failures.length} launch(es) could not be checked in the latest scan because of RPC errors and are not counted above.`,
    );
  }
  notes.push(
    "- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.",
  );
  return notes;
}
