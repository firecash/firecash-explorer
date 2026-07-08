import AccountBalanceWallet from "../assets/account_balance_wallet.svg";
import Shield from "../assets/verified_user.svg";
import Coins from "../assets/coins.svg";
import Swap from "../assets/swap.svg";
import { BRAND } from "../config/brand";
import { useShieldedPool } from "../hooks/useShieldedPool";
import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import MainBox from "../layout/MainBox";
import numeral from "numeral";

export function meta() {
  return [
    { title: "FireCash Addresses | FireCash Explorer" },
    {
      name: "description",
      content:
        "FireCash addresses are shielded: balances and history are encrypted on-chain. Explore the shielded pool instead.",
    },
    { name: "keywords", content: "FireCash addresses, shielded, privacy, Orchard, encrypted balances" },
  ];
}

// FireCash is shielded-by-default: address balances and rich lists simply do not
// exist as public data, so instead of a (fake) top-addresses table this page shows
// what IS publicly verifiable — the shielded pool itself.
export default function Addresses() {
  const { data: shielded, isLoading } = useShieldedPool();
  const sompiToFc = (v?: string) => numeral((Number(v) || 0) / 1_0000_0000).format("0,0");

  return (
    <>
      <MainBox>
        <CardContainer title="Addresses on a shielded chain">
          <Card
            title="Shielded notes"
            loading={isLoading}
            value={numeral(shielded?.noteCount ?? 0).format("0,0")}
            subtext="encrypted outputs in the pool"
          />
          <Card
            title="Value shielded"
            loading={isLoading}
            value={`${sompiToFc(shielded?.turnstileIn)} FC`}
            subtext="total entered via the turnstile"
          />
          <Card
            title="Shielded spends"
            loading={isLoading}
            value={numeral(shielded?.nullifierCount ?? 0).format("0,0")}
            subtext="nullifiers revealed"
          />
          <Card
            title="Emission per block"
            loading={isLoading}
            value={`${shielded?.emissionPerBlock ?? BRAND.initialReward} FC`}
            subtext="minted straight into the pool"
          />
        </CardContainer>
      </MainBox>

      <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left sm:p-8">
        <div className="mb-2 flex items-center gap-x-3">
          <Shield className="fill-primary w-6" />
          <span className="text-black text-2xl">Why is there no rich list?</span>
        </div>
        <p className="text-gray-500 max-w-3xl">
          Every {BRAND.name} address is a shielded Orchard address. Balances, senders, receivers and amounts are
          encrypted on-chain — they are visible only to the key holder (and to anyone they share a viewing key with).
          A public "top addresses" table therefore cannot exist on this chain; that is the point.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-5">
            <AccountBalanceWallet className="fill-primary mb-2 w-5" />
            <div className="text-black mb-1">Balances are private</div>
            <span className="text-gray-500">
              An address carries no public balance. Funds live as encrypted notes only the owner can detect.
            </span>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <Swap className="fill-primary mb-2 w-5" />
            <div className="text-black mb-1">Spends reveal only nullifiers</div>
            <span className="text-gray-500">
              Spending publishes a one-time nullifier — unlinkable to the note it consumes or to any address.
            </span>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <Coins className="fill-primary mb-2 w-5" />
            <div className="text-black mb-1">Supply stays auditable</div>
            <span className="text-gray-500">
              The turnstile reconciles value entering and leaving the pool, so privacy never hides inflation.
            </span>
          </div>
        </div>
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        A {BRAND.name} address is a shielded (Orchard) address: it can receive encrypted notes, and proves ownership
        without ever exposing its balance or history to the public ledger.
      </FooterHelper>
    </>
  );
}
