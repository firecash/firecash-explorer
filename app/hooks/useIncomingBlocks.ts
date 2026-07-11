import { API_BASE } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export interface Block {
  block_hash: string;
  difficulty: number;
  blueScore: string;
  timestamp: string;
  txCount: number;
  txs: {
    txId: string;
    outputs: [string, string][];
  }[];
}

// The FireCash backend serves the recent-block ring over REST; poll it (the chain
// runs at 1 BPS, so a 1s poll keeps the live feed current without a socket server).
export const useIncomingBlocks = () => {
  const { data } = useQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      const res = await axios.get<Block[]>(`${API_BASE}/blocks/recent`);
      return res.data;
    },
    refetchInterval: 1000,
    staleTime: 1000,
    retry: false,
  });

  const blocks = useMemo(() => (data ?? []).slice(0, 20), [data]);

  // Average block time from the timestamp span of the recent window.
  const avgBlockTime = useMemo(() => {
    if (!data || data.length < 2) return 0;
    const newest = Number(data[0].timestamp);
    const oldest = Number(data[data.length - 1].timestamp);
    const spanSec = (newest - oldest) / 1000;
    return spanSec > 0 ? (data.length - 1) / spanSec : 0;
  }, [data]);

  const transactions = useMemo(() => {
    const txs: (Block["txs"][number] & { timestamp: string })[] = [];
    for (const block of blocks) {
      for (const tx of block.txs) {
        txs.push({ ...tx, timestamp: block.timestamp });
        if (txs.length > 20) return txs;
      }
    }
    return txs;
  }, [blocks]);

  return { blocks, avgBlockTime, transactions };
};
