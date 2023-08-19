import {useState, useEffect } from "react";
import { ethers } from "ethers";

import ABI from "../Contract/abi.json";

export default function History() {
  const [wssContract, setWssContract] = useState<ethers.Contract | null>(null)
  const [history, setHistory] = useState([]);

  wssContract?.on("RequestForPartnership", (address, event) => {
    let request = {
      from: address,
      eventData: event,
    }
    console.log(JSON.stringify(request.from,null,4));
  });

  useEffect(() => {
    const getContract = ()=>{
      // Getting provider
      const providerURL: string = import.meta.env.VITE_WSSPROVIDER_URI
      const wssprovider = new ethers.WebSocketProvider(providerURL!);
  
      // Getting the deployed contract
      const contract = new ethers.Contract(
        "0x27bd0dcae3b30335514d81d1a1f16e0b5dbde9f9",
        ABI,
        wssprovider
      );

      setWssContract(contract);
    }
    getContract();
  }, []);

  return <div>History</div>;

}
