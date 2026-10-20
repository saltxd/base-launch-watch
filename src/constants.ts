export const DEFAULT_RPC_URL = "https://base-rpc.publicnode.com";

export const CLANKER_V4_FACTORY = "0xe85a59c628f7d27878aceb4bf3b35733630083a9";
// The TokenCreated event topic: a public hash of the event signature, not a secret.
export const TOKEN_CREATED_TOPIC = "0x9299d1d1a88d8e1abdc591ae7a167a6bc63a8f17d695804e9091ee33aa89fb67"; // gitleaks:allow
export const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** The RPC allows at most this many blocks per eth_getLogs call (inclusive range). */
export const MAX_LOG_BLOCK_RANGE = 5000;

export const SECONDS_PER_BLOCK = 2;
export const BLOCKS_PER_HOUR = 3600 / SECONDS_PER_BLOCK;

/** How many blocks after the launch block we watch the launch wallet: one hour. */
export const DUMP_WINDOW_BLOCKS = 1800;

export const BASESCAN = "https://basescan.org";
