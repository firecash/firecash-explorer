import KasLink from "../KasLink";
import IconMessageBox from "../IconMessageBox";
import ShieldScan from "../components/ShieldScan";
import AccountBalanceWallet from "../assets/account_balance_wallet.svg";
import Shield from "../assets/verified_user.svg";
import Visibility from "../assets/visibility.svg";
import Swap from "../assets/swap.svg";
import { BRAND } from "../config/brand";
import FooterHelper from "../layout/FooterHelper";
import { isValidKaspaAddressSyntax } from "../utils/kaspa";
import type { Route } from "./+types/addressdetails";
import { useParams } from "react-router";

export function meta({ params }: Route.LoaderArgs) {
  return [
    { title: `ZKas Address ${params.address} | ZKas Explorer` },
    {
      name: "description",
      content: "A shielded ZKas address. Balance and history are encrypted on-chain, visible only to the key holder.",
    },
    { name: "keywords", content: "ZKas address, shielded address, Orchard, privacy, encrypted balance" },
  ];
}

// ZKas addresses are shielded Orchard addresses: the chain stores only
// encrypted notes, so there is no public balance, UTXO set or history to show.
// This page validates the address and explains exactly what is (not) public.
export default function AddressDetails() {
  const { address } = useParams();
  const valid = address ? isValidKaspaAddressSyntax(address) : false;

  if (!address || !valid) {
    return (
      <IconMessageBox
        icon="error"
        title="Invalid address"
        description={`"${address ?? ""}" is not a valid ${BRAND.name} address.`}
      />
    );
  }

  return (
    <>
      {/* The lookup theatre: the address visibly encrypts, a shield seals it. */}
      <ShieldScan address={address} />

      <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left text-black sm:p-8">
        <div className="flex flex-row items-center text-2xl">
          <AccountBalanceWallet className="mr-2 h-8 w-8 fill-primary" />
          <span>Shielded address</span>
        </div>

        <span className="mt-6 text-gray-500">Address</span>
        <div className="mt-1 break-all font-mono text-sm sm:text-base">
          <KasLink linkType="address" to={address} copy qr mono />
        </div>

        <div className="my-6 h-[1px] w-full bg-gray-100" />

        <div className="flex items-start gap-x-3 rounded-2xl border border-gray-200 p-5">
          <Shield className="fill-primary mt-1 w-6 shrink-0" />
          <div>
            <div className="mb-1 text-lg">This address is private by design</div>
            <span className="text-gray-500">
              On {BRAND.name}, every transfer is a shielded Orchard (zk-SNARK) transaction. The ledger holds only
              encrypted notes and one-time nullifiers — so this address's balance, incoming and outgoing history are
              not recorded publicly anywhere. Only the wallet that owns it (or someone holding its viewing key) can
              see its funds.
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-5">
            <Visibility className="fill-primary mb-2 w-5" />
            <div className="mb-1">Want to prove you own it?</div>
            <span className="text-gray-500">
              The {BRAND.name} wallet can sign a message with this address — anyone can verify the signature offline
              without you spending or exposing anything beyond a viewing key.
            </span>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <Swap className="fill-primary mb-2 w-5" />
            <div className="mb-1">Want to audit funds?</div>
            <span className="text-gray-500">
              Share the wallet's viewing key with an auditor: it reveals this address's notes (view-only) while spend
              authority stays exclusively with the owner.
            </span>
          </div>
        </div>
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        A {BRAND.name} address is a shielded (Orchard) address: it can receive encrypted notes and prove ownership,
        without ever exposing its balance or history to the public ledger.
      </FooterHelper>
    </>
  );
}
