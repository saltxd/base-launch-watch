# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-21 17:08 UTC at block 52906589.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| PTAB20 | `0x0dc614216ae34277fba9751c1d79067e8fc76c6b` | 2026-10-21 16:58 | `0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb` | 796,989.51 | 0.6 | [token](https://basescan.org/token/0x0dc614216ae34277fba9751c1d79067e8fc76c6b), [launch tx](https://basescan.org/tx/0xaf1c563e9f2430efde12b744a4feb19aecb5089f97c40d02c1434c27b3c3de1b) |
| test | `0x311712e80cc65e37af6ace4fc152b7389dc89b07` | 2026-10-21 16:45 | `0x49b16c512af2ff36fcc6de976d23288da1c4245e` | 197,972,240.15 | 0.8 | [token](https://basescan.org/token/0x311712e80cc65e37af6ace4fc152b7389dc89b07), [launch tx](https://basescan.org/tx/0xbb5533a43e41b89723c6dd5ea2886d1795091f3a824903ce05f9decde2ce21db) |
| PTMB20 | `0x89099225ead4ac1af5595a0a0e7c215af55b7886` | 2026-10-21 16:40 | `0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb` | 794,987.64 | 0.7 | [token](https://basescan.org/token/0x89099225ead4ac1af5595a0a0e7c215af55b7886), [launch tx](https://basescan.org/tx/0x4d713d617ae48ac36e16a9e6ebc05ba20e39baf718588b23c641380d49b866e7) |
| Paper | `0xd0814ce4a2b66e55cdd04f8b9229a5704206eb07` | 2026-10-21 13:35 | `0x010e02f119b8dc076c92c457b6d3416a25686c69` | 99,999,999,912.72 | 0.9 | [token](https://basescan.org/token/0xd0814ce4a2b66e55cdd04f8b9229a5704206eb07), [launch tx](https://basescan.org/tx/0xd76a068182a2c8c61faaf3938b736596f0f4c8df6591765aa179c08a23b9719c) |

Launches flagged in the last 24 hours: 4. Latest scan: launches checked: 64. Launches with a dev buy: 31. Launches flagged: 4.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb`](https://basescan.org/address/0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb) | 2 | `0x0dc614216ae34277fba9751c1d79067e8fc76c6b`, `0x89099225ead4ac1af5595a0a0e7c215af55b7886` |

Based on the saved scan history, which covers about 16.7 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 52863390 to 52906589.
- This report merges 3 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- **Partial window.** The scans covered about 16.7 of 24 hours. Not covered: blocks 52863390 to 52868612 (about 2026-10-20 17:08 to 2026-10-20 20:02 UTC); blocks 52878612 to 52882541 (about 2026-10-21 01:36 to 2026-10-21 03:47 UTC); blocks 52892542 to 52896590 (about 2026-10-21 09:20 to 2026-10-21 11:35 UTC). Launches in those blocks were not checked. Use `--rpc` with a node that serves older logs for the full window.
- Latest scan: the RPC (base-rpc.publicnode.com) only served logs from block 52896591 (2026-10-21 11:35 UTC), about 5.6 hours.
- 5 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
