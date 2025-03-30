import { Connection, PublicKey } from '@solana/web3.js';
import Web3 from 'web3';

type BlockchainType = 'ETH' | 'SOL' | 'BSC';
type NetworkType = 'mainnet' | 'testnet';

interface BalanceResult {
  balance: number;
  unit: string;
  chain: BlockchainType;
  network: NetworkType;
  success: boolean;
  error?: string;
}

export const getCryptoBalance = async (
  chain: BlockchainType,
  address: string,
  network: NetworkType = 'mainnet'
): Promise<BalanceResult> => {
  try {
    // 初始化基础返回值
    const baseResult = {
      chain,
      network,
      balance: 0,
      unit: '',
      success: false
    };

    // 公共验证逻辑
    const validateAddress = (): void => {
      if (chain === 'SOL') {
        try {
          new PublicKey(address); // Solana地址验证
        } catch {
          throw new Error('Invalid Solana address');
        }
      } else {
        if (!Web3.utils.isAddress(address)) {
          throw new Error(`Invalid ${chain} address`);
        }
      }
    };

    // RPC配置
    const rpcConfig = {
      ETH: {
          mainnet: 'https://eth-mainnet.g.alchemy.com/v2/vLkjMqlSn_QR1yfrrHtWQZGEzrbsEnIS',
          testnet: 'https://rpc.ankr.com/eth_sepolia'
      },
      BSC: {
          mainnet: 'https://bsc-dataseed.binance.org/',
          testnet: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      },
      SOL: {
          mainnet: 'https://mainnet.helius-rpc.com/?api-key=97475525-924d-4797-a21e-84dd98d41de1',
          testnet: 'https://api.devnet.solana.com'
      }
  };

    validateAddress();

    if (chain === 'SOL') {
      const connection = new Connection(rpcConfig.SOL[network]);
      const publicKey = new PublicKey(address);
      const balanceLamports = await connection.getBalance(publicKey);
      return {
        ...baseResult,
        balance: balanceLamports / 1e9,
        unit: 'SOL',
        success: true
      };
    }

    const web3 = new Web3(
      chain === 'ETH' ? rpcConfig.ETH[network] : rpcConfig.BSC[network]
    );
    const balanceWei = await web3.eth.getBalance(address);
    const unit = chain === 'ETH' ? 'ETH' : 'BNB';
    
    return {
      ...baseResult,
      balance: parseFloat(Web3.utils.fromWei(balanceWei, 'ether')),
      unit,
      success: true
    };

  } catch (error) {
    return {
      chain,
      network,
      balance: 0,
      unit: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};



