import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentNetwork, setBaseCurrentNetwork] = useState("ETH");
  const [isNetSol, setIsNetSol] = useState(false); // 是否是solana网络
  const [chainId, setChainId] = useState();
  const [loading, setLoading] = useState(false);
  const [isTestnet, setIsTestnet] = useState(false); // 是否是测试网络

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
        setIsNetSol,
        isNetSol,
        currentNetwork,
        setWalletAddress,
        setCurrentNetwork,
        setLoading,
        loading,
        isTestnet,
        setIsTestnet,
        chainId,
        setChainId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}