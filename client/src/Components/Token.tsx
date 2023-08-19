import { useState, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";

import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function Token({ contract }: contractProp) {
  const {wallet} = useContext(TokenContext);

  const [input, setInput] = useState<number>(0);

  const [to, setTo] = useState<string>()
  const [amount, setAmount] = useState<number>(0)

  const mintToken = async (tokenAmount: number) => {
    contract &&
      toast.promise(contract?.mintTokens(tokenAmount), {
        loading: "Minting Token...",
        success: <b>Tokens minted sucessfully</b>,
        error: <b>Some error occured</b>,
      });
  };

  const handleOnSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault;

    await contract?.issueToken(wallet.accounts[0], to, amount)
  }

  return (
    <>
      {/* Mint token */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="flex gap-2 mt-2">
        <input
          type="number"
          className=" w-full outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
          placeholder="Specify the number of tokens for minting."
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
        />
        <button
          className=" w-40 rounded p-2 bg-green-700 hover:bg-green-900 bg-opacity-80"
          onClick={() => mintToken(input)}
        >
          Mint Tokens
        </button>
      </div>

      <form className="flex gap-2 mt-2" onSubmit={handleOnSubmit}>
        <input
          type="text"
          className=" w-full outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
          placeholder="Specify the number of tokens for minting."
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="number"
          className=" w-full outline-none p-2 bg-neutral-700 bg-opacity-80 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
          placeholder="Specify the number of tokens for minting."
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
        />
        <button
        type="submit"
          className=" w-40 rounded p-2 bg-green-700 hover:bg-green-900 bg-opacity-80"
        >
          Send Token
        </button>
      </form>
    </>
  );
}
