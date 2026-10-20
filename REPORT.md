# Base launch watch

> **On-chain facts only.** The launch wallet is the address that sent the launch transaction. It can be a bot or a launch service acting for someone else.
> "Sent out" means the tokens left that wallet. It is not proof of a sale.
> This is not a honeypot or liquidity check. Nothing here calls any token safe, and a token missing from this list is not safe because of that.

New Clanker v4 launches on Base whose launch wallet sent out 90% or more of the tokens it received in the launch transaction within one hour (1,800 blocks) of launch. Newest first.

Generated 2026-10-20 13:15 UTC at block 52856391.

| Token | Token address | Launch time (UTC) | Launch wallet | Tokens received | Minutes until 90% was gone | Basescan |
| --- | --- | --- | --- | ---: | ---: | --- |
| WIRE | `0x718d6103ab1a28f26b5dc54d4c8f65ca7a1eab07` | 2026-10-20 11:18 | `0x0d6104246c418710327b001a919d6345910f44ff` | 116,279.5 | 10.6 | [token](https://basescan.org/token/0x718d6103ab1a28f26b5dc54d4c8f65ca7a1eab07), [launch tx](https://basescan.org/tx/0x62d27aa0f9bea4cbd43635a387a013df21174653ec86f213bf755e0792e1830d) |
| SYNC | `0x6f9083d6835a19d7ee0a505e2e5c695f0328fb07` | 2026-10-20 10:57 | `0x0d6104246c418710327b001a919d6345910f44ff` | 116,279.5 | 25.8 | [token](https://basescan.org/token/0x6f9083d6835a19d7ee0a505e2e5c695f0328fb07), [launch tx](https://basescan.org/tx/0x93baace315dfebe1b0b5efedfb80b0801669732bfb8fc1af1afe9a1caa0de58a) |
| Paper | `0xb3552eefaf0f94fd82a49b745a1c46a45c897b07` | 2026-10-20 10:41 | `0x010e02f119b8dc076c92c457b6d3416a25686c69` | 99,999,999,912.72 | 3.2 | [token](https://basescan.org/token/0xb3552eefaf0f94fd82a49b745a1c46a45c897b07), [launch tx](https://basescan.org/tx/0x365209d246d3a8b62b8881012c58e76368dd025ff975a06a991f642991e0032a) |
| USDT | `0xaebe4b8fd398d49b393e4d08bdc90497e30cbb07` | 2026-10-20 09:09 | `0x6533d54917e1a86d163e37e8a453b828884bd4dc` | 99,999,950,833.72 | 5.7 | [token](https://basescan.org/token/0xaebe4b8fd398d49b393e4d08bdc90497e30cbb07), [launch tx](https://basescan.org/tx/0x56d65de38bd4a43c345fd276762b89d5e6dfc01a7c9d4483e00b5d03610849ee) |
| USDT | `0x52a79366fd32cb226d77714f707c463d99da9b07` | 2026-10-20 08:58 | `0x6533d54917e1a86d163e37e8a453b828884bd4dc` | 100,000,000,000 | 7.9 | [token](https://basescan.org/token/0x52a79366fd32cb226d77714f707c463d99da9b07), [launch tx](https://basescan.org/tx/0xacad974fbee97d6856c4e4ea4d3373238b006987cf480f98f147ac6dbc225f1c) |
| USDT | `0xc5703375a12deed8ea1178dda4799bffbc538b07` | 2026-10-20 08:40 | `0x6533d54917e1a86d163e37e8a453b828884bd4dc` | 99,999,967,646.9 | 13.9 | [token](https://basescan.org/token/0xc5703375a12deed8ea1178dda4799bffbc538b07), [launch tx](https://basescan.org/tx/0x00a5ce808c6ee9c5227f304e417a0ab34c2c9c34f6295408ce3f9a6964286160) |
| USDT | `0xbe85fa24fa2221208d2a7203baaf13e1533beb07` | 2026-10-20 07:43 | `0x6533d54917e1a86d163e37e8a453b828884bd4dc` | 99,996,704,699.94 | 5.2 | [token](https://basescan.org/token/0xbe85fa24fa2221208d2a7203baaf13e1533beb07), [launch tx](https://basescan.org/tx/0xf9e7c8998e5a58ea368e48aa9a0132ffb8166dca6c1c6e3d9300ca5581519371) |

Launches checked: 19. Launches with a dev buy: 18. Launches flagged: 7.

## Coverage

- Requested window: last 24 hours, blocks 52813192 to 52856391.
- **Partial window.** The RPC (https://base-rpc.publicnode.com) only served logs from block 52846392 (2026-10-20 07:42 UTC), about 5.6 hours. Launches before that were not checked. Use `--rpc` with a node that serves older logs for the full window.
- Rule: the launch wallet is the sender of the launch transaction. Tokens received are the token Transfers to it from a non-zero address in that transaction. Outgoing Transfers from it in the 1,800 blocks after the launch block are summed in order; the first block where the total reaches 90% of what it received is reported. Minutes assume 2 seconds per block.
