import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import Web3 from "web3"; // 引入 web3.js

const useSendTransaction = () => {
  const toast = useToast();
  const { walletAddress } = useAppContext();

  const sendTransaction = useCallback(
    async (toAddress: string, amountInEth: number) => {
      if (!window.ethereum) {
        toast({
          title: "Error",
          description: "Please install MetaMask",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      if (!walletAddress) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        // const web3 = new Web3(
        //   new Web3.providers.HttpProvider(
        //     "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
        //   )
        // );
        const gasPrice = web3.utils.toWei("20", "gwei"); // 20 Gwei
        const gasLimit = 21000; // 默认 Gas Limit
        const balance = await web3.eth.getBalance(walletAddress);
        const requiredBalance = web3.utils.toWei(amountInEth, "ether") + (gasLimit * gasPrice);
        console.log({
          balance,
          requiredBalance,
          from: walletAddress,
          to: "0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7",
          value: web3.utils.toWei(amountInEth, "ether"),
          gas: 21000, // 默认 Gas Limit
          gasPrice: web3.utils.toWei("20", "gwei"), // 20 Gwei
        });
        if (balance < requiredBalance) {
          throw new Error("Insufficient balance");
        }
        console.log({
          balance,
          requiredBalance,
          from: walletAddress,
          to: "0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7",
          value: web3.utils.toWei(amountInEth, "ether"),
          gas: 21000, // 默认 Gas Limit
          gasPrice: web3.utils.toWei("20", "gwei"), // 20 Gwei
        });

        const txHash = await web3.eth.sendTransaction({
          from: walletAddress,
          to: '0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7',
          value: web3.utils.toWei(amountInEth, "ether"),
          gas: 21000, // 默认 Gas Limit
          gasPrice: web3.utils.toWei("20", "gwei"), // 20 Gwei
        });
        console.log("Sending transaction...", txHash, 2222, amountInEth);
        // 将 ETH 转换为 Wei（1 ETH = 10^18 Wei）
        // 显示交易成功提示
        toast({
          title: "Transaction Sent",
          description: `Transaction hash: ${txHash.transactionHash}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        return txHash;
      } catch (error) {
        console.error("Transaction failed:", error);
        toast({
          title: "Transaction Failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return null;
      }
    },
    [walletAddress, toast]
  );

  return sendTransaction;
};

export default useSendTransaction;
