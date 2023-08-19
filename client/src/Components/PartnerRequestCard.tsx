import { useState, useEffect } from "react";
import { contractProp } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

export default function PartnerRequestCard({ contract }: contractProp) {
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const getAllRequests = async () => {
      const requests: string[] = await contract?.getAllRequests();

      setRequests(requests);
    };
    contract && getAllRequests();
  }, [contract, requests]);

  const addPartner = async (partner: string) => {
    contract && toast.promise(contract.addAsPartner(partner),{
      loading: "Adding as a Partner...",
      success: <b>Partner added</b>,
      error: <b>Some error occured</b>,
    })
  };

  const removeRequest = async (address: string) => {
    contract && toast.promise(contract.rejectRequest(address),{
      loading: "Removing request...",
      success: <b>Request removed</b>,
      error: <b>Some error occured</b>,
    })
  };

  return (
    <>
      <div className="partnersCard overflow-y-auto w-1/2 px-4 py-2 rounded bg-neutral-700 bg-opacity-80">
        <Toaster position="bottom-center" reverseOrder={false}/>
        <h1>Partners Request</h1>
        {requests.map((request) => {
          return (
            <div key={request} className="flex gap-2 my-2 justify-between">
              <div className="rounded w-full px-2 pt-2 text-center bg-neutral-900 bg-opacity-40 overflow-x-auto">
                {request}
              </div>
              <button
                className="rounded p-2 w-20 bg-sky-700 hover:bg-sky-900 bg-opacity-80"
                onClick={() => addPartner(request)}
              >
                Add
              </button>
              <button
                className="rounded p-2 w-60 bg-red-800 hover:bg-red-950 bg-opacity-80"
                onClick={() => removeRequest(request)}
              >
                Reject Request
              </button>
            </div>
          );
        })}
      </div>
    </>

  );
}
