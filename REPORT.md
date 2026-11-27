# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-27 21:11 UTC at block 63117627.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| USAR | `0xd21aeb0b7b07da8ec658bbc513d133552833fd45` | 2026-11-27 19:56 | `0x4492697e439d519560d37d57cce36a7f3f839c15` | 14,915,927,862.38 | 5.2 | [token](https://basescan.org/token/0xd21aeb0b7b07da8ec658bbc513d133552833fd45), [launch tx](https://basescan.org/tx/0x65f3d91381c56b617618cde09576b54f2ff23b08301867f94188449d194e60f3) |
| NOTF | `0x4094bb0002aac2e3ffd7883884c7971685b6a449` | 2026-11-27 19:53 | `0xd429ade27854b4cef364bb38adcbf4e05e4b117b` | 19,317,840,809.05 | 6.2 | [token](https://basescan.org/token/0x4094bb0002aac2e3ffd7883884c7971685b6a449), [launch tx](https://basescan.org/tx/0x899ddf68949512097d80a24c053172c4d265773932daac95f7766b8874a52e8b) |

Launches flagged in the last 24 hours: 2. Latest scan: launches checked: 108. Launches with a dev buy: 2. Launches flagged: 2.

## Launch wallets flagged more than once (last 7 days)

_No launch wallet was flagged more than once in the last 7 days._

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 63074428 to 63117627.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
