import { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'

import { contractProp } from "../App";

export default function PartnerCard({ contract }: contractProp) {
  interface partnerInterface {
    address: string;
    tokenAsk: string;
  }
  const [partners, setPartners] = useState<partnerInterface[]>([]);
  console.log(partners)

  const getTokenAsk = async (partner: string) => {
    const ask: bigint = await contract?.partnerAsk(partner);

    return ask.toString();
  };

  // useEffect(() => {
  //   const getAllPartners = async () => {
  //     const partnersArr: string[] = await contract?.getAllPartners();

  //     // Getting requested tokens for each partner
  //     for (let i = 0; i < partnersArr.length; i++) {
  //       const address: string = partnersArr[i];
  //       const tokenAsk: string = await getTokenAsk(address);

  //       const newArr: partnerInterface[] = partners.concat([{ address, tokenAsk }]);
  //       setPartners(newArr);
  //     }
  //   };
  //   contract && getAllPartners();
  // }, [contract]);

  return (
    <div className="w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
      Partners
      <div className="memo bg-neutral-900 bg-opacity-40">
        <table className="table w-full sm:table-auto  text-neutral-300">
          <thead className="justify-between text-left">
            <tr>
              <th className="px-4 py-2">S no.</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Token Ask</th>
              <th className="px-4 py-2">Send Tokens</th>
            </tr>
          </thead>
          <tbody>
            {partners &&
              partners.map((partner, index) => (
                <tr key={partner.address} className="text-left">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{partner.address}</td>
                  <td className="px-4 py-2">{partner.tokenAsk.toString()}</td>
                  <td className="px-4 py-2">
                    <button>Send</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
