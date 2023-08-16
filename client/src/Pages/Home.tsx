import { useContext } from "react";
import _ from "lodash";

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";
import data from "../Data/data";
import {contractProp} from '../App'

export default function Home({contract}: contractProp) {
  const { partners, setPartners, wallet } = useContext(TokenContext);

  const becomePartner = () => {
    const accountAddress = wallet.accounts[0];

    const newArr = partners.concat([accountAddress]);

    console.log(partners);

    if (partners[0] == "") return setPartners(newArr.slice(1, newArr.length));
    setPartners(newArr);
  };

  return (
    <>
      <Navbar contract={contract}/>

      <div>
        <button
          className=" fixed rounded right-4 bottom-10 bg-sky-500 p-2"
          onClick={becomePartner}
        >
          Become a Partner
        </button>

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
