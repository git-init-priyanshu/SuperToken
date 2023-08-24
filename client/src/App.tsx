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
  // const { setContract } = useContext(TokenContext);

  const [QUICKNODE_URI, setQUICKNODE_URI] = useState(
    import.meta.env.VITE_QUICKNODE_URI
  );
  const [PRIVATE_KEY, setPRIVATE_KEY] = useState(
    import.meta.env.VITE_PRIVATE_KEY
  );

  // Getting env variables while in production
  useEffect(() => {
    if (import.meta.env.DEV) return;
    const getEnvVariables = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/getEnvVariables"
      );
      setQUICKNODE_URI(response.data.QUICKNODE_URI);
      setPRIVATE_KEY(response.data.PRIVATE_KEY);
    };
    getEnvVariables();
  }, []);

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const contractAddress = "0xade400fffa48494ee1be4859f20c781d73d8d5e3";

  useEffect(() => {
    const getContract = () => {
      // Getting provider
      const provider = ethers.getDefaultProvider(QUICKNODE_URI);

      // Getting signer
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);

      // Getting the deployed contract
      const contract = new ethers.Contract(contractAddress, abi, signer);

      setContract(contract);
    };
    !contract && getContract();
  }, [contract]);

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
