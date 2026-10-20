import type { Rpc } from "./rpc.js";

const SYMBOL_SELECTOR = "0x95d89b41";
const DECIMALS_SELECTOR = "0x313ce567";

/** Decodes an ABI-encoded `string` return value, falling back to a `bytes32` symbol. */
export function decodeAbiString(hex: string): string {
  const data = hex.replace(/^0x/, "");
  if (data.length === 0) return "";
  if (data.length >= 128) {
    const offset = Number(BigInt("0x" + data.slice(0, 64))) * 2;
    if (offset + 64 <= data.length) {
      const len = Number(BigInt("0x" + data.slice(offset, offset + 64)));
      const start = offset + 64;
      if (start + len * 2 <= data.length) {
        return Buffer.from(data.slice(start, start + len * 2), "hex").toString("utf8");
      }
    }
  }
  return Buffer.from(data.slice(0, 64), "hex").toString("utf8").replace(/\0+$/, "");
}

export async function tokenSymbol(rpc: Rpc, token: string): Promise<string> {
  try {
    const out = await rpc.call<string>("eth_call", [{ to: token, data: SYMBOL_SELECTOR }, "latest"]);
    return decodeAbiString(out) || "?";
  } catch {
    return "?";
  }
}

export async function tokenDecimals(rpc: Rpc, token: string): Promise<number> {
  try {
    const out = await rpc.call<string>("eth_call", [{ to: token, data: DECIMALS_SELECTOR }, "latest"]);
    const d = Number(BigInt(out));
    return Number.isInteger(d) && d >= 0 && d <= 77 ? d : 18;
  } catch {
    return 18;
  }
}
