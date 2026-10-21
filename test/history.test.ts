import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  fromFlaggedEntry,
  isFlaggedEntry,
  mergeFlagged,
  parseJsonl,
  readJsonl,
  toFlaggedEntry,
  toJsonl,
  writeJsonl,
  type FlaggedEntry,
} from "../src/history.js";
import type { LaunchResult } from "../src/watch.js";

function launch(token: string, launchBlock: number, overrides: Partial<LaunchResult> = {}): LaunchResult {
  return {
    token,
    tokenAdmin: "0x2222222222222222222222222222222222222222",
    launchTx: "0x" + launchBlock.toString(16).padStart(64, "0"),
    launchBlock,
    launchTime: new Date(Date.UTC(2026, 9, 20) + launchBlock * 2000),
    launchWallet: "0x3333333333333333333333333333333333333333",
    received: 123456789012345678901234567890n,
    ninetyBlock: launchBlock + 10,
    windowComplete: true,
    symbol: "TKN",
    decimals: 18,
    ...overrides,
  };
}

const A = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const B = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const C = "0xcccccccccccccccccccccccccccccccccccccccc";
const firstSeen = new Date("2026-10-20T08:17:00Z");
const laterSeen = new Date("2026-10-20T12:17:00Z");

describe("history", () => {
  it("round-trips a flagged launch through JSONL, including bigint amounts", () => {
    const r = launch(A, 100);
    const entry = toFlaggedEntry(r, firstSeen);
    const [parsed] = parseJsonl(toJsonl([entry]), "flagged.jsonl", isFlaggedEntry);
    expect(parsed).toEqual(entry);
    expect(fromFlaggedEntry(parsed!)).toEqual(r);
  });

  it("refuses to store a launch that was not flagged", () => {
    expect(() => toFlaggedEntry(launch(A, 100, { ninetyBlock: null }), firstSeen)).toThrow(/not flagged/);
  });

  it("merges new launches, dedupes by token address and keeps the first record", () => {
    const existing = [toFlaggedEntry(launch(B, 200), firstSeen), toFlaggedEntry(launch(A, 100), firstSeen)];
    // The next scan overlaps: it flags B again (upper-case address) and finds C.
    const incoming = [
      toFlaggedEntry(launch(B.toUpperCase().replace("0X", "0x"), 200), laterSeen),
      toFlaggedEntry(launch(C, 300), laterSeen),
    ];
    const { entries, added } = mergeFlagged(existing, incoming);
    expect(added).toBe(1);
    expect(entries.map((e) => e.token)).toEqual([A, B, C]);
    expect(entries.find((e) => e.token === B)!.firstSeenAt).toBe(firstSeen.toISOString());
    expect(entries.find((e) => e.token === C)!.firstSeenAt).toBe(laterSeen.toISOString());
  });

  it("dedupes within one batch and fills in a missing symbol from a later scan", () => {
    const noSymbol: FlaggedEntry = { ...toFlaggedEntry(launch(A, 100), firstSeen), symbol: null, decimals: null };
    const { entries, added } = mergeFlagged([noSymbol], [toFlaggedEntry(launch(A, 100), laterSeen), toFlaggedEntry(launch(A, 100), laterSeen)]);
    expect(added).toBe(0);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.symbol).toBe("TKN");
    expect(entries[0]!.decimals).toBe(18);
    expect(entries[0]!.firstSeenAt).toBe(firstSeen.toISOString());
  });

  it("is a no-op when merging the same scan twice", () => {
    const batch = [toFlaggedEntry(launch(A, 100), firstSeen), toFlaggedEntry(launch(B, 200), firstSeen)];
    const once = mergeFlagged([], batch);
    const twice = mergeFlagged(once.entries, batch);
    expect(twice.added).toBe(0);
    expect(toJsonl(twice.entries)).toBe(toJsonl(once.entries));
  });

  it("reads a missing file as empty, writes one line per launch, and rejects corrupt lines", async () => {
    const dir = await mkdtemp(join(tmpdir(), "blw-"));
    const file = join(dir, "history", "flagged.jsonl");
    expect(await readJsonl(file, isFlaggedEntry)).toEqual([]);

    const entries = [toFlaggedEntry(launch(A, 100), firstSeen), toFlaggedEntry(launch(B, 200), firstSeen)];
    await writeJsonl(file, entries);
    const text = await readFile(file, "utf8");
    expect(text.trimEnd().split("\n")).toHaveLength(2);
    expect(await readJsonl(file, isFlaggedEntry)).toEqual(entries);

    await writeFile(file, text + "{not json\n", "utf8");
    await expect(readJsonl(file, isFlaggedEntry)).rejects.toThrow(/flagged\.jsonl:3: not valid JSON/);
    await writeFile(file, text + '{"token":"0x1"}\n', "utf8");
    await expect(readJsonl(file, isFlaggedEntry)).rejects.toThrow(/flagged\.jsonl:3: unexpected record shape/);
  });
});
