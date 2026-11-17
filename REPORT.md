# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-17 13:18 UTC at block 58655568.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| EXO | `0xd702b3547b16db925665dc526fb0e750b4373862` | 2026-11-17 12:11 | `0x4f2c49c54cf28549a222188fc9c5456092035fd7` | 100,000,000,000 | 30.2 | [token](https://basescan.org/token/0xd702b3547b16db925665dc526fb0e750b4373862), [launch tx](https://basescan.org/tx/0xea1b52e22813ddac4be3e88d2800ec4b02f62260b3b52bf611ae0aa8ac42660d) |

Launches flagged in the last 24 hours: 1. Latest scan: launches checked: 34. Launches with a dev buy: 7. Launches flagged: 1.

## Launch wallets flagged more than once (last 7 days)

_No launch wallet was flagged more than once in the last 7 days._

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 58612369 to 58655568.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
