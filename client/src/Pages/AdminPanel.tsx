import { useState, useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import PartnerRequestCard from "../Components/PartnerRequestCard";
import PartnerCard from "../Components/PartnerCard";
import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";
import Token from "../Components/Token";

export default function AdminPanel({ contract }: contractProp) {
  const { wallet } = useContext(TokenContext);

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
  }, [contract, wallet, token.totalSupply]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />

      <h1 className="text-center text-5xl mt-2 mb-2">Admin Panel</h1>

      <div className="memo mt-2 rounded bg-neutral-700 bg-opacity-80">
        <table className="table w-full sm:table-auto  text-neutral-300">
          <thead className="justify-between text-center">
            <tr>
              <th className="px-4 py-2 w-5/12 border-r">Token Name</th>
              <th className="px-4 py-2 w-5/12 border-r">Token Symbol</th>
              <th className="px-4 py-2 w-5/12 border-r">Total Supply</th>
              <th className="px-4 py-2 w-5/12">Admin</th>
            </tr>
          </thead>
          <tbody>
            {token.name != undefined && (
              <tr className="text-left">
                <td className="px-4 py-2 w-5/12 overflow-hidden text-center border-r">
                  {token.name}
                </td>
                <td className="px-4 py-2 w-5/12 overflow-hidden text-center border-r">
                  {token.symbol}
                </td>
                <td className="px-4 py-2 w-5/12 overflow-hidden text-center border-r">
                  {token.totalSupply.toString()}
                </td>
                <td className="px-4 py-2 w-5/12 overflow-hidden text-center">
                  {token.owner}
                </td>
                <td className="px-4 py-2 w-5/12 overflow-hidden text-center"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Token contract={contract} />

      <div className="flex w-full gap-2 my-2">
        <PartnerRequestCard contract={contract} />
        <PartnerCard contract={contract} />
      </div>
    </>
  );
}
