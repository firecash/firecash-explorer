// Confirmations = how far the virtual chain has advanced past the block that
// accepted a transaction. A just-broadcast tx is often reported accepted before
// its accepting block's blue score has been populated by the indexer; in that
// window `accepting_block_blue_score` is 0/undefined and a naive subtraction from
// the virtual chain blue score yields the ENTIRE chain height (the bogus "4500
// confirmations" seen on brand-new transactions).
//
// Rule: without a real accepting blue score, there are no confirmations yet (0),
// which callers render as a pending spinner. Never return a count derived from a
// missing accepting score.
export function confirmationsOf(
  virtualChainBlueScore: number | undefined,
  acceptingBlockBlueScore: number | undefined | null,
): number {
  const acc = acceptingBlockBlueScore || 0;
  if (acc <= 0) return 0;
  return Math.max(0, (virtualChainBlueScore ?? 0) - acc);
}
