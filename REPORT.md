# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-21 09:20 UTC at block 52892541.

_No launches in the checked window matched the rule._

Launches flagged in the last 24 hours: 0. Latest scan: launches checked: 48. Launches with a dev buy: 44. Launches flagged: 0.

## Launch wallets flagged more than once (last 7 days)

_No launch wallet was flagged more than once in the last 7 days._

Based on the saved scan history, which covers about 11.1 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 52849342 to 52892541.
- This report merges 2 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- **Partial window.** The scans covered about 11.1 of 24 hours. Not covered: blocks 52849342 to 52868612 (about 2026-10-20 09:20 to 2026-10-20 20:02 UTC); blocks 52878612 to 52882541 (about 2026-10-21 01:36 to 2026-10-21 03:47 UTC). Launches in those blocks were not checked. Use `--rpc` with a node that serves older logs for the full window.
- Latest scan: the RPC (base-rpc.publicnode.com) only served logs from block 52882542 (2026-10-21 03:47 UTC), about 5.6 hours.
- 4 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
