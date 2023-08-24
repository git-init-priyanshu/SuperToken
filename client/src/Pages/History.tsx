import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { TokenContext } from "../Context/TokenContext";

export default function History() {
  const { wallet } = useContext(TokenContext);

  interface dataType {
    status: string,
    address: string,
    tokenAmount: string
  }

  const [history, setHistory] = useState<dataType[]>([]);
console.log(history)
  useEffect(() => {
    interface responseType {
      historyArr: dataType[];
    }
    const getHistroy = async () => {
      const response = await axios.post(
        "http://localhost:4000/api/history",
        {
          account: wallet.accounts[0],
        }
      );
      const data:responseType = response.data;
      console.log(data)
      setHistory(data.historyArr);
    };
    getHistroy();
  }, [wallet]);

  return (
    <>
      <div className="memo bg-neutral-900 bg-opacity-40 overflow-scroll">
        <table className="table w-full sm:table-auto  text-neutral-300 ">
          <thead className="justify-between text-left">
            <tr>
              <th className="px-4 py-2">S no.</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">To / From</th>
              <th className="px-4 py-2">Token Amount</th>
            </tr>
          </thead>
          <tbody>
            {history &&
              history.map((e, index) => (
                <tr key={e.address} className="text-left">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{e.status}</td>
                  <td className="px-4 py-2">{e.address}</td>
                  <td className="px-4 py-2">{e.tokenAmount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
