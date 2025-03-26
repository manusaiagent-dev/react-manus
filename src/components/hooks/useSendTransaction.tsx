import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { useAppContext } from "../../stores/context";
import Web3 from "web3"; // 引入 web3.js
import BN from "bn.js";
import { newInvite } from "@/services";
import { useRequest } from "ahooks";
import { chainIdsToNames } from "@/config/networks";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
// 创建通用的转换函数
const toBNSafe = (value: string | number | BN | bigint): BN => {
  if (typeof value === "bigint") {
    return new BN(value.toString());
  }
  return new BN(value);
};
const useSendTransaction = () => {
  const toast = useToast();
  const { walletAddress, setLoading, isTestnet, chainId } = useAppContext();
  const { run } = useRequest(newInvite, {
    manual: true,
  });
  // 获取推荐人参数
  const getInviterParam = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("referral");
  }, []);
  const handleEVMTransaction = useCallback(async (web3: Web3, toAddress: string, amountInEth: number, walletAddress: string) => {
    // 1. 参数验证
    if (isNaN(amountInEth) || amountInEth <= 0) {
      throw new Error("转账金额必须大于0");
    }
    // 获取动态 gas 参数
    console.log(walletAddress, toAddress, amountInEth, "walletAddress_toAddress_amountInEth");
    const [gasPrice, estimatedGas] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({
        from: walletAddress,
        to: toAddress,
        value: Web3.utils.toWei(amountInEth.toString(), "ether"),
      }),
    ]);
    console.log(gasPrice, estimatedGas, "gasPrice_estimatedGas");
    // 使用 BN 处理大数
    const valueWei = toBNSafe(Web3.utils.toWei(amountInEth.toString(), "ether"));
    const gasPriceBN = toBNSafe(gasPrice);
    const gasLimitBN = toBNSafe(estimatedGas);

    // 计算总成本
    const totalCost = valueWei.add(gasPriceBN.mul(gasLimitBN));

    // 获取并转换余额
    const rawBalance = await web3.eth.getBalance(walletAddress);
    const balance = toBNSafe(rawBalance);
    console.log("balance", balance, "totalCost", totalCost, balance.lt(totalCost), valueWei.toString());
    // 检查余额
    if (balance.lt(totalCost)) {
      throw new Error("Insufficient balance including gas fee");
    }
    // 构建交易参数
    const txObject = {
      from: walletAddress,
      to: toAddress,
      value: valueWei.toString(),
      gas: estimatedGas.toString(),
      gasPrice: gasPrice.toString(),
    };
    return web3.eth.sendTransaction(txObject);
  }, []);

  const sendTransaction = useCallback(
    async (toAddress: string, amountInEth: number, network: string, totalTokens?: number) => {
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
        let txHash;
        // EVM 网络交易处理
        if (["ETH", "BSC", "BASE"].includes(network)) {
          // 是否安装 MetaMask
          if (!window.ethereum) {
            throw new Error("Please install MetaMask");
          }

          const web3 = new Web3(window.ethereum);
          const tx = await handleEVMTransaction(web3, toAddress, amountInEth, walletAddress);
          toast({
            title: "Transaction Sent",
            description: `Transaction hash: ${tx.transactionHash}`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          txHash = tx.transactionHash;

          // return tx;
        } else if (network.toUpperCase().includes("SOL")) {
          // const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
          let connection;
          if (isTestnet) {
            connection = new Connection("https://api.devnet.solana.com", "confirmed");
          } else {
            connection = new Connection("https://solana-api.projectserum.com", "confirmed");
          }
          // console.log("Solana Connection:", isTestnet, connection);
          // const  connection = new Connection("https://api.devnet.solana.com", "confirmed");

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
            txHash = signature;
          } catch (error) {
            console.error("Transaction failed:", error);
            throw new Error(`Transaction failed: ${error.message}`);
          } finally {
            setLoading(false);
          }
        } else {
          throw new Error("Unsupported network");
        }
        const inviter = getInviterParam(); // 如果参数不存在返回 null 
        if (!inviter) return txHash;
        await run({
          chain_id: chainId,
          chain_name: chainIdsToNames[chainId].toLowerCase().replace(/_/g, "-"),
          address: walletAddress,
          manus_amount: totalTokens,
          tx_hash: txHash,
          inviter: getInviterParam(),
        });
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
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, setLoading, toast, getInviterParam, run, chainId, handleEVMTransaction, isTestnet]
  );

  return sendTransaction;
};

export default useSendTransaction;
