import { describe, expect, it } from "vitest";
import { HistoryUnavailableError, HttpRpc, RpcError } from "../src/rpc.js";

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

function scripted(responses: Response[]) {
  let i = 0;
  const fetchImpl = (async () => responses[i++] ?? jsonResponse({ result: "0xdead" })) as unknown as typeof fetch;
  return { fetchImpl, count: () => i };
}

describe("HttpRpc retries", () => {
  it("backs off politely on HTTP 429 and JSON-RPC rate limit errors", async () => {
    const delays: number[] = [];
    const s = scripted([
      jsonResponse({}, 429, { "retry-after": "3" }),
      jsonResponse({ jsonrpc: "2.0", id: 2, error: { code: -32005, message: "rate limit exceeded" } }),
      jsonResponse({ jsonrpc: "2.0", id: 3, result: "0x10" }),
    ]);
    const rpc = new HttpRpc("http://fake", {
      fetchImpl: s.fetchImpl,
      sleep: async (ms) => void delays.push(ms),
      baseDelayMs: 1000,
    });
    await expect(rpc.call("eth_blockNumber", [])).resolves.toBe("0x10");
    expect(delays).toEqual([3000, 2000]);
    expect(s.count()).toBe(3);
  });

  it("gives up after maxRetries", async () => {
    const s = scripted(Array.from({ length: 10 }, () => jsonResponse({}, 503)));
    const rpc = new HttpRpc("http://fake", { fetchImpl: s.fetchImpl, sleep: async () => {}, maxRetries: 2 });
    await expect(rpc.call("eth_blockNumber", [])).rejects.toThrow(/giving up after 3 attempts/);
    expect(s.count()).toBe(3);
  });

  it("does not retry history limits or other JSON-RPC errors", async () => {
    const archive = scripted([
      jsonResponse({ error: { code: -32602, message: "Archive requests require a personal token." } }),
    ]);
    const rpc1 = new HttpRpc("http://fake", { fetchImpl: archive.fetchImpl, sleep: async () => {} });
    await expect(rpc1.call("eth_getLogs", [])).rejects.toBeInstanceOf(HistoryUnavailableError);
    expect(archive.count()).toBe(1);

    const archive403 = scripted([
      jsonResponse({ error: { code: -32602, message: "Archive requests require a personal token." } }, 403),
    ]);
    const rpc403 = new HttpRpc("http://fake", { fetchImpl: archive403.fetchImpl, sleep: async () => {} });
    await expect(rpc403.call("eth_getLogs", [])).rejects.toBeInstanceOf(HistoryUnavailableError);

    const bad = scripted([jsonResponse({ error: { code: -32601, message: "method not found" } })]);
    const rpc2 = new HttpRpc("http://fake", { fetchImpl: bad.fetchImpl, sleep: async () => {} });
    await expect(rpc2.call("eth_nope", [])).rejects.toBeInstanceOf(RpcError);
    expect(bad.count()).toBe(1);
  });
});
