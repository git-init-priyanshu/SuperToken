import React from "react";
import { ethers } from "ethers";

interface partnerProps {
  contract: ethers.Contract | null;
}

export default function PartnerPanel({ contract }: partnerProps) {
  const askForTokens = async (tokenAmount: number) => {
    contract && (await contract.askForTokens(tokenAmount));
  };
  return <div>PartnerPanel</div>;
}
