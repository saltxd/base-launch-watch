# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-10 12:35 UTC at block 55618622.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| VQAC1110 | `0x669bd3b34553ecb0e7c0155b95f3a8d180692b07` | 2026-11-10 11:13 | `0xfba4b5c1cd79c577a2b887515cc0329026e6f777` | 10,529,112.12 | 33.3 | [token](https://basescan.org/token/0x669bd3b34553ecb0e7c0155b95f3a8d180692b07), [launch tx](https://basescan.org/tx/0xadce0b9bfaeb53d4e5f2c2b98c2ada6f656670a5d192a28897f975fe19dbf60b) |

Launches flagged in the last 24 hours: 1. Latest scan: launches checked: 12. Launches with a dev buy: 10. Launches flagged: 1.

## Launch wallets flagged more than once (last 7 days)

_No launch wallet was flagged more than once in the last 7 days._

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 55575423 to 55618622.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
