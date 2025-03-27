import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(""); // 钱包地址
  const [chainId, setChainId] = useState(); // 当前链ID -- 十进制
  const [loading, setLoading] = useState(false); // 加载中
  const [isTestnet, setIsTestnet] = useState(false); // 是否是测试网络； 默认是测试网络
  const [isDisconnecting,setIsDisconnecting] = useState(false); // 是否正在断开连接
  return (
    <AppContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        setLoading,
        loading,
        isTestnet,
        setIsTestnet,
        chainId,
        setChainId,
        isDisconnecting,setIsDisconnecting
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}