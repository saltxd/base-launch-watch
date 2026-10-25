# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-25 19:01 UTC at block 53082766.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| Paper | `0xb05696b8cd42671809b62ffc0843a7eda4e56b07` | 2026-10-25 13:53 | `0x010e02f119b8dc076c92c457b6d3416a25686c69` | 99,999,999,912.72 | 0.5 | [token](https://basescan.org/token/0xb05696b8cd42671809b62ffc0843a7eda4e56b07), [launch tx](https://basescan.org/tx/0x8ad70920f2984fcb90a0aabfff0e48d090a1f3937af53d0c65c230ae00eb59d6) |
| Agent | `0xd6568903cd917d104dcd6a7036d1925ece518b07` | 2026-10-25 07:24 | `0x010e02f119b8dc076c92c457b6d3416a25686c69` | 99,999,999,912.72 | 1.2 | [token](https://basescan.org/token/0xd6568903cd917d104dcd6a7036d1925ece518b07), [launch tx](https://basescan.org/tx/0xe3b7af28de9badb3ae00ae7ffac0f3a4396eb2b1df984875f43167c25c94d04e) |

Launches flagged in the last 24 hours: 2. Latest scan: launches checked: 235. Launches with a dev buy: 132. Launches flagged: 2.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0x010e02f119b8dc076c92c457b6d3416a25686c69`](https://basescan.org/address/0x010e02f119b8dc076c92c457b6d3416a25686c69) | 6 | `0xb05696b8cd42671809b62ffc0843a7eda4e56b07`, `0xd6568903cd917d104dcd6a7036d1925ece518b07`, `0xbec0c62384de58cd1336897236cf71bfd6883b07`, `0x66650590ff805a33f7c81dd63e948dedc55c3b07`, `0xbb409a0d7f33ff798eb5ddf3fb52203884d01b07`, `0xd0814ce4a2b66e55cdd04f8b9229a5704206eb07` |
| [`0x04383db609be240925aab2540350e79d76e7bde3`](https://basescan.org/address/0x04383db609be240925aab2540350e79d76e7bde3) | 2 | `0xd7a01a8d5d1be448bb18b13e83e9f19e76554e34`, `0x1d392eb58dc90bd4e70636e9b91883b3192b5888` |
| [`0x976d52b0c554b4645a17976e55e6e2f79ed2756d`](https://basescan.org/address/0x976d52b0c554b4645a17976e55e6e2f79ed2756d) | 2 | `0xa00d21f3dfb03f141f033d1c72e35a348333e31b`, `0x8cf54e979fb83054f9a6be5b0be47f3d7d8a2b07` |
| [`0x8aa9e9d1710fbef6bd4dfb7f425a09b2b350315e`](https://basescan.org/address/0x8aa9e9d1710fbef6bd4dfb7f425a09b2b350315e) | 2 | `0x778b05529f6290c67de907ca1d23600e4d4adfe2`, `0x8cc793ceaedc2d5d604367151f0a512cd6dd4b98` |
| [`0xa28494cf4c09a5fdadece74f749acec935450077`](https://basescan.org/address/0xa28494cf4c09a5fdadece74f749acec935450077) | 6 | `0x80ed5a2ae41dac972683c618c040dd52bc24bb07`, `0xdb18d3b0bfdfb340ca7509fcbdeea78fdfc34b07`, `0xf172ee359147d2189e9dfd4ffa67507827d43b07`, `0xd42b464f66996257a6fb437c17721e194b521b07`, `0xd4fe064f40f797e64b02991a7b2887c86f8d6b07`, `0x6017b7f32a3f7379bb53a6dcdccfe53111c8fb07` |
| [`0x49b16c512af2ff36fcc6de976d23288da1c4245e`](https://basescan.org/address/0x49b16c512af2ff36fcc6de976d23288da1c4245e) | 3 | `0xe983c90af491a1b58bd4c76d061421274e40bb07`, `0x39ebfc3784bf4a0565042a1a07f2671d8b1d9b07`, `0x311712e80cc65e37af6ace4fc152b7389dc89b07` |
| [`0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb`](https://basescan.org/address/0x1c1beebbf3ff938264bacf9535d5eb8efd2ce4fb) | 2 | `0x0dc614216ae34277fba9751c1d79067e8fc76c6b`, `0x89099225ead4ac1af5595a0a0e7c215af55b7886` |

Based on the saved scan history, which covers about 109.6 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 53039567 to 53082766.
- This report merges 4 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- 4 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
