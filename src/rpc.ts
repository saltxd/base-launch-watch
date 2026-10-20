export interface RpcLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: string;
  removed?: boolean;
}

export interface LogFilter {
  address?: string;
  topics?: (string | null)[];
}

export interface Rpc {
  call<T>(method: string, params: unknown[]): Promise<T>;
}

export class RpcError extends Error {
  constructor(
    message: string,
    readonly code?: number,
  ) {
    super(message);
    this.name = "RpcError";
  }
}

/** The node refused the request because the data is older than the history it serves for free. */
export class HistoryUnavailableError extends RpcError {
  constructor(message: string, code?: number) {
    super(message, code);
    this.name = "HistoryUnavailableError";
  }
}

const RATE_LIMIT_PATTERN = /rate.?limit|too many requests|request limit|limit reached|capacity|throttl|try again|timeout|busy/i;
const HISTORY_PATTERN = /archive|personal token|pruned|missing trie|header not found|history/i;

export function isRateLimitError(code: number | undefined, message: string): boolean {
  return code === 429 || code === -32005 || code === -32029 || RATE_LIMIT_PATTERN.test(message);
}

export function isHistoryError(message: string): boolean {
  return HISTORY_PATTERN.test(message);
}

export interface HttpRpcOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  onRetry?: (info: { attempt: number; delayMs: number; reason: string }) => void;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** JSON-RPC over HTTP with polite exponential backoff on rate limits and transient failures. */
export class HttpRpc implements Rpc {
  private nextId = 1;
  private readonly maxRetries: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly onRetry?: HttpRpcOptions["onRetry"];

  constructor(
    readonly url: string,
    options: HttpRpcOptions = {},
  ) {
    this.maxRetries = options.maxRetries ?? 6;
    this.baseDelayMs = options.baseDelayMs ?? 1000;
    this.maxDelayMs = options.maxDelayMs ?? 30000;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.sleep = options.sleep ?? defaultSleep;
    this.onRetry = options.onRetry;
  }

  async call<T>(method: string, params: unknown[]): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      let retryReason: string;
      let retryAfterMs: number | undefined;
      try {
        const res = await this.fetchImpl(this.url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: this.nextId++, method, params }),
          signal: AbortSignal.timeout(60000),
        });
        if (res.status === 429 || res.status >= 500) {
          retryReason = `HTTP ${res.status}`;
          retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        } else {
          const body = (await res.json().catch(() => ({}))) as {
            result?: T;
            error?: { code?: number; message?: string };
          };
          if (!res.ok && !body.error) throw new RpcError(`${method}: HTTP ${res.status}`, res.status);
          if (!body.error) return body.result as T;
          const message = body.error.message ?? "unknown error";
          const code = body.error.code;
          if (isRateLimitError(code, message)) {
            retryReason = `rate limited: ${message}`;
          } else if (isHistoryError(message)) {
            throw new HistoryUnavailableError(`${method}: ${message}`, code);
          } else {
            throw new RpcError(`${method}: ${message}`, code);
          }
        }
      } catch (err) {
        if (err instanceof RpcError) throw err;
        retryReason = `network error: ${(err as Error).message}`;
      }
      if (attempt >= this.maxRetries) {
        throw new RpcError(`${method}: giving up after ${attempt + 1} attempts (${retryReason})`);
      }
      const backoff = Math.min(this.maxDelayMs, this.baseDelayMs * 2 ** attempt);
      const delayMs = Math.max(retryAfterMs ?? 0, backoff);
      this.onRetry?.({ attempt: attempt + 1, delayMs, reason: retryReason });
      await this.sleep(delayMs);
    }
  }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.min(seconds * 1000, 60000) : undefined;
}

export const toHex = (n: bigint | number) => "0x" + n.toString(16);
export const fromHex = (h: string) => BigInt(h);
