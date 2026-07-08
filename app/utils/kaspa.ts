// FireCash addresses share Kaspa's bech32m alphabet. Transparent addresses carry
// a 32/33-byte payload (~61-63 data chars); shielded Orchard addresses carry a
// 43-byte payload (longer), so accept a wide length band and let the backend do
// exact validation.
export const isValidKaspaAddressSyntax = (address: string) =>
  /^firecash(test|dev|sim)?:[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{50,130}$/.test(address);

export const isValidHashSyntax = (hash: string) => /^[0-9a-fA-F]{64}$/.test(hash);
