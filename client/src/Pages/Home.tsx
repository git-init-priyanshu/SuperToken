import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import _ from "lodash";

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";
import data from "../Data/data";
import { contractProp } from "../App";

export default function Home({ contract }: contractProp) {
  const { wallet } = useContext(TokenContext);
  const [isPartner, setIsPartner] = useState<Boolean>(false);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  const navigate = useNavigate();

  const checkForAdmin = useCallback(async () => {
    const admin = await contract?.owner();
    setIsAdmin(admin.toLowerCase() == wallet.accounts[0]);
  }, [contract, wallet]);

  const checkForPartner = useCallback(async () => {
    const isPartner = await contract?.isPartner(wallet.accounts[0]);
    setIsPartner(isPartner);
  }, [contract, wallet]);

  useEffect(() => {
    checkForAdmin();
    checkForPartner();
  }, [contract, wallet]);

  const becomePartner = async () => {
    contract && toast.promise(contract.askForPartnership(wallet.accounts[0]), {
      loading: "Sending Request...",
      success: <b>Request Sent</b>,
      error: <b>Some error occured</b>,
    });
  };

  const handleOnClick = async () => {
    if (isPartner) return navigate("/partner");
    becomePartner();
  };

  return (
    <>
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
      
      <Navbar contract={contract} />

      <div>
        {/* If admin -> show admin button, else -> show partner button */}
        {isAdmin ? (
          <button
            className="fixed z-10 p-2 bg-green-400 rounded  right-4 bottom-10"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        ) : (
          <button
            className="fixed p-2 rounded  right-4 bottom-10 bg-sky-500"
            onClick={handleOnClick}
          >
            {`${isPartner ? "Partner Panel" : "Become a Partner"}`}
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 sm: md:grid-cols-3 lg:grid-cols-4 ">
          {data.map((product) => {
            return (
              <div className="col-span-1 " key={product.name}>
                <Card
                  sellerName={product.sellerName}
                  sellerAddress={product.sellerAddress}
                  image={product.img}
                  name={product.name}
                  price={product.price}
                  tokenValue={product.tokenValue}
                  contract={contract}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
