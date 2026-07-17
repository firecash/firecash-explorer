// The address-lookup moment: a little theatre that tells the truth.
//
// When someone searches an address they expect a balance and a history. On a
// fully-shielded chain there is none — so instead of a flat "no data", the page
// plays the reality: the address characters visibly ENCRYPT into dots while a
// shield draws itself over them, radar rings pulsing. The animation *is* the
// explanation.

import Shield from "../assets/verified_user.svg";
import { useEffect, useRef, useState } from "react";

const DOT = "•";

/** Progressively replace address characters with dots, keeping the prefix. */
function scramble(addr: string, progress: number): string {
  const keep = addr.indexOf(":") + 1;
  const body = addr.slice(keep);
  const n = Math.floor(body.length * progress);
  // Encrypt from random-feeling positions: a deterministic shuffle by char code.
  const order = body
    .split("")
    .map((c, i) => ({ i, k: (c.charCodeAt(0) * 2654435761 + i * 40503) >>> 16 }))
    .sort((a, b) => (a.k % 997) - (b.k % 997))
    .map((x) => x.i);
  const out = body.split("");
  for (let j = 0; j < n; j++) out[order[j]] = DOT;
  return addr.slice(0, keep) + out.join("");
}

export default function ShieldScan({ address }: { address: string }) {
  const [display, setDisplay] = useState(address);
  const [phase, setPhase] = useState<"scan" | "sealed">("scan");
  const raf = useRef(0);

  useEffect(() => {
    setPhase("scan");
    const start = performance.now();
    const SCAN_MS = 700; // pretend-lookup beat before the encryption starts
    const SEAL_MS = 1400; // how long the characters take to seal into dots
    const tick = (now: number) => {
      const t = now - start;
      if (t < SCAN_MS) {
        setDisplay(address);
      } else if (t < SCAN_MS + SEAL_MS) {
        setDisplay(scramble(address, (t - SCAN_MS) / SEAL_MS));
      } else {
        setDisplay(scramble(address, 1));
        setPhase("sealed");
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [address]);

  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-4xl bg-white px-4 py-10 sm:py-12">
      {/* Radar rings */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <span className="shieldscan-ring" />
        <span className="shieldscan-ring" style={{ animationDelay: "0.9s" }} />
        <span className="shieldscan-ring" style={{ animationDelay: "1.8s" }} />
      </div>

      {/* The shield */}
      <div className={`shieldscan-shield ${phase === "sealed" ? "sealed" : ""}`}>
        <Shield className="fill-primary h-16 w-16 sm:h-20 sm:w-20" />
      </div>

      <div className="z-10 mt-5 max-w-xl text-center">
        <div className="text-xl text-black sm:text-2xl">
          {phase === "scan" ? "Looking up address…" : "This address can't be viewed"}
        </div>
        <div
          className={`mx-auto mt-3 max-w-full break-all rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs sm:text-sm ${
            phase === "sealed" ? "text-gray-500" : "text-black"
          }`}
        >
          {display}
        </div>
        <div className={`mt-3 text-sm text-gray-500 transition-opacity duration-700 ${phase === "sealed" ? "opacity-100" : "opacity-0"}`}>
          Balance, history, activity — <span className="text-primary">all encrypted on-chain</span>. Only the key
          holder can see them. That's not a limitation; it's the product.
        </div>
      </div>
    </div>
  );
}
