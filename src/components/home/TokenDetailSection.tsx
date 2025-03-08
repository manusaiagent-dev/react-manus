"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Image,
  ListItem,
  UnorderedList,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";

/**
 * Token Detail Section Component
 * Displays detailed information about token allocation and core mechanisms
 */
export default function TokenDetailSection() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      position="relative"
      bg="transparent"
      height={{ base: "auto", md: "auto", lg: "1700px" }}
    >
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-150px"
        left={0}
        right={0}
        height="160px"
        zIndex={2}
        overflow="visible"
        transform="rotate(180deg)"
      >
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient
              id="tokenDetailTopWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0a0a14" />
              <stop offset="50%" stopColor="#0f1729" />
              <stop offset="100%" stopColor="#0a0a14" />
            </linearGradient>
          </defs>
          <path
            d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,133.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            fill="url(#tokenDetailTopWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Box
        id="token-detail"
        py={{ base: 10, md: 20 }}
        backgroundImage="url(/image4.png)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment={{ base: "scroll", md: "fixed" }}
        position="relative"
        height={{ base: "auto", md: "auto", lg: "1700px" }}
        minHeight={{ base: "auto", md: "auto" }}
        zIndex={0}
        mt="80px"
        mb="80px"
        backgroundColor="transparent"
        borderRadius={"20px"}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(255, 248, 248, 0.05), rgba(255, 255, 255, 0.47), rgba(255,255,255,0.05))",
          opacity: 0.85,
          zIndex: -1,
        }}
      >
        <Container
          maxW="container.xl"
          paddingTop={{ base: "50px", md: "100px", lg: "80px" }}
        >
          <Heading
            as="h2"
            size="xl"
            mb={8}
            textAlign="center"
            color="white"
            fontFamily="var(--font-jersey)"
          >
            Tokenomics
          </Heading>

          {/* 移动端布局 */}
          {isMobile ? (
            <VStack spacing={10} align="stretch">
              {/* 移动端 Token Allocation */}
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.300"
              >
                <Heading
                  fontSize="xl"
                  mb={4}
                  textAlign="center"
                  fontFamily="var(--font-jersey)"
                  color="white"
                >
                  $MANUSCOIN Token Allocation
                </Heading>

                <UnorderedList spacing={3} styleType="none" ml={0}>
                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="blue.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        10% Airdrop:
                      </Text>{" "}
                      Rewards early NFT holders, ensuring core community members
                      have initial ownership.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="blue.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        10% Ecosystem Growth:
                      </Text>{" "}
                      Incentives for developers, content creators, and partners
                      to expand the Manus ecosystem.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="blue.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        40% Fair Mint:
                      </Text>{" "}
                      Open minting for all users with no private sale or
                      pre-mining.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start">
                    <Text as="span" fontWeight="bold" mr={2} color="blue.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        40% LP Liquidity:
                      </Text>{" "}
                      Allocated to AMMs and DEXs to ensure market stability and
                      deep liquidity.
                    </Text>
                  </ListItem>
                </UnorderedList>
              </Box>

              {/* 移动端图片 1 */}
              <Box mx="auto" my={4}>
                <Image
                  src="/images/people1.png"
                  alt="Manus Character 1"
                  width="200px"
                  height="200px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>

              {/* 移动端 Core Token Mechanics */}
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="purple.300"
              >
                <Heading
                  fontSize="xl"
                  mb={4}
                  textAlign="center"
                  fontFamily="var(--font-jersey)"
                  color="white"
                >
                  Core Token Mechanics
                </Heading>

                <UnorderedList spacing={3} styleType="none" ml={0}>
                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="purple.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        DAO Governance:
                      </Text>{" "}
                      $MANUSCOIN holders can vote on the project's future
                      direction.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="purple.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        Staking Rewards:
                      </Text>{" "}
                      Users can stake $MANUSCOIN to earn additional rewards.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start" mb={2}>
                    <Text as="span" fontWeight="bold" mr={2} color="purple.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        Train-to-Earn:
                      </Text>{" "}
                      Users contribute data and train the AI to receive $MANUS
                      incentives.
                    </Text>
                  </ListItem>

                  <ListItem display="flex" alignItems="flex-start">
                    <Text as="span" fontWeight="bold" mr={2} color="purple.300">
                      •
                    </Text>
                    <Text
                      fontFamily="var(--font-jersey)"
                      fontSize="sm"
                      color="white"
                    >
                      <Text
                        as="span"
                        fontWeight="bold"
                        fontFamily="var(--font-jersey)"
                      >
                        Meme-to-Earn:
                      </Text>{" "}
                      Community members can create and share Manus-related memes
                      to earn tokens.
                    </Text>
                  </ListItem>
                </UnorderedList>
              </Box>

              {/* 移动端图片 2 */}
              <Box mx="auto" my={4}>
                <Image
                  src="/images/people2.png"
                  alt="Manus Character 2"
                  width="200px"
                  height="200px"
                  objectFit="contain"
                  mx="auto"
                />
              </Box>
            </VStack>
          ) : (
            // 桌面端布局 - 按照图片中的布局
            <Flex
              direction="column"
              align="center"
              justify="center"
              mt={{ base: 6, md: 12 }}
              maxW="1000px"
              mx="auto"
            >
              {/* 第一部分：Token Allocation */}
              <Flex
                direction="row"
                justify="space-between"
                align="flex-start"
                w="100%"
                mb={20}
              >
                {/* 左侧文本 */}
                <Box width="60%" pr={8}>
                  <Heading
                    fontSize={{ md: "xl", lg: "2xl" }}
                    mb={6}
                    textAlign="left"
                    fontFamily="var(--font-jersey)"
                    color="white"
                  >
                    $MANUSCOIN Token Allocation
                  </Heading>

                  <UnorderedList spacing={4} styleType="none" ml={0}>
                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          10% Airdrop:
                        </Text>{" "}
                        Rewards early NFT holders, ensuring core community
                        members have initial ownership.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          10% Ecosystem Growth:
                        </Text>{" "}
                        Incentives for developers, content creators, and
                        partners to expand the Manus ecosystem.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          40% Fair Mint:
                        </Text>{" "}
                        Open minting for all users with no private sale or
                        pre-mining.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start">
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          40% LP Liquidity:
                        </Text>{" "}
                        Allocated to AMMs (Automated Market Makers) and DEXs
                        (Decentralized Exchanges) to ensure market stability and
                        deep liquidity.
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </Box>

                {/* 右侧图片 */}
                <Box
                  width="40%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    src="/images/people1.png"
                    alt="Manus Character 1"
                    width="250px"
                    objectFit="contain"
                  />
                </Box>
              </Flex>

              {/* 第二部分：Core Token Mechanics */}
              <Flex
                direction="row"
                justify="space-between"
                align="flex-start"
                w="100%"
                mt={10}
              >
                {/* 左侧图片 */}
                <Box
                  width="40%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    src="/images/people2.png"
                    alt="Manus Character 2"
                    width="250px"
                    objectFit="contain"
                  />
                </Box>

                {/* 右侧文本 */}
                <Box width="60%" pl={8}>
                  <Heading
                    fontSize={{ md: "xl", lg: "2xl" }}
                    mb={6}
                    textAlign="left"
                    fontFamily="var(--font-jersey)"
                    color="white"
                  >
                    Core Token Mechanics
                  </Heading>

                  <UnorderedList spacing={4} styleType="none" ml={0}>
                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          DAO Governance:
                        </Text>{" "}
                        $MANUSCOIN holders can vote on the project's future
                        direction.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          Staking Rewards:
                        </Text>{" "}
                        Users can stake $MANUSCOIN to earn additional rewards.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start" mb={3}>
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          Train-to-Earn:
                        </Text>{" "}
                        Users contribute data and train the AI to receive $MANUS
                        incentives.
                      </Text>
                    </ListItem>

                    <ListItem display="flex" alignItems="flex-start">
                      <Text as="span" fontWeight="bold" mr={2} color="white">
                        •
                      </Text>
                      <Text
                        fontFamily="var(--font-jersey)"
                        fontSize={{ md: "sm", lg: "md" }}
                        color="white"
                      >
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontFamily="var(--font-jersey)"
                        >
                          Meme-to-Earn:
                        </Text>{" "}
                        Community members can create and share Manus-related
                        memes to earn tokens.
                      </Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Flex>
            </Flex>
          )}
        </Container>
      </Box>

      {/* Bottom Wave */}
      <Box
        position="absolute"
        bottom="-76px"
        left={0}
        right={0}
        height="150px"
        zIndex={2}
        overflow="visible"
      >
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient
              id="tokenDetailBottomWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0a0a14" />
              <stop offset="50%" stopColor="#0f1729" />
              <stop offset="100%" stopColor="#0a0a14" />
            </linearGradient>
          </defs>
          <path
            d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,133.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            fill="url(#tokenDetailBottomWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>
    </Box>
  );
}
