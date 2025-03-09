import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import Web3 from "web3"; // 引入 web3.js
import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";

const useSendTransaction = () => {
  const toast = useToast();
  const { walletAddress, currentNetwork } = useAppContext();

  const sendTransaction = useCallback(
    async (toAddress: string, amountInEth: number) => {
      console.log(currentNetwork,'currentNetwork_sendTransaction')
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
        if (["ETH", "BSC", "BASE"].includes(currentNetwork)) {
          // 是否安装 MetaMask
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
          const web3 = new Web3(window.ethereum);
         
          const gasPrice = web3.utils.toWei("20", "gwei"); // 20 Gwei
          const gasLimit = 21000; // 默认 Gas Limit
          const balance = await web3.eth.getBalance(walletAddress);
          const requiredBalance = web3.utils.toWei(amountInEth, "ether") + gasLimit * gasPrice;
          console.log({
            balance,
            requiredBalance,
            from: walletAddress,
            to: "0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7",
            value: web3.utils.toWei(amountInEth.toString(), "ether"),
            gas: 21000, // 默认 Gas Limit
            gasPrice: web3.utils.toWei("20", "gwei"), // 20 Gwei
          });
          if (balance < requiredBalance) {
            throw new Error("Insufficient balance");
          }
  
          const txHash = await web3.eth.sendTransaction({
            from: walletAddress,
            to: "0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7",
            value: web3.utils.toWei(amountInEth.toString(), "ether"),
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
        }else if (currentNetwork.toUpperCase().includes('SOL')) {
          const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
          const fromPubkey = new PublicKey(walletAddress);
          const toPubkey = new PublicKey(toAddress);
          const lamports = amountInEth * 1e9; // 将 SOL 转换为 lamports

          const balance = await connection.getBalance(fromPubkey);
          if (balance < lamports) {
              throw new Error("Insufficient balance");
          }

          const transaction = new Transaction().add(
              SystemProgram.transfer({
                  fromPubkey,
                  toPubkey,
                  lamports,
              })
          );

          const signer = await window.solana.connect();
          const signature = await sendAndConfirmTransaction(
              connection,
              transaction,
              [signer.publicKey],
              { commitment: 'confirmed' }
          );

          console.log("Sending Solana transaction...", signature, amountInEth);
          toast({
              title: "Transaction Sent",
              description: `Transaction hash: ${signature}`,
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
          });

          return signature;
      } else {
          toast({
              title: "Error",
              description: "Unsupported network",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
          });
          return null;
      }
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
    [walletAddress, currentNetwork, toast]
  );

  return sendTransaction;
};

export default useSendTransaction;
