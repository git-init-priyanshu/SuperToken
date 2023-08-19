import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { contractProp } from "../App";

export default function PartnerPanel({ contract }: contractProp) {
  const askForTokens = async (tokenAmount: number) => {
    contract && (await contract.askForTokens(tokenAmount));
  };
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}
