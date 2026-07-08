import { API_BASE } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// The FireCash backend has no socket feed; poll the blockdag info instead. On this
// linear chain the virtual DAA score tracks the sink's blue score, which is what the
// confirmations count needs.
export const useVirtualChainBlueScore = () => {
  const { data } = useQuery({
    queryKey: ["virtualChainBlueScore"],
    queryFn: async () => {
      const { data } = await axios.get<{ virtualDaaScore: string }>(`${API_BASE}/info/blockdag`);
      return parseInt(data.virtualDaaScore, 10);
    },
    refetchInterval: 3000,
    retry: false,
  });

  return { virtualChainBlueScore: data };
};
