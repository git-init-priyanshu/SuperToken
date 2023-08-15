import { createContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface walletType {
  accounts: [string];
  balance: string;
}

interface ContextType {
  wallet: walletType;
  setWallet: React.Dispatch<React.SetStateAction<walletType>>;
  contract: ethers.Contract | null;
  setContract: React.Dispatch<React.SetStateAction<ethers.Contract | null>>;
  partners: string[];
  setPartners: React.Dispatch<React.SetStateAction<string[]>>;
}

const initialContext = {
  wallet: { accounts: ["none"], balance: "" },
  setWallet: (wallet: walletType) => {},
  contract: null,
  setContract: (contract: ethers.Contract) => {},
  partners: [""],
  setPartners: (partners: string[]) => {},
} as ContextType;

export const TokenContext = createContext(initialContext);

interface ProviderProps {
  children: ReactNode;
}

export const ContextProvider = ({ children }: ProviderProps) => {
  const [wallet, setWallet] = useState<walletType>({
    accounts: ["none"],
    balance: "",
  });

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [partners, setPartners] = useState<string[]>([""]);

  return (
    <TokenContext.Provider
      value={{
        wallet,
        setWallet,
        contract,
        setContract,
        partners,
        setPartners,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
