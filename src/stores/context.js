import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentNetwork, setBaseCurrentNetwork] = useState("ETH");
  const [loading, setLoading] = useState(false);

   // 封装 setCurrentNetwork 函数，处理 SOL 相关的设置
   const setCurrentNetwork = useCallback((network) => {
    if (network === "Solana" || network === "SOL") {
      setBaseCurrentNetwork("SOL");
    } else {
      setBaseCurrentNetwork(network);
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        walletAddress,
        currentNetwork,
        setWalletAddress,
        setCurrentNetwork,
        setLoading,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}