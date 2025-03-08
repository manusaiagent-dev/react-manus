import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useBreakpointValue,
} from "@chakra-ui/react";
import Decimal from "decimal.js"; // 引入 Decimal.js 处理高精度计算
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../stores/context";

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
const TARGET_DATE = new Date("2025-03-17T00:00:00");
const calculateDaysPassed = () => {
  const now = new Date();
  const targetTime = TARGET_DATE.getTime();
  const nowTime = now.getTime();
  const timeDiff = targetTime - nowTime;
  return Math.max(1, Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1);
};

const TokenSaleWidget = () => {
  // 设置固定目标时间（2025-03-17）
  const [shares, setShares] = useState(5);
  const daysPassed = 1;
  const { currentNetwork } = useAppContext();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  // 倒计时计算
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = TARGET_DATE.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const transNetWork = (network: string) => {
    if (network === "ETH" || network === "BASE") {
      return "ETH";
    } else if (network === "BSC") {
      return "BNB";
    }
    return "ETH";
  };

  // 精确计算函数
  const calculateValues = () => {
    const config =
      CHAIN_CONFIG[transNetWork(currentNetwork)] || CHAIN_CONFIG["ETH"];

    // 每日递增系数
    const dailyIncrease = config.dailyFactor.pow(daysPassed - 1);

    // 第 1 天的价格
    const basePricePerToken = config.baseTotalEth.div(config.baseTotalTokens);

    // 当前价格
    const pricePerToken = basePricePerToken
      .mul(dailyIncrease)
      .toFixed(config.decimals + 6);

    // 总代币数
    const totalTokens = config.baseTotalTokens.div(dailyIncrease).floor();

    // 每份代币数
    const tokensPerShare = totalTokens.div(10).floor();

    // 每份ETH/SOL/BNB
    const ethPerShare = config.baseTotalEth
      .div(10)
      .div(dailyIncrease)
      .toFixed(config.decimals);

    // 去掉末尾多余的零
    const formatPrice = (price: string) => {
      if (price.includes("e")) {
        return new Decimal(price)
          .toFixed(config.decimals + 6)
          .replace(/\.?0+$/, "");
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
  const { pricePerToken, tokensPerShare, totalTokens } = calculateValues();
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
        <Text
          mb={4}
          fontWeight="500"
          fontSize={{ base: "24px", sm: "30px" }}
          color="white"
          fontFamily="var(--font-jersey)"
          textAlign="center"
        >
          {/* <Text fontSize="lg" fontWeight="600" color="gray.700"> */}
          {/* Token price increase in: { perShareDisplay},{ totalDisplay } */}
        </Text>
        <HStack
          spacing={{ base: 2, sm: 6 }}
          justify="center"
          w="full"
          flexWrap="nowrap"
          overflowX={{ base: "auto", sm: "visible" }}
          pb={{ base: 2, sm: 0 }}
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <VStack
              key={unit}
              spacing={0}
              mb={{ base: 0, sm: 0 }}
              minW={{ base: "60px", sm: "auto" }}
            >
              <Box
                w={{ base: "55px", sm: 75 }}
                h={{ base: 50, sm: 62 }}
                bg="white"
                borderRadius={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize={{ base: "20px", sm: "32px" }}
                  fontWeight="800"
                  color="#5D5D5D"
                >
                  {value.toString().padStart(2, "0")}
                </Text>
              </Box>
              <Text
                fontSize={{ base: "xs", sm: "sm" }}
                color="white"
                textTransform="capitalize"
              >
                {unit}
              </Text>
            </VStack>
          ))}
        </HStack>
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
          <Text>raised:$0.00 ETH</Text>
          <Text>$0.00 BNB</Text>
          <Text>$0.00 SQL</Text>
        </HStack>
        <Progress
          value={0}
          w="full"
          height="8px"
          borderRadius="full"
          bg="white"
        />
        {/* <Text fontSize="sm" color="gray.600">
          0%
        </Text> */}
      </VStack>

      {/* 兑换比例 */}
      <Flex align="center" justify="center" mt={"16px"} mb={"14px"} gap={1}>
        <Text
          fontFamily="var(--font-jersey)"
          color="white"
          fontSize={{ base: "sm", sm: "md" }}
          textAlign="center"
        >
          1 $ManusCoin = {pricePerToken}{" "}
          {CHAIN_CONFIG[transNetWork(currentNetwork)]?.symbol || "ETH"}
        </Text>
      </Flex>

      {/* 滑块输入 */}
      <Flex
        align={"center"}
        justify={"center"}
        mb={6}
        flexDir={{ base: "column", sm: "row" }}
        gap={{ base: 2, sm: 0 }}
      >
        <Text
          fontFamily="var(--font-jersey)"
          color="white"
          mr={{ base: 0, sm: "14px" }}
          fontSize="14px"
        >
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
            <SliderThumb
              boxSize={3}
              border="2px solid"
              borderColor="blue.200"
            />
          </Slider>
          <Text fontSize="sm" color="white">
            10
          </Text>
        </Flex>
      </Flex>

      {/* 购买界面 */}
      <Flex
        justify={"center"}
        align={"center"}
        w={{ base: "100%", sm: "411px" }}
        h={"44px"}
        cursor={"not-allowed"}
        lineHeight={"44px"}
        background={"#737373"}
        textAlign={"center"}
        color={"white!important"}
        opacity={1}
        fontSize={{ base: "24px", sm: "26px" }}
        fontWeight={"bold"}
        mx="auto"
        fontFamily="var(--font-jersey)"
      >
        Buy
        <Text ml={"4px"} mr={"4px"} color={"#ff766c"}>
          {totalTokens.toLocaleString()}
        </Text>
        $ManusCoin
      </Flex>

      {/* 价格提示 */}
      <Text
        textAlign="center"
        color="white"
        mt={"10px"}
        fontSize={{ base: "xs", sm: "sm" }}
      >
        The price of $ManusCoin will increase by 20% daily.
      </Text>
    </Box>
  );
};

export default observer(TokenSaleWidget);
