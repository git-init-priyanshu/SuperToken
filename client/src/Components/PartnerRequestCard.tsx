import { useState, useEffect } from "react";
import { contractProp } from "../App";

export default function PartnerRequestCard({ contract }: contractProp) {
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const getAllRequests = async () => {
      const requests: string[] = await contract?.getAllRequests();

      setRequests(requests);
    };
    contract && getAllRequests();
  }, [contract]);

  const addPartner = async (partner: string) => {
    contract && (await contract.addAsPartner(partner));
  };

  const removeRequest = async(address: string)=>{
    contract && await contract.rejectRequest(address);
  }

  return (
    <div className="partnersCard overflow-scroll w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
      <h1>Partners Request</h1>
      {requests.map((request) => {
        return (
          <div key={request} className="flex gap-2 my-2 justify-between">
            <div className="rounded w-full p-2 bg-neutral-900 bg-opacity-40">
              {request}
            </div>
            <button
              className="rounded p-2 bg-neutral-700 bg-opacity-80"
              onClick={() => addPartner(request)}
            >
              Add
            </button>
            <button
              className="rounded p-2 bg-neutral-700 bg-opacity-80"
              onClick={() => removeRequest(request)}
            >
              Reject Request
            </button>
          </div>
        );
      })}
    </div>
  );
}
