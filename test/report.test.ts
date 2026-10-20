import { describe, expect, it } from "vitest";
import { formatUnits, renderReport, sanitizeSymbol } from "../src/report.js";
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
    launch({ launchBlock: 3000, received: 1234567n * E, ninetyBlock: 3090, symbol: "NEW|ER", decimals: 18 }),
    launch({ launchBlock: 2000, received: 5n * E }),
    launch({ launchBlock: 1000 }),
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
    const md = renderReport(scanResult);
    expect(md).toContain("On-chain facts only");
    expect(md).toContain("| NEWER | `0x1111111111111111111111111111111111111111` | 2026-10-20 10:00 |");
    expect(md).toContain("| 1,234,567 | 3.0 |");
    expect(md).toContain("Launches checked: 3. Launches with a dev buy: 2. Launches flagged: 1.");
    expect(md).not.toMatch(/\u2014/);
  });
});
