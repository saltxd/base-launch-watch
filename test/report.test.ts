import { describe, expect, it } from "vitest";
import { toFlaggedEntry, toScanRecord, type FlaggedEntry, type ScanRecord } from "../src/history.js";
import { formatUnits, renderReport, repeatWallets, rpcHost, sanitizeSymbol, uncoveredRanges } from "../src/report.js";
import type { LaunchResult, ScanResult } from "../src/watch.js";

const E = 10n ** 18n;

function launch(overrides: Partial<LaunchResult>): LaunchResult {
  return {
    token: "0x1111111111111111111111111111111111111111",
    tokenAdmin: "0x2222222222222222222222222222222222222222",
    launchTx: "0x" + "ab".repeat(32),
    launchBlock: 1000,
    launchTime: new Date("2026-10-20T10:00:00Z"),
    launchWallet: "0x2222222222222222222222222222222222222222",
    received: 0n,
    ninetyBlock: null,
    windowComplete: true,
    ...overrides,
  };
}

const scanResult: ScanResult = {
  rpcUrl: "http://fake",
  hours: 24,
  headBlock: 50000,
  headTime: new Date("2026-10-20T12:00:00Z"),
  requestedFrom: 6801,
  coveredFrom: 6801,
  coveredFromTime: new Date("2026-10-19T12:00:00Z"),
  launchesFound: 3,
  results: [
    launch({ launchBlock: 30000, received: 1234567n * E, ninetyBlock: 30090, symbol: "NEW|ER", decimals: 18 }),
    launch({ launchBlock: 20000, received: 5n * E }),
    launch({ launchBlock: 10000 }),
  ],
  failures: [],
};

describe("report", () => {
  it("formats token amounts", () => {
    expect(formatUnits(1234567n * E + 5n * 10n ** 15n, 18)).toBe("1,234,567.01");
    expect(formatUnits(0n, 18)).toBe("0");
  });

  it("sanitizes symbols for markdown", () => {
    expect(sanitizeSymbol("a|b`c\n")).toBe("abc");
    expect(sanitizeSymbol("")).toBe("?");
  });

  it("renders the table, summary line, disclaimer and no em dashes", () => {
    const flagged = scanResult.results.filter((r) => r.ninetyBlock !== null).map((r) => toFlaggedEntry(r, scanResult.headTime));
    const md = renderReport({ scan: scanResult, flagged, scans: [toScanRecord(scanResult)] });
    expect(md).toContain("On-chain facts only");
    expect(md).toContain("| NEWER | `0x1111111111111111111111111111111111111111` | 2026-10-20 10:00 |");
    expect(md).toContain("| 1,234,567 | 3.0 |");
    expect(md).toContain(
      "Launches flagged in the last 24 hours: 1. Latest scan: launches checked: 3. Launches with a dev buy: 2. Launches flagged: 1.",
    );
    expect(md).toContain("- Full window covered by the merged scans.");
    expect(md).not.toMatch(/\u2014/);
  });
});

const HEAD = 400_000;
const HEAD_TIME = new Date("2026-10-21T12:00:00Z");
const DAY = 24 * 1800;

function addr(n: number): string {
  return "0x" + n.toString(16).padStart(40, "0");
}

/** A flagged history entry launched `blocksAgo` blocks before HEAD. */
function entry(token: number, wallet: number, blocksAgo: number): FlaggedEntry {
  const launchBlock = HEAD - blocksAgo;
  return {
    token: addr(token),
    symbol: `T${token}`,
    decimals: 18,
    tokenAdmin: addr(wallet),
    launchTx: "0x" + token.toString(16).padStart(64, "0"),
    launchBlock,
    launchTime: new Date(HEAD_TIME.getTime() - blocksAgo * 2000).toISOString(),
    launchWallet: addr(wallet),
    received: (100n * E).toString(),
    ninetyBlock: launchBlock + 30,
    firstSeenAt: HEAD_TIME.toISOString(),
  };
}

function scanRecord(coveredFrom: number, headBlock: number): ScanRecord {
  return {
    headBlock,
    headTime: HEAD_TIME.toISOString(),
    requestedFrom: headBlock - DAY + 1,
    coveredFrom,
    coveredFromTime: HEAD_TIME.toISOString(),
    launchesChecked: 0,
    withDevBuy: 0,
    flagged: 0,
    failures: 0,
  };
}

const latestScan: ScanResult = {
  rpcUrl: "http://fake",
  hours: 24,
  headBlock: HEAD,
  headTime: HEAD_TIME,
  requestedFrom: HEAD - DAY + 1,
  coveredFrom: HEAD - 10_000,
  coveredFromTime: new Date(HEAD_TIME.getTime() - 10_000 * 2000),
  launchesFound: 0,
  results: [],
  failures: [],
};

