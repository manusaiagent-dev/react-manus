import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, VStack, HStack, Text, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useBreakpointValue, Button } from "@chakra-ui/react";
import Decimal from "decimal.js"; // 引入 Decimal.js 处理高精度计算
import { debounce } from "lodash";
import { chainIdsToNames, toAddress } from "@/config/networks";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../stores/context";
import ScrollAnimation from "../ui/ScrollAnimation";
import { getCryptoBalance } from "../../utils/getCryptoBalance";
import useCrossChainTransfer from "../hooks/useSendTransaction";

const CHAIN_CONFIG: {
  [key: string]: {
    symbol: string;
    dailyFactor: Decimal;
    basePricePerShare: Decimal;
    initialTokensPerShare: Decimal;
    decimals: number;
  };
} = {
  ETH: {
    symbol: "ETH",
    dailyFactor: new Decimal(1.2),
    basePricePerShare: new Decimal(0.05), // 每份代币的基础价格
    initialTokensPerShare: new Decimal(1000000), // 初始1,000,000代币/份
    decimals: 20,
  },
  BNB: {
    symbol: "BNB",
    dailyFactor: new Decimal(1.2),
    basePricePerShare: new Decimal(0.16),
    initialTokensPerShare: new Decimal(1000000), // 初始1,000,000代币/份
    decimals: 20,
  },
  SOL: {
    symbol: "SOL",
    dailyFactor: new Decimal(1.2),
    basePricePerShare: new Decimal(0.7), // 每份代币的基础价格
    initialTokensPerShare: new Decimal(1000000), // 初始1,000,000代币/份
    decimals: 20,
  },
};
// UTC时间配置（示例：2025年3月30日周日晚12点UTC）
const PRESALE_CONFIG = {
  START_UTC: Date.UTC(2025, 3, 6), // 2025-04-06 00:00:00 UTC
  DURATION_DAYS: 7,
};
const usePresaleTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [daysPassed, setDaysPassed] = useState(1); // 默认设为第1天

  useEffect(() => {
    const timer = setInterval(() => {
      const nowUTC = Date.now();
      const startUTC = PRESALE_CONFIG.START_UTC;
      const endUTC = startUTC + PRESALE_CONFIG.DURATION_DAYS * 86400000;

      // 计算激活状态
      const isActive = nowUTC >= startUTC && nowUTC <= endUTC;
      setIsActive(isActive);

      // 计算目标时间（开始前显示开始时间，开始后显示结束时间）
      const targetUTC = isActive ? endUTC : startUTC;
      const diff = targetUTC - nowUTC;
      // 计算剩余时间
      setTimeLeft({
        days: Math.max(0, Math.floor(diff / 86400000)),
        hours: Math.max(0, Math.floor((diff % 86400000) / 3600000)),
        minutes: Math.max(0, Math.floor((diff % 3600000) / 60000)),
        seconds: Math.max(0, Math.floor((diff % 60000) / 1000)),
      });
      // 计算已过天数逻辑
      if (nowUTC < startUTC) {
        // 预售开始前始终显示第一天价格
        setDaysPassed(1);
      } else if (isActive) {
        // 预售期间计算实际天数
        const elapsedDays = Math.floor((nowUTC - startUTC) / 86400000) + 1;
        setDaysPassed(Math.min(elapsedDays, PRESALE_CONFIG.DURATION_DAYS));
      } else {
        // 预售结束后保持最后一天价格
        setDaysPassed(PRESALE_CONFIG.DURATION_DAYS);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { isActive, timeLeft, daysPassed };
};
const TokenSaleWidget = () => {
  const { isActive: isPresaleActive, timeLeft, daysPassed } = usePresaleTimer();

  const [shares, setShares] = useState(5);
  const { walletAddress, chainId, setLoading, loading, isTestnet } = useAppContext();
  const [currentNetwork, setCurrentNetwork] = useState("ETH");
  const [progress, setProgress] = useState(0); // 进度
  // 监测余额
  const [balances, setBalances] = useState<{
    eth: number | null;
    sol: number | null;
    bsc: number | null;
  }>({ eth: null, sol: null, bsc: null });

  const sendTransaction = useCrossChainTransfer();

  // 进度计算
  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      if (now < PRESALE_CONFIG.START_UTC) {
        setProgress(0);
        return;
      }

      const elapsed = now - PRESALE_CONFIG.START_UTC;
      const total = PRESALE_CONFIG.DURATION_DAYS * 86400000;
      setProgress(Math.min((elapsed / total) * 100, 100));
    };

    const timer = setInterval(updateProgress, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const name = chainIdsToNames[chainId]?.split("_")[0] || "ETH";
    setCurrentNetwork(name);
  }, [chainId]);

  // 格式化时间显示
  const formatTimeUnit = (value: number) => {
    return value < 0 ? "00" : value.toString().padStart(2, "0");
  };
  const transNetWork = (network: string) => {
    const networkMap = {
      SOL: "SOL",
      ETH: "ETH",
      BASE: "ETH",
      BSC: "BNB",
    };
    return networkMap[network] || "ETH";
  };
  // const formatTokenPrice = (price: Decimal, decimals: number) => {
  //   // 转换为指定小数位数的字符串，避免科学计数法
  //   // 使用ROUND_DOWN模式确保不会四舍五入
  //   let formatted = price.toDecimalPlaces(decimals, Decimal.ROUND_DOWN).toString();

  //   // 处理科学计数法（例如 1e-8 → 0.00000001）
  //   if (formatted.includes("e")) {
  //     // 拆分科学计数法数字
  //     const [coefficient, exponent] = formatted.split("e");
  //     const exp = parseInt(exponent, 10);

  //     // 处理负指数（小数）
  //     if (exp < 0) {
  //       const zerosNeeded = Math.abs(exp) - 1;
  //       formatted = "0." + "0".repeat(zerosNeeded) + coefficient.replace(".", "");
  //     }
  //     // 处理正指数（大数）
  //     else {
  //       const [integer, fraction = ""] = coefficient.split(".");
  //       formatted = integer + fraction + "0".repeat(exp - fraction.length);
  //     }
  //   }

  //   // 去除末尾多余的零和小数点
  //   // 示例: 0.000000010000 → 0.00000001
  //   return formatted
  //     .replace(/(\.[0-9]*[1-9])0+$/, "$1") // 去除小数部分末尾的零
  //     .replace(/\.$/, ""); // 去除孤立的小数点
  // };
  const formatTokenPrice = (price: Decimal, decimals: number) => {
    if (typeof decimals !== "number" || decimals < 0) {
        throw new Error("Invalid decimals parameter");
    }

    let formatted: string;

    // 处理大于等于0.001的数值（保留三位小数）
    if (price >= 0.001) {
        formatted = price.toDecimalPlaces(3, Decimal.ROUND_DOWN).toString();
    }
    // 处理小于0.001的数值（保留三位有效数字）
    else {
        formatted = price.toSignificantDigits(3, Decimal.ROUND_DOWN).toString();
    }

    // 处理科学计数法
    if (formatted.includes("e")) {
        formatted = handleScientificNotation(formatted);
    }
    
    // 强制添加前导零
    if (formatted.startsWith(".")) {
        formatted = "0" + formatted;
    }

    // 精确去除末尾无效零
    return formatted
        .replace(/(\.\d*?[1-9])0+$/, '$1') // 只移除末尾连续零
        .replace(/\.$/, ''); // 移除孤立小数点
};

const handleScientificNotation = (str: string) => {
    const [coefficient, exponentStr] = str.split('e');
    const exp = parseInt(exponentStr, 10);

    if (isNaN(exp)) return coefficient;

    // 处理负指数（小数）
    if (exp < 0) {
        const totalZeros = Math.abs(exp) - 1;
        const [intPart, fractPart = ''] = coefficient.split('.');
        
        // 精确计算小数点位置
        const valueStr = intPart + (fractPart || '');
        const paddedValue = valueStr.padStart(totalZeros + valueStr.length, '0');
        
        return `0.${paddedValue.slice(0, totalZeros + 3)}`; // 严格保留三位有效数字
    }

    // 处理正指数（大数）
    const [intPart, fractPart = ''] = coefficient.split('.');
    return `${intPart}${fractPart}${'0'.repeat(exp - fractPart.length)}`;
};
  // 精确计算函数
  const calculateValues = () => {
    const config = CHAIN_CONFIG[transNetWork(currentNetwork)] || CHAIN_CONFIG["ETH"];

    // 强制使用第1天的系数（无论是否在预售期）
    const effectiveDaysPassed = Math.max(1, Math.min(daysPassed, PRESALE_CONFIG.DURATION_DAYS));

    // 计算每日递减系数（1.2^天数）
    const dailyDecreaseFactor = config.dailyFactor.pow(effectiveDaysPassed - 1);

    // 当前每份代币数 = 初始代币数 / 递减系数
    const currentTokensPerShare = config.initialTokensPerShare.div(dailyDecreaseFactor);
    // 单价 = 每份价格 / 每份代币数
    const pricePerToken = config.basePricePerShare.div(currentTokensPerShare);

    // 总代币数 = 当前每份代币数 * 购买份数（向下取整）
    const totalTokens = currentTokensPerShare.mul(shares).floor();

    return {
      pricePerToken: formatTokenPrice(pricePerToken, 20),
      totalTokens: totalTokens.toNumber(),
      ethPerShare: config.basePricePerShare.toFixed(2), // 固定显示0.01
    };
  };
  const { pricePerToken, totalTokens, ethPerShare } = calculateValues();

  // 转账交易
  const handleTransaction = debounce(async () => {
    // 如果预售未开始，则不执行任何操作
    if (!isPresaleActive) return;

    setLoading(true);
    // eth链 sol链
    try {
      let address;
      if (["ETH", "BASE", "BSC"].includes(currentNetwork)) {
        address = toAddress[isTestnet ? "ETH_TEST" : "ETH"];
      } else {
        address = toAddress[isTestnet ? "SOL_TEST" : "SOL"];
      }
      // 转账
      const amount = ethPerShare * shares;
      // 添加调试信息
      console.log("[Transaction]", {
        网络network: currentNetwork,
        当前地址: address,
        第几天: daysPassed,
        "购买数量-份数": shares,
        花费的eth数量: amount,
        所得manus数量: totalTokens,
        pricePerToken,
      });
      // TODO发送交易 - 地址 金额 网络  - 数值较大，则用除以100
      await sendTransaction(address, amount, currentNetwork, totalTokens);
    } finally {
      setLoading(false);
    }
  }, 1000);
  const fetchBalances = useCallback(async () => {
    try {
      const [ethBalance, solBalance, bscBalance] = await Promise.all([
        getCryptoBalance("ETH", toAddress[isTestnet ? "ETH_TEST" : "ETH"], isTestnet ? "testnet" : "mainnet"),
        getCryptoBalance("SOL", toAddress[isTestnet ? "SOL_TEST" : "SOL"], isTestnet ? "testnet" : "mainnet"),
        getCryptoBalance("BSC", toAddress[isTestnet ? "ETH_TEST" : "ETH"], isTestnet ? "testnet" : "mainnet"),
      ]);
      console.log({
        ethBalance,
        solBalance,
        bscBalance,
      });
      setBalances({
        eth: ethBalance.success ? ethBalance.balance : null,
        sol: solBalance.success ? solBalance.balance : null,
        bsc: bscBalance.success ? bscBalance.balance : null,
      });
    } catch (error) {
      console.error("Global fetch error:", error);
    }
  }, [isTestnet]);
  // 定时器设置
  useEffect(() => {
    // 立即执行第一次查询
    fetchBalances();

    // 设置定时器
    const timerID = setInterval(fetchBalances, 1000 * 60 * 2); // 每 2分钟查询一次

    // 清理函数
    return () => clearInterval(timerID);
  }, [fetchBalances]);

  const disabled = useMemo(() => {
    if (!isPresaleActive || !walletAddress) {
      return true;
    }
    return false;
  }, [isPresaleActive, walletAddress]);

  return (
    <>
      <Text fontSize={{ base: "24px", md: "36px" }} fontFamily="var(--font-jersey)" textAlign={"center"} color="white" fontWeight="bold" mb={2}>
        {isPresaleActive ? "Buy $ManusCoin tokens now:" : "COMING SOON"}
        {/* Buy $ManusCoin tokens now: */}
      </Text>
      <Box
        maxW={{ base: "100%", sm: "468px" }}
        h={{ base: "auto", sm: "438px" }}
        mx="auto"
        p={{ base: 4, sm: 8 }}
        borderRadius="xl"
        background="linear-gradient(137deg, rgba(8, 67, 74, 1) -21.95%, #2A1C49 201.71%)" // 背景渐变色
      >
        {/* 倒计时部分 */}
        <VStack spacing={2} w="full">
          <Text mb={4} fontWeight="500" fontSize={{ base: "24px", sm: "30px" }} color="white" fontFamily="var(--font-jersey)" textAlign="center"></Text>
          <ScrollAnimation animationType="fadeIn" delay={0.2}>
            <HStack
              spacing={{ base: 2, sm: 6 }}
              justify="center"
              w="full"
              flexWrap="nowrap"
              overflowX={{ base: "auto", sm: "visible" }}
              pb={{ base: 2, sm: 0 }}
            >
              {Object.entries(timeLeft).map(([unit, value]) => (
                <VStack key={unit} spacing={0} mb={{ base: 0, sm: 0 }} minW={{ base: "60px", sm: "auto" }}>
                  <Box
                    w={{ base: "55px", sm: 75 }}
                    h={{ base: 50, sm: 62 }}
                    bg="white"
                    borderRadius={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={{ base: "20px", sm: "32px" }} fontWeight="800" color="#5D5D5D">
                      {formatTimeUnit(value)}
                    </Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="white" textTransform="capitalize">
                    {unit}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </ScrollAnimation>
        </VStack>

        {/* 募资进度 */}
        <VStack w="full" mt={"11px"} mb={"18px"}>
          <HStack
            w="full"
            justify="center"
            fontSize={{ base: "xs", sm: "sm" }}
            color="white"
            flexWrap={{ base: "wrap", sm: "nowrap" }}
            fontFamily="var(--font-jersey)"
          >
            <Text>raised: {balances.eth !== null ? balances.eth.toFixed(2) : "0.00"}$ ETH</Text>
            <Text>{balances.bsc !== null ? balances.bsc.toFixed(2) : "0.00"}$ BNB</Text>
            <Text>{balances.sol !== null ? balances.sol.toFixed(2) : "0.00"}$ SOL</Text>
          </HStack>

          {/* 时间进度条 */}
          <Box position="relative" w="full" h="32px" borderRadius="0" bg="white" overflow="hidden">
            <Box
              position="absolute"
              top={0}
              left={0}
              w={`${progress}%`}
              h="100%"
              bgGradient="linear-gradient(102deg, #14A5ED 3.12%, #7F64FB 35.28%, #F33265 74.36%, #FF766C 102.07%)"
              transition="width 0.5s ease"
            />
            {/* 进度条文本（可选） */}
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="#262424" fontSize="sm" fontWeight="bold">
              {Math.round(progress)}%
            </Box>
          </Box>
        </VStack>

        {/* 兑换比例 */}
        <Flex align="center" justify="center" mt={"16px"} mb={"14px"} gap={1}>
          <Text fontFamily="var(--font-jersey)" color="white" fontSize={{ base: "sm", sm: "md" }} textAlign="center">
            1 $ManusCoin = {pricePerToken} {CHAIN_CONFIG[transNetWork(currentNetwork)]?.symbol || "ETH"}
          </Text>
        </Flex>

        {/* 滑块输入 */}
        <Flex align={"center"} justify={"center"} mb={6} flexDir={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
          <Text fontFamily="var(--font-jersey)" color="white" mr={{ base: 0, sm: "14px" }} fontSize="14px">
            Purchase quantity:
          </Text>
          <Flex align="center" width={{ base: "100%", sm: "auto" }}>
            <Text fontSize="sm" color="white" mr={"3px"}>
              1
            </Text>
            <Slider
              value={shares}
              onChange={setShares}
              aria-label="token-amount"
              defaultValue={5}
              min={1}
              max={10}
              marginRight={"10px"}
              marginLeft={"10px"}
              w={{ base: "full", sm: "200px" }}
            >
              <SliderTrack h={"8px"} bg="rgba(255,255,255,0.1)">
                <SliderFilledTrack bgGradient="linear-gradient(102deg, #14A5ED 3.12%, #7F64FB 35.28%, #F33265 74.36%, #FF766C 102.07%)" />
              </SliderTrack>
              <SliderThumb boxSize={3} border="2px solid" borderColor="blue.200" _focus={{ boxShadow: "none" }}>
                <Box
                  position="absolute"
                  bottom="100%"
                  mb={0}
                  px={2}
                  py={1}
                  height={"28px"}
                  borderRadius="md"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                >
                  {shares}
                </Box>
              </SliderThumb>
            </Slider>
            <Text fontSize="sm" color="white">
              10
            </Text>
          </Flex>
        </Flex>

        {/* 购买界面 */}
        <ScrollAnimation animationType="slideInFromBottom" delay={0.3}>
          <Button
            isDisabled={disabled}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            isLoading={loading}
            loadingText={"Buy $ManusCoin"}
            w={{ base: "100%", sm: "411px" }}
            h={"44px"}
            lineHeight={"44px"}
            background={"#737373"}
            textAlign={"center"}
            color={"white!important"}
            opacity={1}
            fontSize={{ base: "24px", sm: "26px" }}
            fontWeight={"bold"}
            mx="auto"
            fontFamily="var(--font-jersey)"
            onClick={handleTransaction}
            // bgGradient={walletAddress && IS_PRESALE_ACTIVE ? "linear(to-r, blue.400, purple.400)" : "white!important"}
            // cursor={walletAddress && IS_PRESALE_ACTIVE ? "pointer!important" : "not-allowed"}
            // _hover={{
            //   bg: walletAddress && IS_PRESALE_ACTIVE ? "linear(to-r, blue.400, purple.400)" : "#737373!important",
            // }}
            // _active={{
            //   bg: walletAddress && IS_PRESALE_ACTIVE ? "linear(to-r, blue.400, purple.400)" : "#737373!important",
            // }}
            bgGradient={!disabled ? "linear(to-r, blue.400, purple.400)" : "white!important"}
            cursor={!disabled ? "pointer!important" : "not-allowed"}
            _hover={{
              bg: !disabled ? "linear(to-r, blue.400, purple.400)" : "#737373!important",
            }}
            _active={{
              bg: !disabled ? "linear(to-r, blue.400, purple.400)" : "#737373!important",
            }}
          >
            {/* {IS_PRESALE_ACTIVE ? "Buy" : "Coming Soon"} &nbsp; */}
            Buy &nbsp;
            {/* {
              <Text ml={"4px"} mr={"4px"} color={"#ff766c"}>
                {totalTokens.toLocaleString()} &nbsp;
              </Text>
            } */}
            $ManusCoin
          </Button>
        </ScrollAnimation>

        {/* 价格提示 */}
        <Text textAlign="center" color="white" mt={"10px"} fontSize={{ base: "xs", sm: "sm" }}>
          {isPresaleActive ? "The price of $ManusCoin will increase by 20% daily." : "Presale will be available soon. Please stay tuned!"}
        </Text>
      </Box>
    </>
  );
};

export default observer(TokenSaleWidget);
