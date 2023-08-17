import { useState, useContext, useEffect } from "react";

import PartnerRequestCard from "../Components/PartnerRequestCard";
import PartnerCard from "../Components/PartnerCard";
import { contractProp } from "../App";

export default function AdminPanel({ contract }: contractProp) {
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
  // console.log(token);

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

  return (
    <>
      {/* Improve CSS */}
      <div className="flex justify-between">
        {token.name != undefined ? (
          <>
            <p>{token.name}</p>
            <p>{token.symbol}</p>
            <p>{token.decimal.toString()}</p>
            <p>{token.totalSupply.toString()}</p>
            <p>{token.owner}</p>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex w-full gap-2 my-2">
        <PartnerRequestCard contract={contract} />
        <PartnerCard contract={contract} />
      </div>
    </>
  );
}
