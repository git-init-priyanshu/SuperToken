import { useState, useEffect, useContext } from "react";
import {useNavigate} from 'react-router-dom'
import detectEthereumProvider from "@metamask/detect-provider";

import flipkartLogo from "../assets/Flipkart_logo.png";
import superCoin from "../assets/superCoin.png";
import { formatBalance } from "../Contract/utils/util";
import metamask from "../assets/MetaMask_Fox.svg.png";
import { TokenContext } from "../Context/TokenContext";
import { contractProp } from "../App";

export default function Navbar({ contract }: contractProp) {
  const { wallet, setWallet } = useContext(TokenContext);

  const navigate = useNavigate();

  // const [account, setAccount] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  // const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connecting to metamask
  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet({ accounts: ["none"], balance: "" });
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    setWallet({ accounts, balance });
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
        params: [],
      })
      .then((accounts: ["none"]) => {
        updateWallet(accounts);
        // accounts && setAccount(accounts[0]);
      })
      .catch((err: any) => {
        console.log(err);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  useEffect(() => {
    const getTokenBalance = async () => {
      const tokens: bigint = await contract?.balanceOf(wallet.accounts[0]);

      setTokenBalance(tokens.toString());
    };
    contract && getTokenBalance();
  }, [contract, wallet]);

  return (
    <>
      <div className=" relative flex justify-between items-center h-16">
        <div className=" flex items-center gap-3">
          <img src={flipkartLogo} alt="" className=" h-10" />
          <div className="flex align-baseline">
            <h1>Grid 5.0</h1>
          </div>
        </div>

        {/* {wallet.accounts.length > 0 && (
          <div className="account bg-neutral-700 bg-opacity-80 p-2 sm: top-16 lg: rounded-md  ">
            {wallet.accounts[0] !== "none"
              ? wallet.accounts[0]
              : "Account: none"}
          </div>
        )} */}

        <div className="flex items-center">
          {wallet.accounts[0] !== "none" ? (
            <div className=" flex">
              <div className="rounded cursor-pointer bg-neutral-700 bg-opacity-80 p-2 px-3 flex items-center" onClick={()=> navigate("/history")}>
                <span className="material-symbols-outlined">history</span>
              </div>
              <div className="rounded-md ml-2 bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-r-none border-r border-neutral-500 ">
                {tokenBalance}
                <img className=" ml-2 w-5" src={superCoin} alt="" />
              </div>

              <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-l-none">
                <div className=" circle"></div>
              </div>
            </div>
          ) : (
            <button
              disabled={disableConnect}
              onClick={connectWallet}
              className="flex items-center rounded-md bg-neutral-700 bg-opacity-80 p-2  hover:bg-neutral-800 hover:bg-opacity-75"
            >
              <img src={metamask} className=" w-8 mr-2" />
              Connect
            </button>
          )}
        </div>
      </div>
    </>
  );
}
