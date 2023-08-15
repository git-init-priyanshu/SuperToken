import { useContext } from "react";
import { ethers } from "ethers";

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";

import Iphone from "../assets/iphone-14-pro-finish-select-202209-6-7inch-deeppurple.jpg";
import SonyHeadphones from '../assets/gsmarena_001.jpg'

export default function Home() {
  const { contract } = useContext(TokenContext);
  console.log(contract);
  return (
    <>
      <Navbar />

      <button className=" absolute right-1 bottom-1 bg-sky-500 p-2" onClick={}>Become a Partner</button>

      <div className="grid grid-cols-4 gap-4">
        {/* Iphone */}
        <div className="col-span-1">
          <Card
            image={Iphone}
            name="Apple iPhone 14 Pro Max"
            price="₹ 1,27,999"
          />
        </div>
        {/* Iphone */}
        <div className="col-span-1">
          <Card
            image={SonyHeadphones}
            name="SONY Bluetooth Headset"
            price="₹ 22,990"
          />
        </div>
      </div>
    </>
  );
}
