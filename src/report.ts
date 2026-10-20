import { BASESCAN, SECONDS_PER_BLOCK } from "./constants.js";
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

export function renderReport(scan: ScanResult): string {
  const flagged = scan.results.filter((r) => r.ninetyBlock !== null);
  const withDevBuy = scan.results.filter((r) => r.received > 0n);

  const lines: string[] = [];
  lines.push("# Base launch watch");
  lines.push("");
  lines.push(DISCLAIMER);
  lines.push("");
  lines.push(
    `New Clanker v4 launches on Base whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.`,
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
    `Launches checked: ${scan.results.length}. Launches with a dev buy: ${withDevBuy.length}. Launches flagged: ${flagged.length}.`,
  );
  lines.push("");
  lines.push(...coverageNotes(scan));
  return lines.join("\n") + "\n";
}

function coverageNotes(scan: ScanResult): string[] {
  const notes: string[] = [];
  const requestedHours = scan.hours;
  const coveredBlocks = scan.headBlock - scan.coveredFrom + 1;
  const coveredHours = (coveredBlocks * SECONDS_PER_BLOCK) / 3600;
  notes.push("## Coverage");
  notes.push("");
  notes.push(`- Requested window: last ${requestedHours} hours, blocks ${scan.requestedFrom} to ${scan.headBlock}.`);
  if (scan.coveredFrom > scan.requestedFrom) {
    notes.push(
      `- **Partial window.** The RPC (${scan.rpcUrl}) only served logs from block ${scan.coveredFrom} (${formatUtc(scan.coveredFromTime)} UTC), about ${coveredHours.toFixed(1)} hours. Launches before that were not checked. Use \`--rpc\` with a node that serves older logs for the full window.`,
    );
  } else {
    notes.push(`- Full window covered (${scan.rpcUrl}).`);
  }
  const open = scan.results.filter((r) => r.received > 0n && !r.windowComplete && r.ninetyBlock === null).length;
  if (open > 0) {
    notes.push(`- ${open} launch(es) with a dev buy are less than an hour old; their hour was only partly observed.`);
  }
  if (scan.failures.length > 0) {
    notes.push(`- ${scan.failures.length} launch(es) could not be checked because of RPC errors and are not counted above.`);
  }
  notes.push(
    "- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.",
  );
  return notes;
}