describe("report from history", () => {
  const history = [
    entry(1, 0xa, 2 * DAY), // older than 24 h, inside 7 days
    entry(2, 0xa, 100), // newest
    entry(3, 0xb, 3 * DAY),
    entry(4, 0xb, 6 * DAY),
    entry(5, 0xb, 8 * DAY), // older than 7 days
    entry(6, 0xc, 500), // wallet c flagged once
    entry(7, 0xd, 8 * DAY), // wallet d: both launches older than 7 days
    entry(8, 0xd, 9 * DAY),
  ];
  // Scans every 4 hours, each serving 10,000 blocks: the whole last 7 days without gaps.
  const scans = Array.from({ length: 43 }, (_, i) => {
    const head = HEAD - i * 7200;
    return scanRecord(head - 10_000, head);
  });

  it("lists only launches from the last 24 hours of history, newest first", () => {
    const md = renderReport({ scan: latestScan, flagged: history, scans });
    const table = md.slice(md.indexOf("| Token |"), md.indexOf("Launches flagged in the last"));
    const rows = table.split("\n").filter((l) => /^\| T\d/.test(l));
    expect(rows.map((r) => r.split(" | ")[0])).toEqual(["| T2", "| T6"]);
    expect(md).toContain("Launches flagged in the last 24 hours: 2. Latest scan: launches checked: 0.");
    expect(md).toContain("- This report merges 6 scan(s)");
    expect(md).toContain("- Full window covered by the merged scans.");
  });

  it("groups repeat launch wallets in the last 7 days, newest first", () => {
    const repeats = repeatWallets(history, HEAD - 7 * DAY + 1, HEAD);
    expect(repeats.map((r) => r.wallet)).toEqual([addr(0xa), addr(0xb)]);
    expect(repeats[0]!.launches.map((e) => e.token)).toEqual([addr(2), addr(1)]);
    expect(repeats[1]!.launches.map((e) => e.token)).toEqual([addr(3), addr(4)]);
  });

  it("renders the repeat wallet section", () => {
    const md = renderReport({ scan: latestScan, flagged: history, scans });
    const section = md.slice(md.indexOf("## Launch wallets flagged more than once (last 7 days)"), md.indexOf("## Coverage"));
    expect(section).toContain("| Launch wallet | Flagged launches | Token addresses (newest first) |");
    expect(section).toContain(`| [\`${addr(0xa)}\`](https://basescan.org/address/${addr(0xa)}) | 2 | \`${addr(2)}\`, \`${addr(1)}\` |`);
    expect(section).toContain(`| 2 | \`${addr(3)}\`, \`${addr(4)}\` |`);
    expect(section.indexOf(addr(0xa))).toBeLessThan(section.indexOf(addr(0xb)));
    expect(section).not.toContain(addr(0xc));
    expect(section).not.toContain(addr(0xd));
    expect(section).not.toContain(addr(5));
    expect(section).toContain("covers the full 7 days");
    expect(md).toContain("On-chain facts only");
  });

  it("says so when no wallet repeats and when history covers less than 7 days", () => {
    const md = renderReport({ scan: latestScan, flagged: [entry(6, 0xc, 500)], scans: [scanRecord(HEAD - 10_000, HEAD)] });
    expect(md).toContain("_No launch wallet was flagged more than once in the last 7 days._");
    expect(md).toContain("covers about 5.6 of the last 168 hours");
  });

  it("reports the blocks no scan covered", () => {
    const scansWithGap = [scanRecord(HEAD - 10_000, HEAD), scanRecord(HEAD - 30_000, HEAD - 20_000)];
    expect(uncoveredRanges(scansWithGap, HEAD - DAY + 1, HEAD)).toEqual([
      { from: HEAD - DAY + 1, to: HEAD - 30_001 },
      { from: HEAD - 19_999, to: HEAD - 10_001 },
    ]);
    const md = renderReport({ scan: latestScan, flagged: [], scans: scansWithGap });
    expect(md).toContain("**Partial window.** The scans covered about 11.1 of 24 hours.");
    expect(md).toContain(`blocks ${HEAD - 19_999} to ${HEAD - 10_001}`);
    expect(md).toContain("_No launches in the checked window matched the rule._");
  });
});

describe("RPC URL in the report", () => {
  const secret = "sk_live_9f8e7d6c5b4a"; // gitleaks:allow (a fake key for the test)
  const urls = [
    `https://base-mainnet.g.alchemy.com/v2/${secret}`,
    `https://rpc.example.com/base?apikey=${secret}&x=1`,
    `https://user:${secret}@rpc.example.com:8545/`,
  ];

  it("keeps only the host", () => {
    expect(rpcHost("https://base-rpc.publicnode.com")).toBe("base-rpc.publicnode.com");
    expect(rpcHost(urls[0]!)).toBe("base-mainnet.g.alchemy.com");
    expect(rpcHost(urls[1]!)).toBe("rpc.example.com");
    expect(rpcHost(urls[2]!)).toBe("rpc.example.com:8545");
    expect(rpcHost(`not a url ${secret}`)).toBe("unknown host");
  });

  it.each(urls)("never prints a key from %s", (rpcUrl) => {
    // Both coverage branches: the RPC served only part of the window, and all of it.
    for (const coveredFrom of [latestScan.coveredFrom, latestScan.requestedFrom]) {
      const scan = { ...latestScan, rpcUrl, coveredFrom };
      const md = renderReport({ scan, flagged: [], scans: [toScanRecord(scan)] });
      expect(md).toContain(`(${rpcHost(rpcUrl)})`);
      expect(md).not.toContain(secret);
      expect(md).not.toContain(rpcUrl);
    }
  });
});
