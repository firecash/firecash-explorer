import { API_BASE } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTransactionCount = () =>
  useQuery({
    queryKey: ["transactionCount", {}],
    queryFn: async () => {
      // FireCash's backend serves a single cumulative count (no per-date buckets).
      const { data } = await axios.get<TransactionCount>(`${API_BASE}/transactions/count`);
      return [data];
    },
    retry: false,
  });

export interface TransactionCount {
  timestamp: number;
  dateTime: string;
  coinbase: number;
  regular: number;
}
