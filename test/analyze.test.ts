import { describe, expect, it } from "vitest";
import {
  devBuyAmount,
  firstBlockAtNinetyPercent,
  parseTransfer,
  reachedNinetyPercent,
  type Transfer,
} from "../src/analyze.js";
import type { RpcLog } from "../src/rpc.js";
import receiptFixture from "./fixtures/launch-receipt.json" with { type: "json" };
import outgoingFixture from "./fixtures/outgoing-transfers.json" with { type: "json" };

const E = 10n ** 18n;
const WINDOW = 1800;

function transfer(blockNumber: number, logIndex: number, value: bigint): Transfer {
  return {
    token: "0x1111111111111111111111111111111111111111",
    from: "0x2222222222222222222222222222222222222222",
    to: "0x3333333333333333333333333333333333333333",
    value,
    blockNumber,
    logIndex,
    transactionHash: "0x" + "00".repeat(32),
  };
}

describe("reachedNinetyPercent", () => {
  it("uses exact integer math at the boundary", () => {
    expect(reachedNinetyPercent(90n, 100n)).toBe(true);
    expect(reachedNinetyPercent(89n, 100n)).toBe(false);
    expect(reachedNinetyPercent(899999999999999999n, 10n ** 18n)).toBe(false);
    expect(reachedNinetyPercent(9n * 10n ** 17n, 10n ** 18n)).toBe(true);
  });

  it("is never true when nothing was received", () => {
    expect(reachedNinetyPercent(0n, 0n)).toBe(false);
    expect(reachedNinetyPercent(5n, 0n)).toBe(false);
  });
});

describe("devBuyAmount", () => {
  const logs = receiptFixture.logs as RpcLog[];

  it("sums transfers of the token to the launch wallet from non-zero addresses", () => {
    expect(devBuyAmount(logs, receiptFixture.token, receiptFixture.wallet)).toBe(
      BigInt(receiptFixture.expectedReceived),
    );
  });

  it("is case insensitive on addresses", () => {
    expect(devBuyAmount(logs, receiptFixture.token.toUpperCase().replace("0X", "0x"), receiptFixture.wallet)).toBe(
      150n * E,
    );
  });

  it("returns zero when the wallet received nothing", () => {
    expect(devBuyAmount(logs, receiptFixture.token, "0x9999999999999999999999999999999999999999")).toBe(0n);
  });

  it("ignores logs that are not ERC-20 transfers", () => {
    const nft = logs.find((l) => l.topics.length === 4)!;
    expect(parseTransfer(nft)).toBeNull();
  });
});

describe("firstBlockAtNinetyPercent", () => {
  it("finds the first block where cumulative outgoing reaches 90% (fixture)", () => {
    const outgoing = (outgoingFixture.logs as RpcLog[]).map(parseTransfer).filter((t) => t !== null);
    expect(
      firstBlockAtNinetyPercent(BigInt(outgoingFixture.received), outgoing, outgoingFixture.launchBlock, WINDOW),
    ).toBe(outgoingFixture.expectedNinetyBlock);
  });

  it("ignores transfers in the launch block itself and after the window", () => {
    expect(firstBlockAtNinetyPercent(100n, [transfer(1000, 0, 100n)], 1000, WINDOW)).toBeNull();
    expect(firstBlockAtNinetyPercent(100n, [transfer(2801, 0, 100n)], 1000, WINDOW)).toBeNull();
    expect(firstBlockAtNinetyPercent(100n, [transfer(2800, 0, 100n)], 1000, WINDOW)).toBe(2800);
    expect(firstBlockAtNinetyPercent(100n, [transfer(1001, 0, 100n)], 1000, WINDOW)).toBe(1001);
  });

  it("returns null when less than 90% was sent out", () => {
    const out = [transfer(1010, 0, 40n), transfer(1500, 0, 49n)];
    expect(firstBlockAtNinetyPercent(100n, out, 1000, WINDOW)).toBeNull();
  });

  it("orders transfers by block and log index regardless of input order", () => {
    const out = [transfer(1300, 2, 50n), transfer(1100, 7, 30n), transfer(1300, 1, 10n)];
    // 30 at 1100, 40 at 1300/1, 90 at 1300/2
    expect(firstBlockAtNinetyPercent(100n, out, 1000, WINDOW)).toBe(1300);
  });

  it("counts sending more than was received", () => {
    expect(firstBlockAtNinetyPercent(100n, [transfer(1200, 0, 250n)], 1000, WINDOW)).toBe(1200);
  });

  it("returns null when nothing was received", () => {
    expect(firstBlockAtNinetyPercent(0n, [transfer(1200, 0, 250n)], 1000, WINDOW)).toBeNull();
  });
});
