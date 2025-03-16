import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, VStack, HStack, Text, Progress, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useBreakpointValue, Button } from "@chakra-ui/react";
import Decimal from "decimal.js"; // 引入 Decimal.js 处理高精度计算
import { debounce } from "lodash";
import { chainIdsToNames, toAddress } from "@/config/networks";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../stores/context";
import ScrollAnimation from "../ui/ScrollAnimation";
import { getCryptoBalance } from "../../utils/getCryptoBalance";
import useCrossChainTransfer from "../hooks/useSendTransaction";

// 控制预售是否开始的常量
const IS_PRESALE_ACTIVE = true;

const CHAIN_CONFIG: {
  [key: string]: {
    symbol: string;
    dailyFactor: Decimal;
    baseTotalEth: Decimal;
    baseTotalTokens: Decimal;
    decimals: number;
  };
} = {
  ETH: {
    symbol: "ETH",
    dailyFactor: new Decimal(1.2),
    baseTotalEth: new Decimal(0.5),
    baseTotalTokens: new Decimal(50000000),
    decimals: 9,
  },
  BNB: {
    symbol: "BNB",
    dailyFactor: new Decimal(1.2),
    baseTotalEth: new Decimal(1.6),
    baseTotalTokens: new Decimal(50000000),
    decimals: 4,
  },
  SOL: {
    symbol: "SOL",
    dailyFactor: new Decimal(1.2),
    baseTotalEth: new Decimal(7),
    baseTotalTokens: new Decimal(50000000),
    decimals: 2,
  },
};
const calculateDaysPassed = (startDate: Date, endDate: Date) => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
};

