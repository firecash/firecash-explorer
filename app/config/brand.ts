// FireCash brand + chain constants. FireCash is a shielded-by-default
// (Orchard) rusty-kaspa fork: 10 BPS GHOSTDAG BlockDAG, kHeavyHash PoW,
// 1 FC = 10^8 sompi, initial reward 44 FC/block.

export const BRAND = {
  /** Full product name. */
  name: "FireCash",
  /** Ticker symbol. */
  ticker: "FC",
  /** Bech32 address human-readable prefix (mainnet). */
  addressPrefix: "firecash",
  /** Base-unit decimals (1 FC = 10^8 sompi). */
  decimals: 8,
  /** Initial coinbase reward, in whole FC. */
  initialReward: 44,
  /** Blocks per second. */
  bps: 10,
  /** Tagline shown in the header/hero. */
  tagline: "The shielded-by-default BlockDAG",
  /** Source repo. */
  repoUrl: "https://github.com/firecash/firecash-explorer",
} as const;
