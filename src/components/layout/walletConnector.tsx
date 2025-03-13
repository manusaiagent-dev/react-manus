// components/WalletConnector.tsx
"use client";
import { useEffect, useCallback } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useToast,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";

// 添加 ethereum 和 solana 类型声明
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

const NETWORKS = {
  ETH: {
    chainId: "0x1", // 1
    chainIdNumber: 1,
    name: "ETH",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    colorScheme: "blue",
  },
  BSC: {
    chainId: "0x38", // 56
    chainIdNumber: 56,
    name: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    colorScheme: "yellow",
  },
  BASE: {
    chainId: "0x2105", // 8453
    chainIdNumber: 8453,
    name: "BASE",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://1rpc.io/base",
    ],
    blockExplorerUrls: ["https://basescan.org"],
    iconUrl: "https://base.org/favicon.ico",
    colorScheme: "blue",
  },
  SOL: {
    name: "SOL",
    symbol: "SOL",
    rpcUrls: [
      "https://api.mainnet-beta.solana.com",
      "https://solana-rpc.ankr.com",
      "https://rpc.ankr.com/solana",
    ],
    blockExplorerUrls: ["https://explorer.solana.com"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    colorScheme: "purple",
  },
};

const WalletConnector = ({ isMobile = false }: { isMobile?: boolean }) => {
  const toast = useToast();
  const { walletAddress, currentNetwork, setWalletAddress, setCurrentNetwork } =
    useAppContext();

  // 监听 EVM 钱包状态变化
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        handleDisconnect();
      }
    },
    [setWalletAddress]
  );

  const handleChainChanged = useCallback((chainId: string) => {
    checkNetwork(chainId);
  }, []);

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
  }, []);

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
          checkNetwork(chainId);
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
            setCurrentNetwork("SOL");
          }
        } catch (error) {
          console.error("Solana auto-connect failed:", error);
          handleDisconnect();
        }
      }
    };

    checkConnectedWallet();
  }, [setWalletAddress, setCurrentNetwork]);

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
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }

      if (window.solana) {
        window.solana.removeListener(
          "accountChanged",
          handleSolanaAccountChanged
        );
        window.solana.removeListener("disconnect", handleSolanaDisconnect);
      }
    };
  }, [
    handleAccountsChanged,
    handleChainChanged,
    handleSolanaAccountChanged,
    handleSolanaDisconnect,
  ]);

  // 检查当前网络
  const checkNetwork = (chainId: string) => {
    const chainIdNum = parseInt(chainId, 16).toString();
    const network = Object.values(NETWORKS).find(
      (net) =>
        net.chainId === chainId || net.chainIdNumber?.toString() === chainIdNum
    );
    const networkName = network?.name || "Unsupported Network";

    setCurrentNetwork(networkName);

    if (!network) {
      showToast(
        "Unsupported Network",
        "Please switch to a supported network",
        "error"
      );
    }
  };

  // 连接钱包
  const handleConnect = async () => {
    if (!window.ethereum && !window.solana) {
      return showToast(
        "Wallet Required",
        "Please install MetaMask or Phantom Wallet",
        "error"
      );
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

        checkNetwork(chainId);
        setWalletAddress(account);
      }
    } catch (error) {
      showToast("Connection Failed", "User denied authorization", "warning");
    }
  };

  // 断开钱包
  const handleDisconnect = () => {
    setWalletAddress("");
    setCurrentNetwork("");
    showToast("Disconnected", "Wallet connection terminated", "info");
  };

  // 切换网络
  const switchNetwork = async (network: keyof typeof NETWORKS) => {
    if (network === "SOL") {
      await handleSolanaConnection();
    } else {
      await handleEVMNetworkSwitch(network);
    }
  };

  // 连接 Solana 钱包
  const handleSolanaConnection = async () => {
    if (!window.solana) {
      return showToast(
        "Wallet Required",
        "Please install Phantom Wallet",
        "error"
      );
    }

    try {
      await window.solana.connect();
      setCurrentNetwork("Solana");
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
      checkNetwork(currentChainId);

      showToast(
        "Network Switched",
        `Connected to ${NETWORKS[network].name}`,
        "success"
      );
    } catch (error: any) {
      handleNetworkSwitchError(error, network);
    }
  };

  // 处理网络切换错误
  const handleNetworkSwitchError = async (
    error: any,
    network: keyof typeof NETWORKS
  ) => {
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
  const showToast = (
    title: string,
    description: string,
    status: "info" | "warning" | "success" | "error"
  ) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  // 网络切换按钮
  const NetworkButton = ({ network }: { network: keyof typeof NETWORKS }) => {
    const isActive = currentNetwork === NETWORKS[network].name;
    const { colorScheme } = NETWORKS[network];

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchNetwork(network)}
        bg={isActive ? "white" : "transparent"}
        color={isActive ? `${colorScheme}.600` : "gray.300"}
        borderColor={isActive ? `${colorScheme}.200` : "gray.600"}
        _hover={{
          bg: isActive ? `${colorScheme}.500` : "whiteAlpha.200",
          color: isActive ? "white" : `${colorScheme}.300`,
          borderColor: isActive ? `${colorScheme}.500` : "gray.400",
        }}
        _active={{
          bg: isActive ? `${colorScheme}.600` : "whiteAlpha.300",
        }}
        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      >
        {NETWORKS[network].name.split(" ")[0]}
      </Button>
    );
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
      {(Object.keys(NETWORKS) as (keyof typeof NETWORKS)[]).map((network) => (
        <NetworkButton key={network} network={network} />
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
        <MenuList
          bgGradient="linear(to-r, #5d6dff, #ff59c7)"
          border="none"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
          minW="200px"
          py={0}
        >
          <MenuItem bg="transparent" color="white" closeOnSelect={false}>
            <Box>
              <Text fontSize="xs" color="blue.100">
                Current Network
              </Text>
              <Text fontWeight="medium">{currentNetwork}</Text>
            </Box>
          </MenuItem>
          <MenuDivider borderColor="rgba(255,255,255,0.1)" />
          <MenuItem
            bg="transparent"
            color="red.300"
            _hover={{ bg: "rgba(255,90,90,0.2)", color: "red.400" }}
            onClick={handleDisconnect}
          >
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
