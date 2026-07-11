// FireCash brand + chain constants. FireCash is a shielded-by-default
// (Orchard) rusty-kaspa fork: 1 BPS GHOSTDAG BlockDAG, kHeavyHash PoW,
// 1 $firecash = 10^8 sompi, initial reward 60 $firecash/block.

export const BRAND = {
  /** Full product name. */
  name: "FireCash",
  /** Ticker symbol. */
  ticker: "$firecash",
  /** Bech32 address human-readable prefix (mainnet). */
  addressPrefix: "firecash",
  /** Base-unit decimals (1 $firecash = 10^8 sompi). */
  decimals: 8,
  /** Initial coinbase reward, in whole $firecash. */
  initialReward: 60,
  /** Blocks per second. */
  bps: 1,
  /** Tagline shown in the header/hero. */
  tagline: "The shielded-by-default BlockDAG",
  /** Source repo. */
  repoUrl: "https://github.com/firecash/firecash-explorer",
} as const;
