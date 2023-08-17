import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";
import data from "../Data/data";
import { contractProp } from "../App";

export default function Home({ contract }: contractProp) {
  const { partners, setPartners, wallet } = useContext(TokenContext);
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

  const becomePartner = () => {
    const accountAddress = wallet.accounts[0];

    const newArr = partners.concat([accountAddress]);

    console.log(partners);

    if (partners[0] == "") return setPartners(newArr.slice(1, newArr.length));
    setPartners(newArr);
  };

  const handleOnClick = async () => {
    if (isPartner) return navigate("/partner");
    becomePartner();
  };

  return (
    <>
      <Navbar contract={contract} />

      <div>
        {/* If admin -> show admin button, else -> show partner button */}
        {isAdmin ? (
          <button
            className=" fixed rounded right-4 bottom-10 z-10 bg-green-400 p-2"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        ) : (
          <button
            className=" fixed rounded right-4 bottom-10 bg-sky-500 p-2"
            onClick={handleOnClick}
          >
            {`${isPartner ? "Partner Panel" : "Become a Partner"}`}
          </button>
        )}

        <div className="grid gap-4 sm: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {data.map((product) => {
            return (
              <div className=" col-span-1" key={product.name}>
                <Card
                  sellerName={product.sellerName}
                  sellerAddress={product.sellerAddress}
                  image={product.img}
                  name={product.name}
                  price={product.price}
                  tokenValue={product.tokenValue}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
