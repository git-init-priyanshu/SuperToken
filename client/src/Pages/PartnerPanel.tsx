import { useState, useEffect, useContext, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";

import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function PartnerPanel({ contract }: contractProp) {
  const { wallet } = useContext(TokenContext);

  const [input, setInput] = useState<number>(0);
  const [ask, setAsk] = useState<string>("0");
  const [totalTokens, setTotalTokens] = useState<string>("0");

  const [to, setTo] = useState<string>();
  const [amount, setAmount] = useState<number>(0);

  const askForTokens = async (tokenAmount: number) => {
    contract &&
      toast.promise(contract.askForTokens(wallet.accounts[0], tokenAmount), {
        loading: "Sending token request...",
        success: <b>Request sent</b>,
        error: <b>Some error occured</b>,
      });

    setInput(0);
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

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(totalTokens) < amount)
      return toast.error("Don't have enough tokens");

    contract &&
      toast.promise(contract.issueTokens(wallet.accounts[0], to, amount), {
        loading: "Sending token...",
        success: <b>Token Sent</b>,
        error: <b>Some error occured</b>,
      });
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />

      <h1 className="text-center text-5xl mt-2 mb-2">Partner Panel</h1>

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
              <td className="px-4 py-2 text-center border-r">
                {wallet.accounts[0]}
              </td>
              <td className="px-4 py-2 text-center">{ask}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form className="flex gap-4 mt-4 mb-4" onSubmit={handleOnSubmit}>
        <div className="w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
          <label className="text-neutral-300">Ask for Tokens</label>
          <input
            type="number"
            className=" w-full mt-1 mb-3 outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
            placeholder="Specify the number of tokens you want."
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
          <button
            className=" w-40 rounded p-2 bg-green-700 hover:bg-green-900 bg-opacity-80"
            onClick={() => askForTokens(input)}
          >
            Ask for tokens
          </button>
        </div>

        <div className="w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
          <label className="text-neutral-300">Reciever's Address</label>
          <input
            type="text"
            className=" w-full mt-1 mb-3 outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
            placeholder="Paste receiver's address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <label className="text-neutral-300">Amount</label>
          <input
            type="number"
            className=" w-full mt-1 mb-3 outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
            placeholder="Specify the number of tokens"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <button
            type="submit"
            className=" w-40 rounded p-2 bg-green-700 hover:bg-green-900 bg-opacity-80"
          >
            Issue Tokens
          </button>
        </div>
      </form>
    </>
  );
}
