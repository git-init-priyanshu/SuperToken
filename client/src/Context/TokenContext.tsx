import { createContext,useState, ReactNode } from "react";
import {ethers} from 'ethers'

type ProviderProps = {
  children: ReactNode;
};

interface ContextType {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  contract: ethers.Contract | null;
  setContract: React.Dispatch<React.SetStateAction<ethers.Contract | null>>;
}

const initialContext = {
  account: "",
  setAccount: (account: string) => {},
  contract: null,
  setContract: (contract: ethers.Contract)=>{}
} as ContextType

export const TokenContext = createContext(initialContext);

export const ContextProvider = ({ children }: ProviderProps) => {
  const [account, setAccount] = useState<string>("none");

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  return (
    <TokenContext.Provider value={{ account, setAccount, contract, setContract }}>
      {children}
    </TokenContext.Provider>
  );
};