import Dashboard from "../Dashboard";

export function meta() {
  return [
    { title: "ZKas Explorer | Track Blocks & Transactions" },
    {
      name: "description",
      content: "ZKas Explorer. Track transactions, blocks, miners, and the BlockDAG in real-time.",
    },
    { name: "keywords", content: "ZKas explorer, blockchain tracker, ZKas blocks, transactions, miners, DAG" },
  ];
}

export default function Home() {
  return (
    <div className="text-base">
      <Dashboard />
    </div>
  );
}
