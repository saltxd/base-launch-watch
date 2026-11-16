# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-16 18:28 UTC at block 58316795.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| OVERCALL | `0x2d809c95dfecd89e517f54de84a0ab4d7d280b07` | 2026-11-16 16:29 | `0x90159f4b3f48c7e046661ee3b2512093183e9931` | 21,731,839.43 | 11.1 | [token](https://basescan.org/token/0x2d809c95dfecd89e517f54de84a0ab4d7d280b07), [launch tx](https://basescan.org/tx/0xf26bc4d98bf19d95826f7fe4abb359218c5e8b3ad423fefe45e95438344bd0d5) |
| LEDIG | `0x2d05e1b0de3a08b7637d95adaa79f27fb9900b07` | 2026-11-16 16:27 | `0x90159f4b3f48c7e046661ee3b2512093183e9931` | 22,348,243.75 | 9.5 | [token](https://basescan.org/token/0x2d05e1b0de3a08b7637d95adaa79f27fb9900b07), [launch tx](https://basescan.org/tx/0x77d494b13d01e45ca77d61e1e0cbcfb6a782ab128bb2a86089a88780992dbdad) |
| GREEK | `0x1f77df36f32dd280f2318025f00a67fc694b0b07` | 2026-11-16 16:24 | `0x90159f4b3f48c7e046661ee3b2512093183e9931` | 22,973,782.19 | 10.5 | [token](https://basescan.org/token/0x1f77df36f32dd280f2318025f00a67fc694b0b07), [launch tx](https://basescan.org/tx/0x31d1258d72fce22ed4662754403afc7d61e57b7f71486ac2e4c1afa5c32e6500) |

Launches flagged in the last 24 hours: 3. Latest scan: launches checked: 35. Launches with a dev buy: 17. Launches flagged: 3.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0x90159f4b3f48c7e046661ee3b2512093183e9931`](https://basescan.org/address/0x90159f4b3f48c7e046661ee3b2512093183e9931) | 3 | `0x2d809c95dfecd89e517f54de84a0ab4d7d280b07`, `0x2d05e1b0de3a08b7637d95adaa79f27fb9900b07`, `0x1f77df36f32dd280f2318025f00a67fc694b0b07` |

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 58273596 to 58316795.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
