# base-launch-watch

A free daily list of new Base token launches whose launch wallet sent out its launch tokens within the hour. Public data only. Built by an AI agent in UseAgent.

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

The latest report is in [REPORT.md](REPORT.md). A GitHub Actions workflow scans every 4 hours (at minute 17) and rebuilds the report from the saved history.

## What it does

1. Reads `TokenCreated` logs from the Clanker v4 factory on Base (`0xE85A59c628F7d27878ACeB4bf3b35733630083a9`) for the last 24 hours (`--hours N` to change). Topic 1 is the token, topic 2 the token admin.
2. For each launch, the sender of the launch transaction is the **launch wallet**. Its **dev buy** is the sum of that token's ERC-20 Transfers to the launch wallet from a non-zero address inside the launch transaction. Launches with no dev buy are counted but not checked further.
3. Reads the launch wallet's outgoing Transfers of that token in the 1,800 blocks (one hour) after the launch block, sums them in order, and finds the first block where the total reaches 90% or more of the dev buy.
4. Adds every flagged launch to `history/flagged.jsonl` (one JSON line per launch, deduplicated by token address) and appends the scan's block range to `history/scans.jsonl`.
5. Writes a markdown table, newest first, of the flagged launches in `history/flagged.jsonl` from the last 24 hours to stdout and `REPORT.md`: symbol, token address, launch time (UTC), launch wallet, tokens received, minutes until 90% was gone, and Basescan links. Then one line with the number flagged in the window and the latest scan's counts.
6. Lists launch wallets flagged more than once in the last 7 days of history, with their number of flagged launches and token addresses, newest first.
7. Coverage notes list any blocks in the window that no saved scan covered.

Minutes are block counts times 2 seconds (Base makes a block every 2 seconds). Outgoing transfers include any destination (a pool, another wallet, a burn address). Transfers to itself are ignored. Transfers in the launch block itself are not counted, because the window starts in the block after the launch block.

## Usage

Requires Node 22.12 or later. No API keys.

```sh
npm install
npm test
npm run build
node dist/cli.js                 # last 24 hours, writes REPORT.md
node dist/cli.js --hours 6 --out today.md
```

Options:

| Flag | Default | Meaning |
| --- | --- | --- |
| `--hours N` | `24` | Window to scan |
| `--rpc URL` | `https://base-rpc.publicnode.com` (or `$BASE_RPC_URL`) | JSON-RPC endpoint |
| `--out FILE` | `REPORT.md` | Report file |
| `--history DIR` | `history` | Where `flagged.jsonl` and `scans.jsonl` are kept |
| `--concurrency N` | `3` | Parallel launch checks |

Progress goes to stderr, the report to stdout.

## RPC limits and how they are handled

- `eth_getLogs` is called in chunks of at most 5,000 blocks, newest chunk first.
- Rate limits (HTTP 429, 5xx, or JSON-RPC rate limit errors) are retried with exponential backoff, honoring `Retry-After`.
- The free publicnode endpoint only serves logs for roughly the most recent 10,000 blocks (about 5.5 hours) and refuses older ones with "Archive requests require a personal token". When that happens the tool finds the oldest block it can still read, checks every launch from there on, and says in the report exactly which part of the window it covered. Because the workflow scans every 4 hours, consecutive scans overlap and the history covers the full day; if a run is late or fails, the report names the missed blocks. To cover the full 24 hours in a single scan, point `--rpc` (or the `BASE_RPC_URL` repository secret for the workflow) at a node that serves older logs.
- The same endpoint refuses `eth_getTransactionReceipt` for all but the newest blocks. When the receipt is refused, the launch transaction's Transfer logs are read with `eth_getLogs` for the launch block, filtered to the launch transaction. That gives the same Transfer logs.

## Development

```sh
npm test         # vitest, fixtures only, no network
npm run typecheck
```

Tests cover the 90% timing rule, dev buy summing, chunked log paging (including the history limit), RPC retry behavior, report rendering, the history merge, and the repeat launch wallet section.

## License

MIT

## How this was made

Written, tested and first run by an AI agent (OpenCode on Claude Opus 5.5) in UseAgent, in one thread, from a single task description. UseAgent's chat view masks text that looks like a secret, so 13 short spots came through as `<redacted>` when the files were copied out: each `token: string` type, the token address read from a log, and the TokenCreated topic constant. They were restored by hand, and the agent's 26 tests pass on the restored files.
