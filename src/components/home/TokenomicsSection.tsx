"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";

/**
 * Tokenomics Section Component
 * Displays token allocation and core mechanisms
 */
export default function TokenomicsSection() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box position="relative" bg="transparent">
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-155px"
        left={0}
        right={0}
        height="150px"
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
          <path
            d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,133.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            fill="#0a192f"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Box
        id="tokenomics"
        py={{ base: 10, md: 20 }}
        backgroundImage="url(/TokenSc-bg.png)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment={{ base: "scroll", md: "fixed" }}
        position="relative"
        zIndex={0}
        mt="80px"
        mb="80px"
        backgroundColor="transparent"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Heading
            textAlign="center"
            mb={{ base: 4, md: 8 }}
            bgGradient="linear(to-r, cyan.400, purple.500)"
            bgClip="text"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            Tokenomics
          </Heading>

          <Heading
            textAlign="center"
            mb={{ base: 8, md: 16 }}
            color="whiteAlpha.800"
            fontSize={{ base: "lg", md: "xl" }}
          >
            Distribution Model
          </Heading>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 4, md: 6 }}
            mb={{ base: 8, md: 16 }}
          >
            {/* Card 1 */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(155, 155, 200, 0.1)"
                backdropFilter="blur(5px)"
                height="100%"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Fair Launch: No pre-mine, no private sale—everyone starts
                  equally, with a one-time mint limit per account.
                </Text>
              </Box>
            </GridItem>

            {/* Card 2 */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                height="100%"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Early Bird Advantage: To reward early adopters, token prices
                  increase linearly—minting earlier grants more tokens.
                </Text>
              </Box>
            </GridItem>

            {/* Card 3 */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                height="100%"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Referral Airdrop: Earn 10% of the invitee's presale tokens as
                  an airdrop.
                </Text>
              </Box>
            </GridItem>
          </Grid>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 4, md: 6 }}
            mb={{ base: 8, md: 16 }}
          >
            {/* Card 4 */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                height="100%"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Minting Rules: Min 0.05 ETH (0.16BNB/0.75OL), Max 0.5
                  ETH(1.68NB/7.5OL) per wallet. First 24 hours: Receive one free
                  NFT per 0.05 ETH minted (maximum 10 NFTs per wallet). Presale
                  duration: 72 hours.
                </Text>
              </Box>
            </GridItem>

            {/* Card 5 */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                height="100%"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  Mining by Participation: Community members earn $MANUS by
                  contributing to AI training, content creation, and ecosystem
                  development.
                </Text>
              </Box>
            </GridItem>
          </Grid>

          <Heading
            textAlign="center"
            mb={{ base: 4, md: 8 }}
            color="whiteAlpha.800"
            fontSize={{ base: "lg", md: "xl" }}
          >
            Governance Mechanism
          </Heading>

          <Grid
            templateColumns={{ base: "1fr" }}
            gap={{ base: 4, md: 6 }}
            maxWidth={{ base: "100%", md: "600px" }}
            mx="auto"
            mb={{ base: 4, md: 0 }}
          >
            {/* Governance Card */}
            <GridItem>
              <Box
                p={{ base: 4, md: 6 }}
                bg="rgba(84, 84, 120, 0.3)"
                borderRadius="lg"
                border="1px solid rgba(100,100,255,0.1)"
                backdropFilter="blur(5px)"
                width={{ base: "100%", md: "100%" }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  DAO-Based Evolution: Token holders can propose and vote on
                  Manus' future direction.
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Wave */}
      <Box
        position="absolute"
        bottom="-176px"
        left={0}
        right={0}
        height="196px"
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
          <path
            d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,133.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            fill="#0a192f"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>
    </Box>
  );
}
