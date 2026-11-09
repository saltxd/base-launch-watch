# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base from the last 24 hours whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-11-09 18:43 UTC at block 55297262.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| OVERCALL | `0x23b95836aa7a3e89048c431df2bfbefa9ed80b07` | 2026-11-09 17:14 | `0xe1999b3eae3bf281a0b3a6461972838ad34d65c8` | 70,498,212.53 | 8.5 | [token](https://basescan.org/token/0x23b95836aa7a3e89048c431df2bfbefa9ed80b07), [launch tx](https://basescan.org/tx/0xe9e996b9591594a1066463e41f61b981670e8f8e666d995fe38a06ce883ffc8a) |
| LEDIG | `0x02ede7370ceaadc443472edf62db2c27ab6c0b07` | 2026-11-09 17:12 | `0xe1999b3eae3bf281a0b3a6461972838ad34d65c8` | 76,146,023.33 | 8.7 | [token](https://basescan.org/token/0x02ede7370ceaadc443472edf62db2c27ab6c0b07), [launch tx](https://basescan.org/tx/0x10e12277d4ecdb2945ee5d92b1b2dbb39cd0c8942d870c7a813565f4eeab0489) |
| GREEK | `0x17b2ca4ff9d418b6c71900a8191be70258ca0b07` | 2026-11-09 17:11 | `0xe1999b3eae3bf281a0b3a6461972838ad34d65c8` | 82,221,277.48 | 8.8 | [token](https://basescan.org/token/0x17b2ca4ff9d418b6c71900a8191be70258ca0b07), [launch tx](https://basescan.org/tx/0xcb57324cbe0ae22deb3bd6384172adb8f0a2da189ade639d48bef8a093b7929c) |
| ULTRAMINT | `0x27ae827e04bbfbbbc1046c4e94063efe0f0d0b07` | 2026-11-09 17:10 | `0xe1999b3eae3bf281a0b3a6461972838ad34d65c8` | 88,739,593.62 | 9.2 | [token](https://basescan.org/token/0x27ae827e04bbfbbbc1046c4e94063efe0f0d0b07), [launch tx](https://basescan.org/tx/0x151bc8c26d74e6c7c851c3209b413e22a435458518fd488962905c888b5ef674) |
| MRDN | `0x1205f45cdf906537379176e1139cafce100f0b07` | 2026-11-09 17:02 | `0xe1999b3eae3bf281a0b3a6461972838ad34d65c8` | 92,804,466.46 | 59.8 | [token](https://basescan.org/token/0x1205f45cdf906537379176e1139cafce100f0b07), [launch tx](https://basescan.org/tx/0x5118b462b5d832ebe9ff4117d15f35b432569c7fa3f6a7170ec6d48634f411f1) |

Launches flagged in the last 24 hours: 5. Latest scan: launches checked: 13. Launches with a dev buy: 12. Launches flagged: 5.

## Launch wallets flagged more than once (last 7 days)

| Launch wallet | Flagged launches | Token addresses (newest first) |
| --- | ---: | --- |
| [`0xe1999b3eae3bf281a0b3a6461972838ad34d65c8`](https://basescan.org/address/0xe1999b3eae3bf281a0b3a6461972838ad34d65c8) | 5 | `0x23b95836aa7a3e89048c431df2bfbefa9ed80b07`, `0x02ede7370ceaadc443472edf62db2c27ab6c0b07`, `0x17b2ca4ff9d418b6c71900a8191be70258ca0b07`, `0x27ae827e04bbfbbbc1046c4e94063efe0f0d0b07`, `0x1205f45cdf906537379176e1139cafce100f0b07` |

Based on the saved scan history, which covers about 48.0 of the last 168 hours. Launches outside the scanned blocks are not counted.

## Coverage

- Requested window: last 24 hours, blocks 55254063 to 55297262.
- This report merges 1 scan(s) that read logs in this window. Flagged launches are kept in `history/flagged.jsonl` (one line per token) and each scan's block range in `history/scans.jsonl`.
- Full window covered by the merged scans.
- Latest scan: full window served (base-rpc.publicnode.com).
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
