import { useState, useContext } from "react";
import { ethers } from "ethers";

import { TokenContext } from "../Context/TokenContext";
import PartnerRequestCard from "../Components/PartnerRequestCard";
import PartnerCard from "../Components/PartnerCard";
import {contractProp} from '../App'

export default function AdminPanel({ contract }: contractProp) {
  const { partners } = useContext(TokenContext);

  interface tokenTypes {
    name: string;
    symbol: string;
    decimal: number;
    totalSupply: number;
    owner: string;
  }

  const [token, setToken] = useState<tokenTypes>({
    name: "",
    symbol: "",
    decimal: 0,
    totalSupply: 0,
    owner: "",
  });

  const makePartner = async (partner: string)=>{
    // Check is partner exists in partners array
    contract && await contract.addAsPartner(partner);
  }

  return <div className="flex w-full gap-2 my-2">
    <PartnerRequestCard contract={contract}/>
    <PartnerCard contract={contract}/>
  </div>;
}
