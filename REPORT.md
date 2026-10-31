# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-31 05:35 UTC at block 53317790.

_No launches in the checked window matched the rule._

Launches flagged in the last 24 hours: 0. Latest scan: launches checked: 219. Launches with a dev buy: 163. Launches flagged: 0.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0xa83b4fca82265ae81f6254c9e410a13418f25f92`](https://basescan.org/address/0xa83b4fca82265ae81f6254c9e410a13418f25f92) | 3 | `0x0404483523016537ef1eb04e7f6cdbc5dd73fb07`, `0x5ad1d043031659a562c34803eea3b51bb2156b07`, `0xf5954f33798529917c4940317cada852f00c9b07` |
| [`0x0dca33ffd6e69b47280f50442b5ebc722215ad1c`](https://basescan.org/address/0x0dca33ffd6e69b47280f50442b5ebc722215ad1c) | 2 | `0xd937aec8abe2a9cb0afec3f8137403642c9e8a7d`, `0x0c46d124c03056dce459386183080c675bb41e57` |
| [`0x574c54be7549b6ac7243d28489d52d7971329a35`](https://basescan.org/address/0x574c54be7549b6ac7243d28489d52d7971329a35) | 4 | `0x3e97c1636955686e660378455f20b18d1527751c`, `0xc2f3579a54491ddf54bdd8d2b3b09ca2dbe1eb79`, `0xf501b7e50ba69d9f401c29ec031a35e08c1882ea`, `0xa4bf69091ddd08410f2d6a8038c17ba61c9c0f9a` |
| [`0x010e02f119b8dc076c92c457b6d3416a25686c69`](https://basescan.org/address/0x010e02f119b8dc076c92c457b6d3416a25686c69) | 5 | `0xf436d2e84357a05ce6500b775a7c8159531e6b07`, `0x279326616f0bbf9c2c47c50febab5da469681b07`, `0xb05696b8cd42671809b62ffc0843a7eda4e56b07`, `0xd6568903cd917d104dcd6a7036d1925ece518b07`, `0xbec0c62384de58cd1336897236cf71bfd6883b07` |
| [`0x04383db609be240925aab2540350e79d76e7bde3`](https://basescan.org/address/0x04383db609be240925aab2540350e79d76e7bde3) | 5 | `0x91aa6256b3a112eb4b5e9bb8f3dfdf21bf72810c`, `0xefa3dcd6e21352819973fb0fb3fad7b957502be7`, `0x5989cfa0f67e212228a92e818f2e6cf7af9e8fbf`, `0xd7a01a8d5d1be448bb18b13e83e9f19e76554e34`, `0x1d392eb58dc90bd4e70636e9b91883b3192b5888` |
| [`0x976d52b0c554b4645a17976e55e6e2f79ed2756d`](https://basescan.org/address/0x976d52b0c554b4645a17976e55e6e2f79ed2756d) | 2 | `0xa00d21f3dfb03f141f033d1c72e35a348333e31b`, `0x8cf54e979fb83054f9a6be5b0be47f3d7d8a2b07` |

Based on the saved scan history, which covers the full 7 days.

## Coverage

- Requested window: last 24 hours, blocks 53274591 to 53317790.
- This report merges 4 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- 3 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
