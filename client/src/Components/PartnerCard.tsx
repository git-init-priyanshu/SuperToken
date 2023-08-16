import { useState, useEffect } from "react";

import { contractProp } from "../App";

export default function PartnerCard({ contract }: contractProp) {
  interface partnerInterface {
    address: string;
    tokenAsk: number;
  }
  const [partners, setPartners] = useState<partnerInterface[] | null>(null);

  const getTokenAsk = async (partner: string) => {
    const ask: number = await contract?.partners(partner);

    return ask;
  };

  useEffect(() => {
    const getAllPartners = async () => {
      const partners = await contract?.getAllPartners();

      for (let i = 0; i < partners.length; i++) {
        const address = partners[i];
        const tokenAsk = getTokenAsk(address);

        const newArr = partners.concat([{ address, tokenAsk }]);
        setPartners(newArr);
      }
    };
    contract && getAllPartners();
  }, [contract]);

  return (
    <div className="w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
      Partners
      <div className="memo bg-neutral-900 bg-opacity-40">
        <table className="table w-full sm:table-auto  text-neutral-300">
          <thead className="justify-between text-left">
            <tr>
              <th className="px-4 py-2 w-5/12">S no.</th>
              <th className="px-4 py-2 w-5/12">Address</th>
              <th className="px-4 py-2 w-5/12">Token Ask</th>
              <th className="px-4 py-2 w-5/12">Send Tokens</th>
            </tr>
          </thead>
          <tbody>
            {partners &&
              partners.map((partner, index) => (
                <tr key={partner.address} className="text-left">
                  <td className="px-4 py-2 w-5/12 overflow-hidden">{index + 1}</td>
                  <td className="px-4 py-2 w-5/12 overflow-hidden">{partner.address}</td>
                  <td className="px-4 py-2 w-5/12 overflow-hidden">{partner.tokenAsk}</td>
                  <td className="px-4 py-2 w-5/12 overflow-hidden">
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
