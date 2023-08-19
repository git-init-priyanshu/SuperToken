import { useState, useContext, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function Token({ contract }: contractProp) {
  const modalRef = useRef(null);

  const { wallet } = useContext(TokenContext);

  window.onclick = (event) => {
    const modal: any = modalRef.current;
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const toggleModal = () => {
    const modal: any = modalRef.current;

    let displayProperty = modal.style.display;
    if (displayProperty === "block") return (modal.style.display = "none");
    modal.style.display = "block";
  };

  const [input, setInput] = useState<number>(0);

  const [to, setTo] = useState<string>();
  const [amount, setAmount] = useState<number>(0);

  const mintToken = async (tokenAmount: number) => {
    contract &&
      toast.promise(contract?.mintTokens(tokenAmount), {
        loading: "Minting Token...",
        success: <b>Tokens minted sucessfully</b>,
        error: <b>Some error occured</b>,
      });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const owner: string = await contract?.owner();

    contract &&
      toast.promise(contract.issueTokens(owner, to, amount), {
        loading: "Sending token...",
        success: <b>Token Sent</b>,
        error: <b>Some error occured</b>,
      });

    toggleModal();
  };

  return (
    <>
      {/* Mint token */}
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Floating button */}
      <div
        onClick={toggleModal}
        className="fixed cursor-pointer z-10 p-2 bg-green-700 hover:bg-green-900 rounded right-10 bottom-10"
      >
        Send Token
      </div>

      {/* Mint token */}
      <div className="flex gap-2 mt-4 mb-4">
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

      {/* New Doc Modal */}
      <div id="myModal" className="modal" ref={modalRef}>
        <div className="modal-content relative">
          <span className="close" onClick={toggleModal}>
            &times;
          </span>
          <div className="modal-body">
            <form className="gap-2 mt-2" onSubmit={handleOnSubmit}>
              <label className=" text-neutral-500">Reciever's Address</label>
              <input
                type="text"
                className=" w-full text-black bg-neutral-100 mb-2 outline-none p-2 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
                placeholder="Paste receiver's address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <label className=" text-neutral-500">Amount</label>
              <input
                type="number"
                className=" w-full text-black bg-neutral-100 mb-2 outline-none p-2 border-b-2 border-neutral-400 hover:border-green-600 focus:border-green-600"
                placeholder="Specify the number of tokens"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <button
                type="submit"
                className=" w-40 rounded p-2 bg-green-700 hover:bg-green-900 bg-opacity-80"
              >
                Send Token
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
