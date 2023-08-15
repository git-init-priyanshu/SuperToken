import {useState, useEffect, useContext} from 'react'
import detectEthereumProvider from "@metamask/detect-provider";
import {ethers} from 'ethers'

import { formatBalance } from "../Contract/utils/util";
import metamask from "../assets/MetaMask_Fox.svg.png";
import { TokenContext } from '../Context/TokenContext';

export default function Navbar() {
  const {wallet, setWallet, contract} = useContext(TokenContext)

  // const [account, setAccount] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
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
    setWallet({ accounts, balance});
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
    const getTokenBalance = async()=>{
      const tokens: bigint = contract && await contract.balanceOf(wallet.accounts[0])

      setTokenBalance(tokens.toString());
    }
    getTokenBalance();
  }, [contract])
  

  return (
    <>
      <div className=" relative flex justify-between items-center h-16">
      <div className=" flex items-center gap-3">
        {/* <img src={icon} alt="" className=" h-10" /> */}
        <h1>FlipKart Grid 5.0</h1>
      </div>

      {wallet.accounts.length > 0 && (
        <div className="account bg-neutral-700 bg-opacity-80 p-2 sm: top-16 lg: rounded-md  ">
          {wallet.accounts[0] !== "none" ? wallet.accounts[0] : "Account: none"}
        </div>
      )}

      <div className="flex items-center">
        {wallet.accounts[0] !== "none" ? (
          <div className=" flex">
            <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-r-none border-r border-neutral-500 ">
              {tokenBalance} STK
            </div>

            <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-l-none hover:cursor-pointer">
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
  )
}
