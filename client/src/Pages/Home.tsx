import { useContext } from "react";
import { ethers } from "ethers";

import { TokenContext } from "../Context/TokenContext";
import Navbar from "../Components/Navbar";

export default function Home() {
  const { contract } = useContext(TokenContext);
  return (
    <>
      <Navbar/>
      <div>Home</div>
    </>
  );
}
