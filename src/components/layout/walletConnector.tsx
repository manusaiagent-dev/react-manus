// components/WalletConnector.tsx
"use client";
import { useEffect, useCallback, useState } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem, useToast, HStack } from "@chakra-ui/react";
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
  const { walletAddress, setWalletAddress, isTestnet, setChainId, chainId, isDisconnecting,setIsDisconnecting } = useAppContext();

  // 显示 Toast 提示
  const showToast = useCallback(
    (title: string, description: string, status: "info" | "warning" | "success" | "error") => {
      toast.closeAll();
      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );

  // 断开钱包
  const handleDisconnect = useCallback(async () => {
    try {
      if (window.solana && window.solana.isConnected) {
        await window.solana.disconnect();
      }
    } catch (error) {
      console.error("Failed to disconnect Solana wallet:", error);
    }
    // 清除状态
    setWalletAddress("");
    setChainId("");
    setIsDisconnecting(true); // 设置标志位
    // 显示断开提示
    showToast("Disconnected", "Wallet connection terminated", "info");
    
  }, [setWalletAddress, setChainId, showToast, setIsDisconnecting]);

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
      setChainId(chainIdDecimal.toString()); // 存储为字符串格式
    },
    [setChainId]
  );

  // 监听 Solana 钱包状态变化
  const handleSolanaAccountChanged = useCallback(
    (publicKey: any) => {
      if (publicKey) {
        setWalletAddress(publicKey.toString());
      } else {
        handleDisconnect();
      }
    },
    [handleDisconnect, setWalletAddress]
  );

  const handleSolanaDisconnect = useCallback(() => {
    handleDisconnect();
  }, [handleDisconnect]);

  // 连接 Solana 钱包
  const handleSolanaConnection = useCallback(async () => {
    if (!window.solana) {
      return showToast("Wallet Required", "Please install Phantom Wallet", "error");
    }

    try {
      await window.solana.connect();
      setChainId("SOL"); // 设置网络为 Solana
      setWalletAddress(window.solana.publicKey.toString());
      showToast("Connected to Solana", "Successfully connected", "success");
    } catch (error) {
      console.error("Solana connection failed:", error);
      showToast("Connection Failed", "Check Phantom settings", "error");
    }
  }, [setChainId, setWalletAddress, showToast]);

  // 添加 EVM 网络
  const addEVMNetwork = useCallback(async (network: keyof typeof NETWORKS) => {
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
  }, []);

  // 切换 EVM 网络
  const handleEVMNetworkSwitch = useCallback(
    async (network: keyof typeof NETWORKS) => {
      try {
        // 1. 发起网络切换请求
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NETWORKS[network].chainId }],
        });

        // 2. 等待网络切换完成（事件监听 + 超时机制）
        let currentChainIdHex: string;

        // 创建事件监听Promise
        const chainChangedPromise = new Promise<string>((resolve) => {
          const handler = (newChainId: string) => {
            window.ethereum.removeListener("chainChanged", handler);
            resolve(newChainId);
          };
          window.ethereum.on("chainChanged", handler);
        });

        // 创建超时Promise（5秒）
        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Network switching timeout"));
          }, 5000);
        });

        // 等待事件或超时
        try {
          currentChainIdHex = await Promise.race([chainChangedPromise, timeoutPromise]);
        } catch (error) {
          // 超时后主动查询最新链ID
          currentChainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        }

        // 3. 验证账户信息
        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        // 4. 更新状态
        const currentChainId = parseInt(currentChainIdHex, 16).toString();

        setChainId(currentChainId);
        setWalletAddress(accounts[0]);

        showToast("Network switched", `Connected to ${NETWORKS[network].name}`, "success");
      } catch (error: any) {
        console.error("网络切换失败:", error);
        // 错误处理逻辑保持不变
        if (error.code === 4902) {
          try {
            await addEVMNetwork(network);
            await handleEVMNetworkSwitch(network);
          } catch (addError) {
            console.error(`添加网络失败: ${network}`, addError);
            showToast("Network Error", `Unable to add ${network} Network`, "error");
          }
        } else if (error.code === 4001) {
          showToast("Request Cancelled", "User cancelled the network switch", "info");
        } else {
          showToast("Network Error", error.message || "Unknown error", "error");
        }
      }
    },
    [addEVMNetwork, setChainId, setWalletAddress, showToast]
  );

  // 切换网络
  const switchNetwork = useCallback(
    async (network: keyof typeof NETWORKS) => {
      if (network.includes("SOL")) {
        await handleSolanaConnection();
      } else {
        await handleEVMNetworkSwitch(network);
      }
    },
    [handleEVMNetworkSwitch, handleSolanaConnection]
  );
  // 自动重连逻辑
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if(walletAddress || isDisconnecting) return;
      // 优先检查 EVM 钱包
      if (window.ethereum?.isConnected()) {
        try {
          const [account, chainIdHex] = await Promise.all([
            window.ethereum.request({ method: "eth_accounts" }),
            window.ethereum.request({ method: "eth_chainId" }),
          ]);
          if (account.length > 0) {
            const chainIdDecimal = parseInt(chainIdHex, 16).toString();
            setChainId(chainIdDecimal);
            setWalletAddress(account[0]);
            return;
          }
        } catch (error) {
          console.error("Auto-connect failed:", error);
          handleDisconnect();
        }
      }

      // 检查 Solana 钱包
      if (window.solana?.isConnected) {
        try {
          const publicKey = window.solana.publicKey;
          if (publicKey) {
            setWalletAddress(publicKey.toString());
            setChainId("SOL");
          }
        } catch (error) {
          console.error("Solana auto-connect failed:", error);
          handleDisconnect();
        }
      }
    };

    checkConnectedWallet();
  }, [handleDisconnect, isDisconnecting, setChainId, setWalletAddress, walletAddress]);

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
  const handleConnect = useCallback(async () => {
    if (!window.ethereum && !window.solana) {
      return showToast("Wallet Required", "Please install MetaMask or Phantom Wallet", "error");
    }

    try {
      if (chainId === "SOL") {
        await handleSolanaConnection();
      } else {
        const [account, chainIdHex] = await Promise.all([
          window.ethereum.request({ method: "eth_accounts" }),
          window.ethereum.request({ method: "eth_chainId" }),
        ]);
        if (account.length > 0) {
          const chainIdDecimal = parseInt(chainIdHex, 16).toString();
          setChainId(chainIdDecimal);
          setWalletAddress(account[0]);
        }
      }
    } catch (error) {
      showToast("Connection Failed", "User denied authorization", "warning");
    }
  }, [handleSolanaConnection, setChainId, setWalletAddress, showToast, chainId]);

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
        <MenuList bg="#5d6dff" border="none" minW="200px" py={0}>
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
