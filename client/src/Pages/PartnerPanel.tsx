import { useState, useEffect, useContext, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";

import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function PartnerPanel({ contract }: contractProp) {
  const { wallet } = useContext(TokenContext);

  // const [address, setAddress] = useState<string>("");
  const [ask, setAsk] = useState<string>("0");
  const [totalTokens, setTotalTokens] = useState<string>("0");

  const askForTokens = async (tokenAmount: number) => {
    contract &&
      toast.promise(contract.askForTokens(wallet.accounts[0], tokenAmount), {
        loading: "Sending token request...",
        success: <b>Request sent</b>,
        error: <b>Some error occured</b>,
      });
  };

  const getTokenAsk = useCallback(async () => {
    const ask: bigint = await contract?.partnerAsk(wallet.accounts[0]);

    setAsk(ask.toString());
  }, [contract, wallet]);

  const getTotalTokens = useCallback(async () => {
    const tokenNumber: bigint = await contract?.balanceOf(wallet.accounts[0]);

    setTotalTokens(tokenNumber.toString());
  }, [contract, wallet]);

  useEffect(() => {
    getTokenAsk();
    getTotalTokens();
  }, [contract, wallet]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="memo mt-2 mb-2 rounded bg-neutral-700 bg-opacity-80">
        <table className="table w-full sm:table-auto  text-neutral-300">
          <thead className="justify-between text-left">
            <tr>
              <th className="px-4 py-2 text-center border-r">Total tokens</th>
              <th className="px-4 py-2 text-center border-r">Address</th>
              <th className="px-4 py-2 text-center">Token Ask</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-left">
              <td className="px-4 py-2 text-center border-r">{totalTokens}</td>
              <td className="px-4 py-2 text-center border-r">{wallet.accounts[0]}</td>
              <td className="px-4 py-2 text-center">{ask}</td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </>
  );
}
