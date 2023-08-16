import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";

import { TokenContext } from "../Context/TokenContext";
import PartnerRequestCard from "../Components/PartnerRequestCard";
import PartnerCard from "../Components/PartnerCard";
import { contractProp } from "../App";

export default function AdminPanel({ contract }: contractProp) {
  const { partners } = useContext(TokenContext);

  interface tokenTypes {
    name: string;
    symbol: string;
    decimal: bigint;
    totalSupply: bigint;
    owner: string;
  }

  const [token, setToken] = useState<tokenTypes>({
    name: "",
    symbol: "",
    decimal: 0n,
    totalSupply: 0n,
    owner: "",
  });

  const getTokenDetails = async () => {
    const namePromise = contract?.name();
    const symbolPromise = contract?.symbol();
    const decimalsPromise = contract?.decimals();
    const totalSupplyPromise = contract?.totalSupply();
    const ownerPromise = contract?.owner();

    const [name, symbol, decimal, totalSupply, owner]: [
      string,
      string,
      bigint,
      bigint,
      string
    ] = await Promise.all([
      namePromise,
      symbolPromise,
      decimalsPromise,
      totalSupplyPromise,
      ownerPromise,
    ]);

    setToken({ name, symbol, decimal, totalSupply, owner });
  };

  useEffect(() => {
    getTokenDetails();
  }, [contract]);
  console.log(typeof token.decimal);
  return (
    <>
    {/* Improve CSS */}
      <div className="flex justify-between">
        <p>{token.name}</p>
        <p>{token.symbol}</p>
        <p>{token.decimal.toString()}</p>
        <p>{token.totalSupply.toString()}</p>
        <p>{token.owner}</p>
      </div>
      <div className="flex w-full gap-2 my-2">
        <PartnerRequestCard contract={contract} />
        <PartnerCard contract={contract} />
      </div>
    </>
  );
}
