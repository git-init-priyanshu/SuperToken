import { useEffect, useContext } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { ethers } from "ethers";

import { TokenContext, ContextProvider } from "./Context/TokenContext";
import Home from "./Pages/Home";
import AdminPanel from "./Pages/AdminPanel";
import abi from "./Contract/abi.json";

function App() {
  const {setContract} = useContext(TokenContext);

  const contractAddress = "0x2AFebB6e117f224a0Dbb15C26812B2ab98c27581";

  useEffect(() => {
    // Getting provider
    const providerURL:string = import.meta.env.VITE_QUICKNODE_URI;
    const provider = ethers.getDefaultProvider(providerURL!);
    // Metamask private key
    const privateKey:string = import.meta.env.VITE_PRIVATE_KEY;
    // Getting signer
    const signer = new ethers.Wallet(privateKey!, provider);

    // Getting the deployed contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    setContract(contract);
  }, []);

  // Defining router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home/>} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    )
  );

  return (
    <div className="sm: mx-2 lg:mx-10 ">
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
