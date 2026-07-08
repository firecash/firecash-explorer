import Dashboard from "../Dashboard";

export function meta() {
  return [
    { title: "FireCash Explorer | Track Blocks & Transactions" },
    {
      name: "description",
      content: "FireCash Explorer. Track transactions, blocks, miners, and the BlockDAG in real-time.",
    },
    { name: "keywords", content: "FireCash explorer, blockchain tracker, FireCash blocks, transactions, miners, DAG" },
  ];
}

export default function Home() {
  return (
    <div className="text-base">
      <Dashboard />
    </div>
  );
}
