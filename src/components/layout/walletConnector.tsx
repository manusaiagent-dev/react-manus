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
  const { walletAddress, currentNetwork, setWalletAddress, setCurrentNetwork, isTestnet, isNetSol, setIsNetSol, chainId, setChainId } = useAppContext();
  // 断开钱包
  const handleDisconnect = () => {
    setWalletAddress("");
    setChainId();
    setIsNetSol(false);
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

  const handleChainChanged = useCallback((chainId: string) => {
    // checkNetwork(chainId);
    setChainId(chainId);
  }, [setChainId]);

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
      if (window.ethereum?.isConnected()) {
        try {
          const [account] = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (!account) return;

          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          // checkNetwork(chainId);
          setChainId(chainId);
          setWalletAddress(account);
        } catch (error) {
          console.error("Auto-connect failed:", error);
          handleDisconnect();
        }
      }

      if (window.solana?.isConnected) {
        try {
          const publicKey = window.solana.publicKey;
          if (publicKey) {
            setWalletAddress(publicKey.toString());
            setIsNetSol(true); // 是sol网络
            setChainId()
          }
        } catch (error) {
          console.error("Solana auto-connect failed:", error);
          handleDisconnect();
        }
      }
    };

    checkConnectedWallet();
  }, [handleDisconnect, setChainId, setIsNetSol, setWalletAddress]);

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

  // 检查当前网络
  // const checkNetwork = (chainId: string) => {
  //   const chainIdNum = parseInt(chainId, 16).toString();
  //   const network = Object.values(NETWORKS).find((net) => net.chainId === chainId || net.chainIdNumber?.toString() === chainIdNum);
  //   const networkName = network?.name || "Unsupported Network";
  //   // setChainId(chainId);

  //   if (!network) {
  //     showToast("Unsupported Network", "Please switch to a supported network", "error");
  //   }
  // };

  // 连接钱包
  const handleConnect = async () => {
    if (!window.ethereum && !window.solana) {
      return showToast("Wallet Required", "Please install MetaMask or Phantom Wallet", "error");
    }

    try {
      if (currentNetwork === "Solana") {
        await handleSolanaConnection();
      } else {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(chainId);
        // checkNetwork(chainId);
        setWalletAddress(account);
      }
    } catch (error) {
      showToast("Connection Failed", "User denied authorization", "warning");
    }
  };



  // 切换网络
  const switchNetwork = async (network: keyof typeof NETWORKS) => {
    console.log('切换网络:' , network )
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
      setIsNetSol(true); // 是sol网络
      setChainId();
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

      // 强制刷新账户信息
      const [account] = await window.ethereum.request({
        method: "eth_accounts",
      });
      setWalletAddress(account);

      // 二次验证当前网络
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log('获取当前的链currentChainId:', currentChainId)
      setChainId(currentChainId);
      // checkNetwork(currentChainId);

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

  useEffect(() => {
    if (chainId) {
      setIsNetSol(false);
    }
  }, [chainId, setIsNetSol]);

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
  console.log(chainId, 'chainllllllllll')
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
          <NetworkButton  key={`${NETWORKS[network].chainId}_${i}`} switchNetwork={switchNetwork} network={network} />
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
        <MenuList bgGradient="linear(to-r, #5d6dff, #ff59c7)" border="none" boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)" minW="200px" py={0}>
          <MenuItem bg="transparent" color="white" closeOnSelect={false}>
            <Box>
              <Text fontSize="xs" color="blue.100">
                Current Network
              </Text>
              <Text fontWeight="medium">{currentNetwork}</Text>
            </Box>
          </MenuItem>
          <MenuDivider borderColor="rgba(255,255,255,0.1)" />
          <MenuItem bg="transparent" color="red.300" _hover={{ bg: "rgba(255,90,90,0.2)", color: "red.400" }} onClick={handleDisconnect}>
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
