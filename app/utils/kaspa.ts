// FireCash addresses share Kaspa's bech32m alphabet. Transparent addresses carry
// a 32/33-byte payload (~61-63 data chars); shielded Orchard addresses carry a
// 43-byte payload (longer), so accept a wide length band and let the backend do
// exact validation.
export const isValidKaspaAddressSyntax = (address: string) =>
  /^firecash(test|dev|sim)?:[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{50,130}$/.test(address);

export const isValidHashSyntax = (hash: string) => /^[0-9a-fA-F]{64}$/.test(hash);

// The coinbase subnetwork id (first byte 0x01, rest zero). A tx with no transparent
// inputs is only a coinbase when it is on THIS subnetwork; a native-subnetwork tx
// with no transparent inputs/outputs is a fully shielded transfer, not a coinbase —
// labelling those "COINBASE" is what made a normal shielded send look bogus.
export const COINBASE_SUBNETWORK_ID = "0100000000000000000000000000000000000000";
export const isCoinbaseSubnetwork = (subnetworkId: string | undefined | null) =>
  (subnetworkId || "").toLowerCase() === COINBASE_SUBNETWORK_ID;
