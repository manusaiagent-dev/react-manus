import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import Web3 from "web3"; // 引入 web3.js
import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";

const useSendTransaction = () => {
  const toast = useToast();
  const { walletAddress, setLoading, isTestnet } = useAppContext();

  const sendTransaction = useCallback(
    async (toAddress: string, amountInEth: number, network: string) => {
      console.log(network, "networknetworknetworknetworknetwork");
      if (!walletAddress) {
        setLoading(false);

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
        if (["ETH", "BSC", "BASE"].includes(network)) {
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
            setLoading(false);

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
            setLoading(false);
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

          setLoading(false);
          return txHash;
        } else if (network.toUpperCase().includes("SOL")) {
          // const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
          let connection;
          if (isTestnet) {
            connection = new Connection("https://api.devnet.solana.com", "confirmed");
          } else {
            connection = new Connection("https://solana-api.projectserum.com", "confirmed");
          }
          console.log("Solana Connection:", isTestnet, connection);

          const fromPubkey = new PublicKey(walletAddress);
          const toPubkey = new PublicKey(toAddress);
          const lamports = Math.floor(amountInEth * 1e9); // 将 SOL 转换为 lamports
          const transactionFee = 5000; // Solana 交易费用

          // 检查钱包是否可用
          if (!window.phantom?.solana && !window.solana) {
            throw new Error("Phantom wallet not found. Please install Phantom wallet.");
          }

          const solana = window.phantom?.solana || window.solana;

          // 检查钱包是否已连接
          if (!solana.isConnected) {
            try {
              await solana.connect();
            } catch (error) {
              throw new Error("Failed to connect to Phantom wallet.");
            }
          }

          // 获取余额
          let balance;
          let retryCount = 0;
          const maxRetries = 3;
          const retryDelay = 1000; // 1秒延迟

          while (retryCount < maxRetries) {
            try {
              balance = await connection.getBalance(fromPubkey);
              break;
            } catch (error) {
              setLoading(false);
              if (error.message.includes("403") || error.message.includes("429") || error.message.includes("502")) {
                console.log(`Retry ${retryCount + 1} due to error: ${error.message}`);
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, retryDelay)); // 延迟重试
              } else {
                throw new Error(`Failed to get balance: ${error.message}`);
              }
            }
          }

          if (retryCount === maxRetries) {
            throw new Error("Failed to get balance after multiple retries");
          }

          console.log("Balance:", balance, "Lamports:", lamports);

          // 检查余额是否足够（包括交易费用）
          if (balance < lamports + transactionFee) {
            throw new Error(`Insufficient balance. Required: ${lamports + transactionFee} lamports, Available: ${balance} lamports`);
          }

          // 创建交易
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports,
            })
          );

          // 设置交易的最近区块哈希（required for signing）
          try {
            const { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;
          } catch (error) {
            throw new Error(`Failed to get recent blockhash: ${error.message}`);
          }

          // 签名并发送交易
          try {
            const signedTransaction = await solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            // 确认交易
            await connection.confirmTransaction(signature, "confirmed");

            console.log("Transaction sent. Signature:", signature);

            toast({
              title: "Transaction Sent",
              description: `Transaction hash: ${signature}`,
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });

            return signature;
          } catch (error) {
            console.error("Transaction failed:", error);
            throw new Error(`Transaction failed: ${error.message}`);
          } finally {
            setLoading(false);
          }
        } else {
          toast({
            title: "Error",
            description: "Unsupported network",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setLoading(false);

          return null;
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        setLoading(false);
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
