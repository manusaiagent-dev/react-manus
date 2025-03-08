"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

/**
 * Gameplay Section Component
 * Displays the project's gamification mechanisms and participation methods
 */
export default function GameplaySection() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box position="relative" bg="transparent">
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-90px"
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
              id="gameTopWaveGradient"
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
            fill="url(#gameTopWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Box
        id="gameplay"
        py={{ base: 10, md: 20 }}
        backgroundImage="url(./images/image4.png)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment={{ base: "scroll", md: "fixed" }}
        position="relative"
        height={{ base: "auto", md: "1200px" }}
        minHeight={{ base: "800px", md: "1200px" }}
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
            "linear-gradient(to bottom,rgba(10, 10, 20, 0.73),rgba(15, 23, 41, 0.55),rgba(10, 10, 20, 0.43))",
          opacity: 0.85,
          zIndex: -1,
        }}
      >
        <Container
          maxW="container.xl"
          position="relative"
          paddingTop={{ base: "100px", md: "390px" }}
        >
          <Heading
            textAlign="center"
            mb={{ base: 8, md: 16 }}
            bgGradient="linear(to-r, cyan.400, purple.500)"
            bgClip="text"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            How to Play
          </Heading>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 6, md: 8 }}
            paddingTop={{ base: "30px", md: "50px" }}
          >
            {/* Card 1 - Battle GPT */}
            <GridItem>
              <Box
                p={6}
                bg="rgba(20,20,40,0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                transition="all 0.3s"
                width={{ base: "100%", md: "80%" }}
                height={{ base: "auto", md: "auto" }}
                position="relative"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 0 20px rgba(100,100,255,0.2)",
                }}
              >
                <Heading size="md" mb={4} color="cyan.400" textAlign="center">
                  Battle GPT
                </Heading>
                <Text
                  fontSize="sm"
                  textAlign="center"
                  width="100%"
                  position="relative"
                >
                  Compete in community events where Manus-trained AI models
                  battle GPT-generated content.
                </Text>
              </Box>
            </GridItem>

            {/* Card 2 - Train & Earn */}
            <GridItem>
              <Box
                p={6}
                bg="rgba(20,20,40,0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                width="100%"
                height={{ base: "auto", md: "auto" }}
                position="relative"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 0 20px rgba(100,100,255,0.2)",
                }}
              >
                <Heading
                  size="md"
                  mb={4}
                  color="cyan.400"
                  textAlign="center"
                  width="100%"
                >
                  Train & Earn
                </Heading>
                <Text
                  fontSize="sm"
                  textAlign="center"
                  width="100%"
                  position="relative"
                >
                  $MANUSCOIN Earn $MANUS by contributing data, providing
                  feedback, and fine-tuning the AI models.
                </Text>
              </Box>
            </GridItem>

            {/* Card 3 - Meme-to-Earn */}
            <GridItem>
              <Box
                p={6}
                bg="rgba(20,20,40,0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                width="100%"
                height={{ base: "auto", md: "auto" }}
                position="relative"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 0 20px rgba(100,100,255,0.2)",
                }}
              >
                <Heading size="md" mb={4} color="cyan.400" textAlign="center">
                  Meme-to-Earn
                </Heading>
                <Text
                  fontSize="sm"
                  textAlign="center"
                  width="100%"
                  position="relative"
                >
                  Create and share Manus-themed memes to earn rewards from the
                  community.
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Wave */}
      <Box
        position="absolute"
        bottom="-90px"
        left={0}
        right={0}
        height="170px"
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
              id="gameBottomWaveGradient"
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
            fill="url(#gameBottomWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>
    </Box>
  );
}
