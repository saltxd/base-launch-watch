# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-15 21:01 UTC at block 57930551.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| MRDN | `0x29b3e30a14dc039b8bf8684ed116146f9ec70b07` | 2026-11-15 18:51 | `0x446e3694aca983fe4ae31f041e34df8319c0f2a5` | 22,926,901.76 | 9.5 | [token](https://basescan.org/token/0x29b3e30a14dc039b8bf8684ed116146f9ec70b07), [launch tx](https://basescan.org/tx/0x97b041b343c46350a76c67df6c09ccd25ab99f93369fb0df6c5fc38218d48bd8) |

Launches flagged in the last 24 hours: 1. Latest scan: launches checked: 6. Launches with a dev buy: 5. Launches flagged: 1.

## Launch wallets flagged more than once (last 7 days)

_No launch wallet was flagged more than once in the last 7 days._

Based on the saved scan history, which covers about 69.4 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 57887352 to 57930551.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
