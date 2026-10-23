# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-23 04:44 UTC at block 52970663.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| Kimchi | `0xbb409a0d7f33ff798eb5ddf3fb52203884d01b07` | 2026-10-23 02:48 | `0x010e02f119b8dc076c92c457b6d3416a25686c69` | 99,999,999,912.72 | 1.0 | [token](https://basescan.org/token/0xbb409a0d7f33ff798eb5ddf3fb52203884d01b07), [launch tx](https://basescan.org/tx/0x2525bac6234b9090a2fbb3a48ffa50ef0fbb640d715b371e0e738dcf600bb27d) |
| EGEN | `0x7a77aca6114026c5484e5b25c710026a0a76db07` | 2026-10-22 19:04 | `0x0a4b8c6d5b04fd6ecd33e916551f280601c745fe` | 1,032,522,141.54 | 3.4 | [token](https://basescan.org/token/0x7a77aca6114026c5484e5b25c710026a0a76db07), [launch tx](https://basescan.org/tx/0xbfcdebd6cfb1ec63075dfce814e1178cc9bd2a38e36e988d148068fc204a4212) |

Launches flagged in the last 24 hours: 2. Latest scan: launches checked: 62. Launches with a dev buy: 49. Launches flagged: 1.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0x010e02f119b8dc076c92c457b6d3416a25686c69`](https://basescan.org/address/0x010e02f119b8dc076c92c457b6d3416a25686c69) | 2 | `0xbb409a0d7f33ff798eb5ddf3fb52203884d01b07`, `0xd0814ce4a2b66e55cdd04f8b9229a5704206eb07` |
| [`0x8aa9e9d1710fbef6bd4dfb7f425a09b2b350315e`](https://basescan.org/address/0x8aa9e9d1710fbef6bd4dfb7f425a09b2b350315e) | 2 | `0x778b05529f6290c67de907ca1d23600e4d4adfe2`, `0x8cc793ceaedc2d5d604367151f0a512cd6dd4b98` |
| [`0xa28494cf4c09a5fdadece74f749acec935450077`](https://basescan.org/address/0xa28494cf4c09a5fdadece74f749acec935450077) | 6 | `0x80ed5a2ae41dac972683c618c040dd52bc24bb07`, `0xdb18d3b0bfdfb340ca7509fcbdeea78fdfc34b07`, `0xf172ee359147d2189e9dfd4ffa67507827d43b07`, `0xd42b464f66996257a6fb437c17721e194b521b07`, `0xd4fe064f40f797e64b02991a7b2887c86f8d6b07`, `0x6017b7f32a3f7379bb53a6dcdccfe53111c8fb07` |
| [`0x49b16c512af2ff36fcc6de976d23288da1c4245e`](https://basescan.org/address/0x49b16c512af2ff36fcc6de976d23288da1c4245e) | 3 | `0xe983c90af491a1b58bd4c76d061421274e40bb07`, `0x39ebfc3784bf4a0565042a1a07f2671d8b1d9b07`, `0x311712e80cc65e37af6ace4fc152b7389dc89b07` |
| [`0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb`](https://basescan.org/address/0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb) | 2 | `0x0dc614216ae34277fba9751c1d79067e8fc76c6b`, `0x89099225ead4ac1af5595a0a0e7c215af55b7886` |

Based on the saved scan history, which covers about 47.4 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 52927464 to 52970663.
- This report merges 4 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- **Partial window.** The scans covered about 19.8 of 24 hours. Not covered: blocks 52927464 to 52933690 (about 2026-10-22 04:44 to 2026-10-22 08:12 UTC); blocks 52943691 to 52945087 (about 2026-10-22 13:45 to 2026-10-22 14:32 UTC). Launches in those blocks were not checked. Use `--rpc` with a node that serves older logs for the full window.
- Latest scan: the RPC (base-rpc.publicnode.com) only served logs from block 52960663 (2026-10-22 23:11 UTC), about 5.6 hours.
- 5 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
