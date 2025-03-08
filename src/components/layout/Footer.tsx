"use client";

import { Box, Container, Text, Center } from "@chakra-ui/react";

/**
 * Footer Component
 * Displays the footer section of the website
 */
export default function Footer() {
  return (
    <Box position="relative" bg="#121212">
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-2px"
        left={0}
        right={0}
        height="0px"
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
              id="footerTopWaveGradient"
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
            fill="url(#footerTopWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Container
        maxW="container.xl"
        pt={{ base: 12, md: 20 }}
        pb={{ base: 6, md: 10 }}
        px={{ base: 4, md: 8 }}
      >
        <Center>
          <Box maxW="800px" textAlign="center">
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              mb={{ base: 3, md: 4 }}
              color="white"
            >
              Disclaimer
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mb={{ base: 6, md: 8 }}
              lineHeight="1.8"
              px={{ base: 2, md: 0 }}
            >
              ManusGoin is a meme-based cryptocurrency with no intrinsic value.
              It carries a high risk of capital loss and offers no guaranteed
              returns. The project is entirely community-driven with no official
              team and is designed purely for entertainment purposes. Investing
              in cryptocurrencies is risky and may result in a total loss of
              your investment. Always conduct your own research and invest only
              what you can afford to lose.
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mb={{ base: 6, md: 8 }}
              lineHeight="1.8"
              px={{ base: 2, md: 0 }}
            >
              Restricted Countries: Residents of Afghanistan, Benin, Bhutan,
              China, Crimea, Cuba, Iran, Iraq, Syria, the United States, Vatican
              City, or any jurisdiction where such distribution or usage
              violates local laws are prohibited from participating in the
              presale. The information on this website is not intended for
              individuals in jurisdictions where offering or selling tokens is
              not permitted by law.
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
              mt={{ base: 6, md: 10 }}
            >
              ManusCoin © 2025. All Rights Reserved.
            </Text>
          </Box>
        </Center>
      </Container>
    </Box>
  );
}
