import { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

import { ContextProvider } from "./Context/TokenContext";
import Home from "./Pages/Home";
import AdminPanel from "./Pages/AdminPanel";
import PartnerPanel from "./Pages/PartnerPanel";
import History from "./Pages/History";
import abi from "./Contract/abi.json";

export interface contractProp {
  contract: ethers.Contract | null;
}

function App() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const contractAddress = "0xade400fffa48494ee1be4859f20c781d73d8d5e3";

  const getContract = (
    QUICKNODE_URI: string = import.meta.env.VITE_QUICKNODE_URI,
    PRIVATE_KEY: string = import.meta.env.VITE_PRIVATE_KEY
  ) => {
    // Getting provider
    const provider = ethers.getDefaultProvider(QUICKNODE_URI!);

    // Getting signer
    const signer = new ethers.Wallet(PRIVATE_KEY!, provider);

    // Getting the deployed contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    setContract(contract);
  };

  // Getting env variables while in production
  useEffect(() => {
    console.log(import.meta.env.MODE);
    if (import.meta.env.DEV) return;
    const getEnvVariables = async () => {
      const response = await axios.get(
        // "http://localhost:4000/api/getEnvVariables"
        "https://supertoken-backend-zu8o.onrender.com/api/getEnvVariables"
      );

      const QUICKNODE_URI = response.data.QUICKNODE_URI;
      const PRIVATE_KEY = response.data.PRIVATE_KEY;

      getContract(QUICKNODE_URI, PRIVATE_KEY);
    };
    getEnvVariables();
  }, []);

  // Defining router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home contract={contract} />} />
        <Route path="/admin" element={<AdminPanel contract={contract} />} />
        <Route path="/partner" element={<PartnerPanel contract={contract} />} />
        <Route path="/history" element={<History />} />
      </Route>
    )
  );

  return (
    <div className="mx-2 sm: lg:mx-10 ">
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </div>
  );
}

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