const TokenSaleWidget = () => {
  // 设置固定目标时间（2025-03-17）
  const [shares, setShares] = useState(5);
  const { walletAddress, chainId, setLoading, loading, isTestnet } = useAppContext();
  const [currentNetwork, setCurrentNetwork] = useState("ETH");
  const sendTransaction = useCrossChainTransfer();

  const [progress, setProgress] = useState(0); // 进度

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // 获取当前设置时间
  const getTodayStart = () => {
    const todayStart = new Date(2025, 2, 14);
    return todayStart;
  };
  // 计算当前设置时间并设置7天倒计时
  const getEndDate = useCallback(() => {
    const todayStart = getTodayStart();
    // 设置7天后的凌晨
    const endDate = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    return endDate;
  }, []);
  const [daysPassed, setDaysPassed] = useState(1); // 当天算第一天
  // 监测余额
  const [balances, setBalances] = useState<{
    eth: number | null;
    sol: number | null;
    bsc: number | null;
  }>({ eth: null, sol: null, bsc: null });

  useEffect(() => {
    const name = chainIdsToNames[chainId]?.split("_")[0] || "ETH";
    setCurrentNetwork(name);
  }, [chainId]);
  // 倒计时计算
  useEffect(() => {
    const endDate = getEndDate();
    const todayStart = getTodayStart();

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setDaysPassed(7);

        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setDaysPassed(calculateDaysPassed(todayStart, now)); // 更新已过天数
      return () => clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [getEndDate]);
  // 格式化时间显示
  const formatTimeUnit = (value: number) => {
    return value < 0 ? "00" : value.toString().padStart(2, "0");
  };
  // 计算进度
  const calculateProgress = useCallback(() => {
    const now = new Date();
    const startTime = getTodayStart().getTime();
    const endTime = getEndDate().getTime();
    const totalDuration = endTime - startTime;
    const elapsedTime = now.getTime() - startTime;

    // 计算进度百分比
    const progressValue = Math.min((elapsedTime / totalDuration) * 100, 100);
    setProgress(progressValue);
  }, [getEndDate]);
  // 定时更新进度
  useEffect(() => {
    calculateProgress(); // 初始化计算
    const timer = setInterval(calculateProgress, 1000); // 每秒更新一次

    return () => clearInterval(timer); // 清理定时器
  }, [calculateProgress]);
  const transNetWork = (network: string) => {
    const networkMap = {
      SOL: "SOL",
      ETH: "ETH",
      BASE: "ETH",
      BSC: "BNB",
    };
    return networkMap[network] || "ETH";
  };

  // 精确计算函数
  const calculateValues = () => {
    const config = CHAIN_CONFIG[transNetWork(currentNetwork)] || CHAIN_CONFIG["ETH"];

    // 每日递增系数
    const dailyIncrease = config.dailyFactor.pow(daysPassed - 1);

    // 第 1 天的价格
    const basePricePerToken = config.baseTotalEth.div(config.baseTotalTokens);

    // 当前价格
    const pricePerToken = basePricePerToken.mul(dailyIncrease).toFixed(config.decimals + 6);

    // 总代币数
    const totalTokens = config.baseTotalTokens.div(dailyIncrease).floor();

    // 每份代币数
    const tokensPerShare = totalTokens.div(10).floor();

    // 每份ETH/SOL/BNB
    const ethPerShare = config.baseTotalEth.div(10).div(dailyIncrease).toFixed(config.decimals);

    // 去掉末尾多余的零
    const formatPrice = (price) => {
      if (price.includes("e")) {
        return new Decimal(price).toFixed(config.decimals + 6).replace(/\.?0+$/, "");
      }
      return price.replace(/\.?0+$/, "");
    };

    return {
      pricePerToken: formatPrice(pricePerToken), // 格式化后的价格
      tokensPerShare: tokensPerShare.toNumber(),
      totalTokens: tokensPerShare.mul(shares).toNumber(),
      ethPerShare: formatPrice(ethPerShare), // 每份 ETH/SOL/BNB
    };
  };
  const { pricePerToken, ethPerShare } = calculateValues();

  // 转账交易
  const handSendTransaction = debounce(async () => {
    // 如果预售未开始，则不执行任何操作
    if (!IS_PRESALE_ACTIVE) {
      return;
    }

    setLoading(true);
    // eth链 sol链

    let address;
    if (currentNetwork === "ETH" || currentNetwork === "BASE" || currentNetwork === "BSC") {
      address = toAddress[isTestnet ? "ETH_TEST" : "ETH"];
    } else {
      address = toAddress[isTestnet ? "SOL_TEST" : "SOL"];
    }
    // 转账
    const amount = ethPerShare * shares;
    // 添加调试信息
    console.debug("[Transaction]", {
      network: currentNetwork,
      isTestnet,
      address,
      rawAmount: amount,
      finalAmount: amount / 100,
    });
    // TODO发送交易 - 地址 金额 网络  - 数值较大，则用除以100
    await sendTransaction(address, amount / 100, currentNetwork);
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
    const timer = setInterval(fetchBalances, 1000 * 60 * 2); // 每 2分钟查询一次

    // 清理函数
    return () => clearInterval(timer);
  }, [fetchBalances]);

  const disabled = useMemo(() => {
    if (IS_PRESALE_ACTIVE && walletAddress && !isTestnet) {
      return true;
    }
  }, [walletAddress, isTestnet]);

  return (
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
        <Text mb={4} fontWeight="500" fontSize={{ base: "24px", sm: "30px" }} color="white" fontFamily="var(--font-jersey)" textAlign="center">
          {/* <Text fontSize="lg" fontWeight="600" color="gray.700"> */}
          {/* Token price increase in: { perShareDisplay},{ totalDisplay } */}
        </Text>
        <ScrollAnimation animationType="fadeIn" delay={0.2}>
          <HStack spacing={{ base: 2, sm: 6 }} justify="center" w="full" flexWrap="nowrap" overflowX={{ base: "auto", sm: "visible" }} pb={{ base: 2, sm: 0 }}>
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
        {/* <Progress value={0} w="full" height="8px" borderRadius="full" bg="white" /> */}
        {/* <Text fontSize="sm" color="gray.600">
          0%
        </Text> */}
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
                height={'28px'}
                borderRadius="md"
                color="white"
                fontSize="sm"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                {shares}
              </Box>
            </SliderThumb>
            {/* <SliderThumb boxSize={3} border="2px solid" borderColor="blue.200" /> */}
          </Slider>
          <Text fontSize="sm" color="white">
            10
          </Text>
        </Flex>
      </Flex>

      {/* 购买界面 */}
      <ScrollAnimation animationType="slideInFromBottom" delay={0.3}>
        <Button
          // disabled={!walletAddress || !IS_PRESALE_ACTIVE}
          disabled={disabled}
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
          onClick={handSendTransaction}
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
          {IS_PRESALE_ACTIVE ? "Buy" : "Coming Soon"} &nbsp;
          {/* <Text ml={"4px"} mr={"4px"} color={"#ff766c"}>
            {totalTokens.toLocaleString()}
          </Text> */}
          $ManusCoin
        </Button>
      </ScrollAnimation>

      {/* 价格提示 */}
      <Text textAlign="center" color="white" mt={"10px"} fontSize={{ base: "xs", sm: "sm" }}>
        {IS_PRESALE_ACTIVE ? "The price of $ManusCoin will increase by 20% daily." : "Presale will be available soon. Please stay tuned!"}
      </Text>
    </Box>
  );
};

export default observer(TokenSaleWidget);
