# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-05 19:58 UTC at block 53591677.

_No launches in the checked window matched the rule._

Launches flagged in the last 24 hours: 0. Latest scan: launches checked: 139. Launches with a dev buy: 44. Launches flagged: 0.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0xc48a38fb259be3a6a3f25abc422236998eb36ed8`](https://basescan.org/address/0xc48a38fb259be3a6a3f25abc422236998eb36ed8) | 6 | `0x304791d86a2d193c5a055d53f2bcdee401c20b07`, `0x2dbd218ca1e7ec38046d16f0754daec3fa160b07`, `0x09dc071415ea76383b6d30a0953c80c61dcf0b07`, `0x249d7b4e5c9a52e915150659136e60933e250b07`, `0x1a71413a4cf320ae2f29470a498b5063b1710b07`, `0x173838f70993023542587cb28018b46b1e390b07` |
| [`0xa628c5b693c4b38f4ae60365935f6f1060bca244`](https://basescan.org/address/0xa628c5b693c4b38f4ae60365935f6f1060bca244) | 2 | `0xb8a366417ffe2d94af37753f01870923f16b7b07`, `0xaeb51b6165d8b6f1c2714867e817e3feb1414b07` |
| [`0x66a85b35009e409ce2d9430b62b22b0105f418cf`](https://basescan.org/address/0x66a85b35009e409ce2d9430b62b22b0105f418cf) | 2 | `0xfb2e9873a08438af773ed3fd76a6f98def7172d9`, `0xe88e2ea5cb2c3dcf69d8c50040ff9cfbf58f5330` |
| [`0x0cff8bb2a9fafa7aa1149982c76520578f0ad219`](https://basescan.org/address/0x0cff8bb2a9fafa7aa1149982c76520578f0ad219) | 2 | `0xd159169ec9fef36e93cab982e6f731e0b2345b30`, `0x9391f79d708007640550ef659190add3fe908510` |
| [`0xe87abcdc0dcde696f8d73022991da32ded5b63fe`](https://basescan.org/address/0xe87abcdc0dcde696f8d73022991da32ded5b63fe) | 2 | `0xcca0c1ff533324faa45006f0f7b4a87b50e780b0`, `0x305768cfbe119ba960e033e550c8553e16347732` |
| [`0x70cc3d0444f9f09722c27c9a9cd1355a3ea7a702`](https://basescan.org/address/0x70cc3d0444f9f09722c27c9a9cd1355a3ea7a702) | 2 | `0xf66feb69d4912367067d6d54b8c6adbc736f1b07`, `0x2faf4e07cd9af9d9d6cf84c47423cae5815aab07` |
| [`0xdcac6938aa51621e945b1b64b0ee2a0c2a2625ad`](https://basescan.org/address/0xdcac6938aa51621e945b1b64b0ee2a0c2a2625ad) | 2 | `0x516a0a4e2dc687569aee3b6a11289e9dcc9c9b07`, `0xd783dab4a61c4bd246cae4b68379701fe91cfb07` |

Based on the saved scan history, which covers about 166.5 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 53548478 to 53591677.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
