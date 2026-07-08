import { SHIELDED_API_BASE } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// FireCash-specific: the shielded-pool state the chain commits on-chain in every
// block's coinbase (anchor + nullifier accumulator + turnstile totals). Served by
// the FireCash extension endpoint; absent on a plain kaspa-rest-server, in which
// case the query simply resolves to `undefined` and the UI shows placeholders.
export interface ShieldedPoolInfo {
  /** Current global note-commitment tree root (the finalized anchor), hex. */
  anchor: string;
  /** Number of spent nullifiers accumulated (shielded spends to date). */
  nullifierCount: number;
  /** Notes minted into the shielded pool (count). */
  noteCount: number;
  /** Turnstile: total value that has entered the shielded pool, in sompi. */
  turnstileIn: string;
  /** Turnstile: total value that has exited to transparent, in sompi. */
  turnstileOut: string;
  /** Current coinbase emission, in whole FC per block. */
  emissionPerBlock: number;
  /** Blue score the snapshot was taken at. */
  blueScore: string;
}

export const useShieldedPool = () =>
  useQuery({
    queryKey: ["shieldedPool"],
    queryFn: async () => {
      const { data } = await axios.get(`${SHIELDED_API_BASE}/info/shielded`);
      return data as ShieldedPoolInfo;
    },
    refetchInterval: 10000,
    staleTime: 10000,
    retry: false,
  });
