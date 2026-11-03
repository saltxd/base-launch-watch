# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-03 02:16 UTC at block 53441415.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| USD𑫝 ּ | `0xd783dab4a61c4bd246cae4b68379701fe91cfb07` | 2026-11-02 16:05 | `0xdcac6938aa51621e945b1b64b0ee2a0c2a2625ad` | 100,000,000,000 | 5.0 | [token](https://basescan.org/token/0xd783dab4a61c4bd246cae4b68379701fe91cfb07), [launch tx](https://basescan.org/tx/0x855aff534db84727d7c6068dbcd9e4948e29b07ba6c3b0976687c1740a360e66) |

Launches flagged in the last 24 hours: 1. Latest scan: launches checked: 161. Launches with a dev buy: 113. Launches flagged: 1.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0xa83b4fca82265ae81f6254c9e410a13418f25f92`](https://basescan.org/address/0xa83b4fca82265ae81f6254c9e410a13418f25f92) | 3 | `0x0404483523016537ef1eb04e7f6cdbc5dd73fb07`, `0x5ad1d043031659a562c34803eea3b51bb2156b07`, `0xf5954f33798529917c4940317cada852f00c9b07` |
| [`0x0dca33ffd6e69b47280f50442b5ebc722215ad1c`](https://basescan.org/address/0x0dca33ffd6e69b47280f50442b5ebc722215ad1c) | 2 | `0xd937aec8abe2a9cb0afec3f8137403642c9e8a7d`, `0x0c46d124c03056dce459386183080c675bb41e57` |
| [`0x574c54be7549b6ac7243d28489d52d7971329a35`](https://basescan.org/address/0x574c54be7549b6ac7243d28489d52d7971329a35) | 4 | `0x3e97c1636955686e660378455f20b18d1527751c`, `0xc2f3579a54491ddf54bdd8d2b3b09ca2dbe1eb79`, `0xf501b7e50ba69d9f401c29ec031a35e08c1882ea`, `0xa4bf69091ddd08410f2d6a8038c17ba61c9c0f9a` |

Based on the saved scan history, which covers the full 7 days.

## Coverage

- Requested window: last 24 hours, blocks 53398216 to 53441415.
- This report merges 3 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- 6 launch(es) with a dev buy are less than an hour old; their hour was only partly observed. The next scan checks them again.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
