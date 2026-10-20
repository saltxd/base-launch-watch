#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { DEFAULT_RPC_URL } from "./constants.js";
import { renderReport } from "./report.js";
import { HttpRpc } from "./rpc.js";
import { scan } from "./watch.js";

const HELP = `base-launch-watch: new Clanker v4 launches on Base whose launch wallet sent out 90%+ of its launch tokens within the hour.

Usage: base-launch-watch [--hours N] [--rpc URL] [--out FILE] [--concurrency N]

  --hours N        Window to scan, in hours (default 24)
  --rpc URL        JSON-RPC endpoint (default ${DEFAULT_RPC_URL}, or $BASE_RPC_URL)
  --out FILE       Where to write the markdown report (default REPORT.md)
  --concurrency N  Parallel launch checks (default 3)
  -h, --help       Show this help

On-chain facts only. Not a honeypot or liquidity check. Never treat any token as safe.`;

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      hours: { type: "string", default: "24" },
      rpc: { type: "string" },
      out: { type: "string", default: "REPORT.md" },
      concurrency: { type: "string", default: "3" },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }
  const hours = Number(values.hours);
  if (!Number.isFinite(hours) || hours <= 0) throw new Error(`--hours must be a positive number, got ${values.hours}`);
  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error(`--concurrency must be a positive integer`);
  const rpcUrl = values.rpc || process.env.BASE_RPC_URL || DEFAULT_RPC_URL;

  const log = (msg: string) => console.error(msg);
  const rpc = new HttpRpc(rpcUrl, {
    onRetry: ({ attempt, delayMs, reason }) => log(`  retry ${attempt} in ${delayMs} ms (${reason})`),
  });
  const result = await scan(rpc, { hours, rpcUrl, concurrency, log });
  const report = renderReport(result);
  await writeFile(values.out, report, "utf8");
  process.stdout.write(report);
  log(`Wrote ${values.out}`);
}

main().catch((err) => {
  console.error(`error: ${(err as Error).message}`);
  process.exit(1);
});
