"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  UnorderedList,
  ListItem,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";

/**
 * Roadmap Section Component
 * Displays the project's development plan and timeline
 */
export default function RoadmapSection() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      position="relative"
      bg="transparent"
      height={{ base: "auto", md: "auto", lg: "1650px" }}
    >
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-2px"
        left={0}
        right={0}
        height="80px"
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
              id="roadmapTopWaveGradient"
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
            fill="url(#roadmapTopWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Box
        id="roadmap"
        py={{ base: 10, md: 20 }}
        backgroundImage="url(./images/image5.png)"
        backgroundSize="contain"
        backgroundPosition="center"
        backgroundAttachment={{ base: "scroll", md: "fixed" }}
        position="relative"
        height={{ base: "auto", md: "auto", lg: "1650px" }}
        paddingTop={{ base: "100px", md: "150px", lg: "250px" }}
        zIndex={0}
        mt="80px"
        mb="80px"
        backgroundColor="transparent"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.41), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.31))",
          opacity: 0,
          zIndex: -1,
        }}
      >
        <Container maxW="container.xl">
          <Heading
            textAlign="center"
            mb={{ base: 8, md: 16 }}
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            Roadmap
          </Heading>

          {/* 移动端使用垂直布局 */}
          {isMobile ? (
            <VStack spacing={10} align="stretch" mt={6} px={4}>
              {/* Q1 2025 */}
              <Box
                mb={6}
                bg="rgba(0,0,0,0.3)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="purple.300"
              >
                <Heading
                  fontSize="xl"
                  mb={3}
                  color="purple.300"
                  fontFamily="var(--font-jersey)"
                >
                  Q1 2025
                </Heading>
                <Heading
                  fontSize="lg"
                  mb={4}
                  color="white"
                  fontFamily="var(--font-jersey)"
                >
                  Genesis
                </Heading>
                <UnorderedList
                  spacing={2}
                  ml={5}
                  color="whiteAlpha.900"
                  fontSize="sm"
                >
                  <ListItem>
                    Launch official community channels (Twitter / Telegram).
                  </ListItem>
                  <ListItem>
                    Release the first batch of Manus NFT avatars, granting
                    holders priority participation in ecosystem development.
                  </ListItem>
                  <ListItem>
                    Initiate Fair Launch, distributing $MANUS tokens.
                  </ListItem>
                </UnorderedList>
              </Box>

              {/* Q2 2025 */}
              <Box
                mb={6}
                bg="rgba(0,0,0,0.3)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.300"
              >
                <Heading
                  fontSize="xl"
                  mb={3}
                  color="blue.300"
                  fontFamily="var(--font-jersey)"
                >
                  Q2 2025
                </Heading>
                <Heading
                  fontSize="lg"
                  mb={4}
                  color="white"
                  fontFamily="var(--font-jersey)"
                >
                  Ecosystem Expansion
                </Heading>
                <UnorderedList
                  spacing={2}
                  ml={5}
                  color="whiteAlpha.900"
                  fontSize="sm"
                >
                  <ListItem>
                    Launch Manus AI training platform, allowing users to
                    contribute data and fine-tune AI models.
                  </ListItem>
                  <ListItem>
                    Introduce Meme-to-Earn, incentivizing community creativity
                    and content sharing.
                  </ListItem>
                  <ListItem>
                    Partner with Web3 DEXs to provide liquidity support.
                  </ListItem>
                  <ListItem>
                    Officially list $MANUS on DEXs, enabling open trading pairs.
                  </ListItem>
                </UnorderedList>
              </Box>

              {/* Q3 2025 */}
              <Box
                mb={6}
                bg="rgba(0,0,0,0.3)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="green.300"
              >
                <Heading
                  fontSize="xl"
                  mb={3}
                  color="green.300"
                  fontFamily="var(--font-jersey)"
                >
                  Q3 2025
                </Heading>
                <Heading
                  fontSize="lg"
                  mb={4}
                  color="white"
                  fontFamily="var(--font-jersey)"
                >
                  AI Evolution
                </Heading>
                <UnorderedList
                  spacing={2}
                  ml={5}
                  color="whiteAlpha.900"
                  fontSize="sm"
                >
                  <ListItem>
                    Deploy Manus AI Model V1 and open its API to the community.
                  </ListItem>
                  <ListItem>
                    Launch AI training leaderboard to encourage participation in
                    Train-to-Earn mining.
                  </ListItem>
                  <ListItem>
                    Initiate DAO governance, allowing community members to vote
                    on key project directions.
                  </ListItem>
                  <ListItem>
                    Form strategic partnerships with other Web3 projects to
                    expand the Manus ecosystem.
                  </ListItem>
                </UnorderedList>
              </Box>

              {/* Q4 2025 */}
              <Box
                mb={6}
                bg="rgba(0,0,0,0.3)"
                p={6}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="orange.300"
              >
                <Heading
                  fontSize="xl"
                  mb={3}
                  color="orange.300"
                  fontFamily="var(--font-jersey)"
                >
                  Q4 2025
                </Heading>
                <Heading
                  fontSize="lg"
                  mb={4}
                  color="white"
                  fontFamily="var(--font-jersey)"
                >
                  Mass Adoption
                </Heading>
                <UnorderedList
                  spacing={2}
                  ml={5}
                  color="whiteAlpha.900"
                  fontSize="sm"
                >
                  <ListItem>
                    Manus AI vs. GPT Battle: Organize a community challenge to
                    compare decentralized AI vs. centralized AI.
                  </ListItem>
                  <ListItem>
                    Release AI-generated NFTs, exploring the intersection of AI
                    and NFTs.
                  </ListItem>
                  <ListItem>
                    Open Manus ecosystem integration, enabling more Web3
                    projects to adopt Manus AI models.
                  </ListItem>
                  <ListItem>
                    Implement cross-chain functionality, enhancing scalability
                    and multi-chain interoperability.
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          ) : (
            // 桌面端使用原有的布局
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={10}
              mt={10}
              paddingTop={"100px"}
            >
              {/* Q1 2025 */}
              <GridItem position={"absolute"} left={"120px"}>
                <Box mb={10}>
                  <Heading
                    fontSize="2xl"
                    mb={4}
                    color="purple.300"
                    fontFamily="var(--font-jersey)"
                  >
                    Q1 2025
                  </Heading>
                  <Heading
                    fontSize="xl"
                    mb={6}
                    color="white"
                    fontFamily="var(--font-jersey)"
                  >
                    Genesis
                  </Heading>
                  <UnorderedList spacing={3} ml={5} color="whiteAlpha.900">
                    <ListItem>
                      Launch official community channels (Twitter / Telegram).
                    </ListItem>
                    <ListItem>
                      Release the first batch of Manus NFT avatars, granting
                      holders priority participation in ecosystem development.
                    </ListItem>
                    <ListItem>
                      Initiate Fair Launch, distributing $MANUS tokens.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </GridItem>

              {/* Q2 2025 */}
              <GridItem position={"absolute"} right={"20px"} top={"820px"}>
                <Box mb={10}>
                  <Heading
                    fontSize="2xl"
                    mb={4}
                    color="blue.300"
                    fontFamily="var(--font-jersey)"
                  >
                    Q2 2025
                  </Heading>
                  <Heading
                    fontSize="xl"
                    mb={6}
                    color="white"
                    fontFamily="var(--font-jersey)"
                  >
                    Ecosystem Expansion
                  </Heading>
                  <UnorderedList spacing={3} ml={5} color="whiteAlpha.900">
                    <ListItem>
                      Launch Manus AI training platform, allowing users to
                      contribute data and fine-tune AI models.
                    </ListItem>
                    <ListItem>
                      Introduce Meme-to-Earn, incentivizing community creativity
                      and content sharing.
                    </ListItem>
                    <ListItem>
                      Partner with Web3 DEXs to provide liquidity support.
                    </ListItem>
                    <ListItem>
                      Officially list $MANUS on DEXs, enabling open trading
                      pairs.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </GridItem>

              {/* Q3 2025 */}
              <GridItem position={"absolute"} top={"1100px"} left={"120px"}>
                <Box mb={10}>
                  <Heading
                    fontSize="2xl"
                    mb={4}
                    color="green.300"
                    fontFamily="var(--font-jersey)"
                  >
                    Q3 2025
                  </Heading>
                  <Heading
                    fontSize="xl"
                    mb={6}
                    color="white"
                    fontFamily="var(--font-jersey)"
                  >
                    AI Evolution
                  </Heading>
                  <UnorderedList spacing={3} ml={5} color="whiteAlpha.900">
                    <ListItem>
                      Deploy Manus AI Model V1 and open its API to the
                      community.
                    </ListItem>
                    <ListItem>
                      Launch AI training leaderboard to encourage participation
                      in Train-to-Earn mining.
                    </ListItem>
                    <ListItem>
                      Initiate DAO governance, allowing community members to
                      vote on key project directions.
                    </ListItem>
                    <ListItem>
                      Form strategic partnerships with other Web3 projects to
                      expand the Manus ecosystem.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </GridItem>

              {/* Q4 2025 */}
              <GridItem position={"absolute"} top={"1430px"} right={"20px"}>
                <Box mb={10}>
                  <Heading
                    fontSize="2xl"
                    mb={4}
                    color="orange.300"
                    fontFamily="var(--font-jersey)"
                  >
                    Q4 2025
                  </Heading>
                  <Heading
                    fontSize="xl"
                    mb={6}
                    color="white"
                    fontFamily="var(--font-jersey)"
                  >
                    Mass Adoption
                  </Heading>
                  <UnorderedList spacing={3} ml={5} color="whiteAlpha.900">
                    <ListItem>
                      Manus AI vs. GPT Battle: Organize a community challenge to
                      compare decentralized AI vs. centralized AI.
                    </ListItem>
                    <ListItem>
                      Release AI-generated NFTs, exploring the intersection of
                      AI and NFTs.
                    </ListItem>
                    <ListItem>
                      Open Manus ecosystem integration, enabling more Web3
                      projects to adopt Manus AI models.
                    </ListItem>
                    <ListItem>
                      Implement cross-chain functionality, enhancing scalability
                      and multi-chain interoperability.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </GridItem>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Bottom Wave */}
      <Box
        position="absolute"
        bottom="-190px"
        left={0}
        right={0}
        height="220px"
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
              id="roadmapBottomWaveGradient"
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
            fill="url(#roadmapBottomWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>
    </Box>
  );
}
