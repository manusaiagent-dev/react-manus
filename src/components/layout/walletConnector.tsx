// components/WalletConnector.tsx
"use client";
import { useEffect, useCallback, useMemo } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Text, useToast, HStack, Box, Switch } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import { NETWORKS, chainIdsToNames } from "@/config/networks";
import NetworkButton from "./NetworkButton";
// 添加 ethereum 和 solana 类型声明
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

const WalletConnector = ({ isMobile = false }: { isMobile?: boolean }) => {
  const toast = useToast();
  const { walletAddress, setWalletAddress, isTestnet, setChainId, chainId } = useAppContext();
  // 断开钱包
  const handleDisconnect = () => {
    setWalletAddress("");
    console.log('断开钱包', '断开钱包')
    setChainId();
    showToast("Disconnected", "Wallet connection terminated", "info");
  };
  // 监听 EVM 钱包状态变化
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        handleDisconnect();
      }
    },
    [handleDisconnect, setWalletAddress]
  );

  // 监听 EVM 网络变化
  const handleChainChanged = useCallback(
    (chainIdHex: string) => {
      const chainIdDecimal = parseInt(chainIdHex, 16); // 转换十六进制为十进制
      console.log('监听 EVM 网络变化', chainIdDecimal, 'chainIdDecimal')
      setChainId(chainIdDecimal.toString()); // 存储为字符串格式
    },
    [setChainId]
  );

  // 监听 Solana 钱包状态变化
  const handleSolanaAccountChanged = useCallback((publicKey: any) => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      handleDisconnect();
    }
  }, []);

  const handleSolanaDisconnect = useCallback(() => {
    handleDisconnect();
  }, [handleDisconnect]);

  // 自动重连逻辑
  useEffect(() => {
    const checkConnectedWallet = async () => {
      // 优先检查EVM钱包
      if (window.ethereum?.isConnected()) {
        try {
        
          const [account, chainIdHex] = await Promise.all([
            window.ethereum.request({ method: "eth_accounts" }),
            window.ethereum.request({ method: "eth_chainId" })
          ]);
          if (account.length > 0) {
            const chainIdDecimal = parseInt(chainIdHex, 16).toString();
            console.log('自动重连逻辑', chainIdDecimal, 'chainIdDecimal')
            setChainId(chainIdDecimal);
            setWalletAddress(account[0]);
            return; // 优先保持EVM连接状态
          }
        } catch (error) {
          console.error("Auto-connect failed:", error);
          handleDisconnect();
        }
      }
    // 只有EVM未连接时才检查Solana
      if (window.solana?.isConnected) {
        try {
          const publicKey = window.solana.publicKey;
          if (publicKey) {
            setWalletAddress(publicKey.toString());
            console.log('只有EVM未连接时才检查Solana', '自动重连逻辑')
            setChainId("SOL"); // 设置明确标识
          }
        } catch (error) {
          console.error("Solana auto-connect failed:", error);
          handleDisconnect();
        }
      }
    };

    checkConnectedWallet();
  }, [handleDisconnect, setChainId, setWalletAddress]);

  // 清理事件监听
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    if (window.solana) {
      window.solana.on("accountChanged", handleSolanaAccountChanged);
      window.solana.on("disconnect", handleSolanaDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }

      if (window.solana) {
        window.solana.removeListener("accountChanged", handleSolanaAccountChanged);
        window.solana.removeListener("disconnect", handleSolanaDisconnect);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, handleSolanaAccountChanged, handleSolanaDisconnect]);

  // 连接钱包
  const handleConnect = async () => {
    if (!window.ethereum && !window.solana) {
      return showToast("Wallet Required", "Please install MetaMask or Phantom Wallet", "error");
    }

    try {
      if (chainId === "SOL") {
        await handleSolanaConnection();
      } else {

        const [account, chainIdHex] = await Promise.all([
          window.ethereum.request({ method: "eth_accounts" }),
          window.ethereum.request({ method: "eth_chainId" })
        ]);
        if (account.length > 0) {
          const chainIdDecimal = parseInt(chainIdHex, 16).toString();
          console.log('连接钱包连接钱包连接钱包连接钱包', chainIdDecimal, 'chainIdDecimal')
          setChainId(chainIdDecimal);
          setWalletAddress(account[0]);
          return; // 优先保持EVM连接状态
        }

      }
    } catch (error) {
      showToast("Connection Failed", "User denied authorization", "warning");
    }
  };

  // 切换网络
  const switchNetwork = async (network: keyof typeof NETWORKS) => {
    console.log("切换网络:", network);
    if (network.includes("SOL")) {
      await handleSolanaConnection();
    } else {
      await handleEVMNetworkSwitch(network);
    }
  };

  // 连接 Solana 钱包
  const handleSolanaConnection = async () => {
    if (!window.solana) {
      return showToast("Wallet Required", "Please install Phantom Wallet", "error");
    }

    try {
      await window.solana.connect();
      console.log('连接 Solana 钱包连接 Solana 钱包连接 Solana 钱包连接 Solana 钱包')
      setChainId("SOL"); // 是sol网络
      setWalletAddress(window.solana.publicKey.toString());
      showToast("Connected to Solana", "Successfully connected", "success");
    } catch (error) {
      console.error("Solana connection failed:", error);
      showToast("Connection Failed", "Check Phantom settings", "error");
    }
  };

  // 切换 EVM 网络
  const handleEVMNetworkSwitch = async (network: keyof typeof NETWORKS) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS[network].chainId }],
      });
      console.log(1111)
      // 添加延迟确保网络切换完成
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(2222)

      // 双重验证当前网络
      const [currentChainIdHex, accounts] = await Promise.all([
        window.ethereum.request({ method: "eth_chainId" }),
        window.ethereum.request({ method: "eth_accounts" }),
      ]);
      console.log(3333, currentChainIdHex, accounts[0])

      const currentChainId = parseInt(currentChainIdHex, 16).toString();
      console.log(444444, currentChainId, accounts[0], currentChainId , network, NETWORKS[network].chainIdNumber?.toString())

      if (currentChainId !== NETWORKS[network].chainIdNumber?.toString()) {
        // throw new Error("Network switch verification failed");
      }
      setChainId(currentChainId);
      setWalletAddress(accounts[0]);
      console.log('切换网络成功', currentChainId,'currentChainIdcurrentChainId')
      showToast("Network Switched", `Connected to ${NETWORKS[network].name}`, "success");
    } catch (error: any) {
      handleNetworkSwitchError(error, network);
    }
  };

  // 处理网络切换错误
  const handleNetworkSwitchError = async (error: any, network: keyof typeof NETWORKS) => {
    if (error.code === 4902) {
      try {
        await addEVMNetwork(network);
        await switchNetwork(network);
      } catch (addError) {
        console.error(`Failed to add ${network} network:`, addError);
        showToast("Network Error", `Failed to add ${network} network`, "error");
      }
    } else if (error.code === 4001) {
      showToast("Request Cancelled", "Network switch cancelled", "info");
    }
  };

  // 添加 EVM 网络
  const addEVMNetwork = async (network: keyof typeof NETWORKS) => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: NETWORKS[network].chainId,
          chainName: NETWORKS[network].name,
          nativeCurrency: NETWORKS[network].nativeCurrency,
          rpcUrls: NETWORKS[network].rpcUrls,
          blockExplorerUrls: NETWORKS[network].blockExplorerUrls,
          iconUrls: [NETWORKS[network].iconUrl],
        },
      ],
    });
  };

  // 显示 Toast 提示
  const showToast = (title: string, description: string, status: "info" | "warning" | "success" | "error") => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  // 连接按钮样式
  const connectButtonStyle = {
    rounded: "md",
    bgGradient: "linear(to-r, #5d6dff, #ff59c7)",
    color: "white",
    fontWeight: "bold",
    px: isMobile ? 4 : 6,
    py: isMobile ? 4 : 5,
    fontSize: isMobile ? "sm" : "md",
    w: isMobile ? "100%" : "auto",
    _hover: {
      bgGradient: "linear(to-r, #4a5aff, #ff40b8)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    _active: {
      transform: "translateY(0)",
      boxShadow: "none",
    },
    transition: "all 0.3s ease",
  };
  return walletAddress ? (
    <HStack
      spacing={isMobile ? 2 : 4}
      flexWrap={isMobile ? "wrap" : "nowrap"}
      justifyContent={isMobile ? "center" : "flex-start"}
      w={isMobile ? "100%" : "auto"}
    >
      {(Object.keys(NETWORKS) as (keyof typeof NETWORKS)[])
        .filter((key) => {
          const isTestnetNetwork = key.includes("_TEST");
          return isTestnet ? isTestnetNetwork : !isTestnetNetwork;
        })
        .map((network, i) => (
          <NetworkButton key={`${NETWORKS[network].chainId}_${i}`} switchNetwork={switchNetwork} network={network} />
        ))}

      <Menu>
        <MenuButton
          as={Button}
          bgGradient="linear(to-r, blue.400, purple.400)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, blue.500, purple.500)" }}
          size={isMobile ? "sm" : "md"}
          w={isMobile ? "100%" : "auto"}
          mt={isMobile ? 2 : 0}
        >
          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </MenuButton>
        <MenuList bg='#5d6dff' border="none" minW="200px" py={0}>
          <MenuItem bg="transparent" color="white" closeOnSelect={false}>
            Current Network: {chainIdsToNames[chainId]}
          </MenuItem>
          <MenuItem bg="transparent" color="white" _hover={{ color: "red.400" }} onClick={handleDisconnect}>
            Disconnect Wallet
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  ) : (
    <Button {...connectButtonStyle} onClick={handleConnect}>
      Connect Wallet
    </Button>
  );
};

export default WalletConnector;
