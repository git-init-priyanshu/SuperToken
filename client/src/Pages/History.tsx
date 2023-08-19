import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

import ABI from "../Contract/abi.json";
import { TokenContext } from "../Context/TokenContext";

export default function History() {
  const {wallet} = useContext(TokenContext)

  const [wssContract, setWssContract] = useState<ethers.Contract | null>(null);
  const [receivedHistory, setReceivedHistory] = useState<any[]>([]);
  const [sentHistory, setSentHistroy] = useState<any[]>([]);


  const topic0 = "TokenIssued(address, address, uint)";
  const uint8Array = ethers.toUtf8Bytes(topic0);

  const transactionHash = ethers.keccak256(uint8Array);
  console.log(transactionHash)

  // to get value sent

  wssContract?.on("TokenIssued", (from, to, amount, event) => {
    let request = {
      from: from,
      to: to,
      amount: amount,
      eventData: event,
    };
    const arr = [request];

    if(arr[0].to != wallet.accounts[0]) return;

    setReceivedHistory(receivedHistory.concat(arr));
  });

  wssContract?.on("TokenUsed", (by, to, amount, event) => {
    let request = {
      by: by,
      to: to,
      amount: amount,
      eventData: event,
    };
    const arr = [request];

    if(arr[0].by != wallet.accounts[0]) return;

    setSentHistroy(sentHistory.concat(arr));
  });

  useEffect(() => {
    const getContract = () => {
      // Getting provider
      const providerURL: string = import.meta.env.VITE_WSSPROVIDER_URI;
      const wssprovider = new ethers.WebSocketProvider(providerURL!);

      // Getting the deployed contract
      const contract = new ethers.Contract(
        "0x227c385a651d764c04f78243996d817b73aa5586",
        ABI,
        wssprovider
      );

      setWssContract(contract);
    };
    getContract();
  }, []);

  return (
    <>
    <div className="memo bg-neutral-900 bg-opacity-40 overflow-scroll">
      <table className="table w-full sm:table-auto  text-neutral-300 ">
        <thead className="justify-between text-left">
          <tr>
            <th className="px-4 py-2">S no.</th>
            <th className="px-4 py-2">Token Amount</th>
            <th className="px-4 py-2">Received From</th>
          </tr>
        </thead>
        <tbody>
          {receivedHistory &&
            receivedHistory.map((e, index) => (
              <tr key={e.address} className="text-left">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{e.amount}</td>
                <td className="px-4 py-2">{e.from}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>


    <div className="memo bg-neutral-900 bg-opacity-40 overflow-scroll">
      <table className="table w-full sm:table-auto  text-neutral-300 ">
        <thead className="justify-between text-left">
          <tr>
            <th className="px-4 py-2">S no.</th>
            <th className="px-4 py-2">Token Amount</th>
            <th className="px-4 py-2">Sent to</th>
          </tr>
        </thead>
        <tbody>
          {sentHistory &&
            sentHistory.map((e, index) => (
              <tr key={e.address} className="text-left">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{e.amount}</td>
                <td className="px-4 py-2">{e.to}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
