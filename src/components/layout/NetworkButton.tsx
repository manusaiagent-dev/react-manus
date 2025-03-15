import React, { useMemo, memo, useCallback } from "react";
import { Button } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import { NETWORKS, chainIdsToNames } from "@/config/networks";

const NetworkButton = ({ network, switchNetwork }: { network: keyof typeof NETWORKS; switchNetwork: (network: keyof typeof NETWORKS) => void }) => {
  const { chainId, isTestnet } = useAppContext();
  console.log(chainId, "NetworkButtonNetworkButton");
  // 缓存网络配置
  const { colorScheme, chainId: networkChainId, name } = useMemo(() => NETWORKS[network], [network]);

  const isActive: boolean = useMemo(
    () => (chainId === "SOL" && NETWORKS[network].name.includes("SOL")) || (chainId !== "SOL" && chainId && NETWORKS[network].chainIdNumber == +chainId),
    [chainId, network]
  );

  // 缓存按钮样式配置
  const buttonStyles = useMemo(
    () => ({
      bg: isActive ? "white" : "transparent",
      color: isActive ? `${colorScheme}.600` : "gray.300",
      borderColor: isActive ? `${colorScheme}.200` : "gray.600",
      _hover: {
        bg: isActive ? `${colorScheme}.500` : "whiteAlpha.200",
        color: isActive ? "white" : `${colorScheme}.300`,
        borderColor: isActive ? `${colorScheme}.500` : "gray.400",
      },
      _active: {
        bg: isActive ? `${colorScheme}.600` : "whiteAlpha.300",
      },
    }),
    [isActive, colorScheme]
  );
  const getNetworkName = useCallback(
    (chainId: string, chainName?: string) => {
      if (chainId) {
        const chainIdNum = parseInt(chainId, 16).toString();
        return chainIdsToNames[chainIdNum] || chainName;
      }
      return isTestnet ? chainIdsToNames.SOL_TEST : chainIdsToNames.SOL;
    },
    [isTestnet]
  );
  // 缓存按钮文字
  const buttonText = useMemo(() => getNetworkName(networkChainId, name.split(" ")[0]), [getNetworkName, networkChainId, name]);
  return (
    <Button variant="outline" size="sm" onClick={() => switchNetwork(network)} transition="all 0.2s cubic-bezier(.08,.52,.52,1)" {...buttonStyles}>
      {buttonText}
    </Button>
  );
};

export default memo(NetworkButton);
