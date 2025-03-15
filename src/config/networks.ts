const NETWORKS: any = {
  ETH: {
    chainId: "0x1",
    chainIdNumber: 1,
    name: "ETH",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    // rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_KEY"],
    rpcUrls: ["https://rpc.ankr.com/eth"],
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    colorScheme: "blue",
  },
  BSC: {
    chainId: "0x38",
    chainIdNumber: 56,
    name: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    colorScheme: "yellow",
  },
  BASE: {
    chainId: "0x2105",
    chainIdNumber: 8453,
    name: "BASE",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    iconUrl: "https://base.org/favicon.ico",
    colorScheme: "blue",
  },
  SOL: {
    name: "SOL",
    symbol: "SOL",
    rpcUrls: ["https://api.mainnet-beta.solana.com"],
    blockExplorerUrls: ["https://explorer.solana.com"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    colorScheme: "purple",
  },
  ETH_TEST: {
    chainId: "0xaa36a7",
    chainIdNumber: 11155111,
    name: "ETH Sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    //   rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_KEY"],
    //   blockExplorerUrls: ["https://sepolia.etherscan.io"],
    rpcUrls: ["https://rpc.ankr.com/eth_sepolia"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    colorScheme: "blue",
  },
  BSC_TEST: {
    chainId: "0x61",
    chainIdNumber: 97,
    name: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    colorScheme: "yellow",
  },
  BASE_TEST: {
    chainId: "0x14A34",
    chainIdNumber: 84532,
    name: "Base Sepolia Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc.notadegen.com/base/sepolia",
    //   "https://base-goerli.publicnode.com", // 备用节点
    //   "https://base-goerli.gateway.tenderly.co",
    ],
    blockExplorerUrls: ["https://goerli.basescan.org"],
    // iconUrl: "https://base.org/favicon.ico",
  },
  SOL_TEST: {
    name: "SOL Devnet",
    symbol: "SOL",
    rpcUrls: ["https://api.devnet.solana.com"],
    blockExplorerUrls: ["https://explorer.solana.com/?cluster=devnet"],
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    colorScheme: "purple",
  },
};
const chainIdsToNames: Record<string | number, string> = {
  1: "ETH",
  56: "BSC",
  8453: "BASE",
  11155111: "ETH_TEST",
  97: "BSC_TEST",
  84532: "BASE_TEST",
  SOL: "SOL",
  SOL_TEST: "SOL_TEST",
};
const toAddress = {
    SOL: '2moCDRhmTKQW32q5XMp9MraaLLEyCiFNg7NbCp3NdV5A', // 正式
    SOL_TEST: 'EgfRtdJwzwnKYHsKUzLYkAMEN3docYuaCtLesytWKKQj', // 测试
    ETH: '0xf6A89FBc3fB613bC21bf3F088F87Acd114C799B7', // 正式
    ETH_TEST: '0x9893474207892592288695132068914166760922', // 测试
}
export { NETWORKS, chainIdsToNames, toAddress };
