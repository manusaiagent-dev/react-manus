import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState("ETH");

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        currentNetwork,
        setWalletAddress,
        setCurrentNetwork
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}