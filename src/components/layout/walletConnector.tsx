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

// 添加 ethereum 类型声明
declare global {
  interface Window {
    ethereum?: any;
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
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://etherscan.io",
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
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
    colorScheme: "yellow",
  },
  BASE: {
    chainId: "0x2105", // 8453
    name: "BASE",
    symbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
    colorScheme: "blue",
    // logo: "/images/base-logo.png"
  },
  SOL: {
    chainId: "0xe9ac0ce", // 245022934
    name: "SOL",
    symbol: "SOL",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    blockExplorer: "https://explorer.solana.com",
    colorScheme: "purple",
    // logo: "/images/solana-logo.png"
  },
};
const WalletConnector = ({ isMobile = false }: { isMobile?: boolean }) => {
  const toast = useToast();
  const { walletAddress, currentNetwork, setWalletAddress, setCurrentNetwork } =
    useAppContext();

  // 使用useCallback优化事件处理函数
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      accounts.length > 0 ? setWalletAddress(accounts[0]) : handleDisconnect();
    },
    [setWalletAddress]
  );

  const handleChainChanged = useCallback((chainId: string) => {
    checkNetwork(chainId);
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
    };

    checkConnectedWallet();
  }, [setWalletAddress]);

  // 清理事件监听
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const checkNetwork = (chainId: string) => {
    const network = Object.values(NETWORKS).find(
      (net) => net.chainId === chainId
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

  const handleConnect = async () => {
    if (!window.ethereum) {
      return showToast("Wallet Required", "Please install MetaMask", "error");
    }

    try {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      checkNetwork(chainId);
      setWalletAddress(account);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      showToast("Connection Failed", "User denied authorization", "warning");
    }
  };

  const handleDisconnect = () => {
    setWalletAddress("");
    setCurrentNetwork("");
    showToast("Disconnected", "Wallet connection terminated", "info");
  };

  const switchNetwork = async (network) => {
    if (network === "SOL") {
      handleSolanaConnection();
    } else {
      handleEVMNetworkSwitch(network);
    }
  };

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
      setCurrentNetwork(NETWORKS.SOL.name);
      showToast("Connected to Solana", "Successfully connected", "success");
    } catch (error) {
      console.error("Solana connection failed:", error);
      showToast("Connection Failed", "Check Phantom settings", "error");
    }
  };

  const handleEVMNetworkSwitch = async (network) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS[network].chainId }],
      });
      setCurrentNetwork(NETWORKS[network].name);
      showToast(
        "Network Switched",
        `Connected to ${NETWORKS[network].name}`,
        "success"
      );
    } catch (error: any) {
      handleNetworkSwitchError(error, network);
    }
  };

  const handleNetworkSwitchError = async (error: any, network: any) => {
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

  const addEVMNetwork = async (network) => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: NETWORKS[network].chainId,
          chainName: NETWORKS[network].name,
          nativeCurrency: NETWORKS[network].nativeCurrency,
          rpcUrls: [NETWORKS[network].rpcUrl],
          blockExplorerUrls: [NETWORKS[network].blockExplorer],
        },
      ],
    });
  };

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

  const NetworkButton = ({ network }: { network }) => {
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
      {(Object.keys(NETWORKS) as any[]).map((network) => (
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
