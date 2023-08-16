import { useEffect, useState, useContext } from "react";

import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function PartnerRequestCard({ contract }: contractProp) {
  const {partners} = useContext(TokenContext);

  const addPartner = async (partner: string) => {
    contract && (await contract.addAsPartner(partner));
  };

  return (
    <div className="partnersCard overflow-scroll w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
      <h1>Partners Request</h1>
      {partners.map((partner) => {
        return (
          <div key={partner} className="flex gap-2 my-2 justify-between">
            <div className="rounded w-full p-2 bg-neutral-700 bg-opacity-90">
              {partner}
            </div>
            <button
              className="rounded p-2 bg-neutral-700 bg-opacity-80"
              onClick={() => addPartner(partner)}
            >
              Add
            </button>
          </div>
        );
      })}
    </div>
  );
}
