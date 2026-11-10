# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-10 02:43 UTC at block 55441039.

_No launches in the checked window matched the rule._

Launches flagged in the last 24 hours: 0. Latest scan: launches checked: 1. Launches with a dev buy: 0. Launches flagged: 0.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0xe1999b3eae3bf281a0b3a6461972838ad34d65c8`](https://basescan.org/address/0xe1999b3eae3bf281a0b3a6461972838ad34d65c8) | 5 | `0x23b95836aa7a3e89048c431df2bfbefa9ed80b07`, `0x02ede7370ceaadc443472edf62db2c27ab6c0b07`, `0x17b2ca4ff9d418b6c71900a8191be70258ca0b07`, `0x27ae827e04bbfbbbc1046c4e94063efe0f0d0b07`, `0x1205f45cdf906537379176e1139cafce100f0b07` |

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 55397840 to 55441039.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
