// Central endpoint configuration for the FireCash explorer.
//
// FireCash is a shielded-by-default rusty-kaspa fork, so the REST schema is
// Kaspa-compatible (simply-kaspa-indexer + kaspa-rest-server), plus a FireCash
// extension endpoint for shielded-pool state. All backends are configurable via
// Vite env vars so the same build targets local dev, testnet, and mainnet.

const env = (import.meta.env ?? {}) as Record<string, string | undefined>;

/** kaspa-rest-server-compatible REST API base (blocks, txs, info/*). */
export const API_BASE = env.VITE_API_BASE ?? "https://api.firecash.stream";

/** socket.io endpoint emitting live `new-block` events. */
export const SOCKET_URL = env.VITE_SOCKET_URL ?? "wss://apiws.firecash.stream";

/** FireCash shielded-pool state endpoint (anchor/nullifiers/turnstile/emission). */
export const SHIELDED_API_BASE = env.VITE_SHIELDED_API_BASE ?? API_BASE;
