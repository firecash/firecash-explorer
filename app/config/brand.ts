// ZKas brand + chain constants. ZKas is a shielded-by-default
// (Orchard) rusty-kaspa fork: 1 BPS GHOSTDAG BlockDAG, kHeavyHash PoW,
// 1 ZKAS = 10^8 sompi, initial reward 60 ZKAS/block.

export const BRAND = {
  /** Full product name. */
  name: "ZKas",
  /** Ticker symbol. */
  ticker: "ZKAS",
  /** Bech32 address human-readable prefix (mainnet). */
  addressPrefix: "zkas",
  /** Base-unit decimals (1 ZKAS = 10^8 sompi). */
  decimals: 8,
  /** Initial coinbase reward, in whole ZKAS. */
  initialReward: 60,
  /** Blocks per second. */
  bps: 1,
  /** Tagline shown in the header/hero. */
  tagline: "The shielded-by-default BlockDAG",
  /** Source repo. */
  repoUrl: "https://zkas.info",
} as const;
