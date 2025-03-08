"use client";

import { Box, Container, Heading, Text, Flex, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Define the left scrolling animation
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Define the right scrolling animation
const scrollRight = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

// Define the border glow animation
const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px 2px rgba(var(--glow-color), 0.7); }
  50% { box-shadow: 0 0 15px 5px rgba(var(--glow-color), 0.9); }
  100% { box-shadow: 0 0 5px 2px rgba(var(--glow-color), 0.7); }
`;

/**
 * NFT Showcase Section Component
 * Displays the project's NFT images, implementing infinite horizontal scrolling
 */
export default function NftShowcaseSection() {
  // Create an array of NFT images, displaying 7 images per row, but more are needed to achieve infinite scrolling
  const topRowImages = [
    "/images/nft1.png",
    "/images/nft3.png",
    "/images/nft5.png",
    "/images/nft7.png",
    "/images/nft9.png",
    "/images/nft11.png",
    "/images/nft13.png",
    "/images/nft2.png",
    "/images/nft4.png",
    "/images/nft6.png",
    "/images/nft8.png",
    "/images/nft10.png",
    "/images/nft12.png",
    "/images/nft14.png",
  ];

  const bottomRowImages = [
    "/images/nft2.png",
    "/images/nft4.png",
    "/images/nft6.png",
    "/images/nft8.png",
    "/images/nft10.png",
    "/images/nft12.png",
    "/images/nft14.png",
    "/images/nft1.png",
    "/images/nft3.png",
    "/images/nft5.png",
    "/images/nft7.png",
    "/images/nft9.png",
    "/images/nft11.png",
    "/images/nft13.png",
  ];

  // Cyberpunk-style border colors
  const cyberpunkColors = [
    "255, 0, 128", // Neon Pink
    "0, 255, 255", // Neon Cyan
    "255, 255, 0", // Neon Yellow
    "128, 0, 255", // Neon Purple
    "0, 255, 128", // Neon Green
    "255, 128, 0", // Neon Orange
    "0, 128, 255", // Neon Blue
    "255, 0, 255", // Neon Magenta
    "128, 255, 0", // Neon Yellow-Green
    "0, 255, 0", // Neon Green
    "255, 0, 0", // Neon Red
    "0, 0, 255", // Neon Blue
    "255, 128, 128", // Neon Pink
    "128, 255, 255", // Neon Light Cyan
  ];

  return (
    <Box position="relative" bg="transparent">
      {/* Top Wave */}
      <Box
        position="absolute"
        top="-40px"
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
              id="nftTopWaveGradient"
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
            fill="url(#nftTopWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>

      <Box
        id="nft-showcase"
        py={20}
        backgroundImage="url(/images/image5.png)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        position="relative"
        height={"900px"}
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
            "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9), rgba(0,0,0,0.8))",
          opacity: 0.9,
          zIndex: -1,
        }}
      >
        <Container maxW="container.xl" centerContent paddingTop={"110px"}>
          <Heading
            textAlign="center"
            mb={16}
            color="white"
            fontSize="3xl"
            fontFamily="var(--font-jersey)"
          >
            Manus is here. The AI war has begun.
          </Heading>

          {/* First row of NFT images - scrolling left */}
          <Box width="100%" overflow="hidden" position="relative" mb={8}>
            <Flex
              position="absolute"
              width="fit-content"
              animation={`${scrollLeft} 40s linear infinite`}
            >
              {/* Duplicate images to ensure infinite scrolling effect */}
              {[...topRowImages, ...topRowImages].map((src, index) => (
                <Box
                  key={`row1-${index}`}
                  width="160px"
                  height="160px"
                  mx={2}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                  position="relative"
                  sx={{
                    "--glow-color":
                      cyberpunkColors[index % cyberpunkColors.length],
                    animation: `${glowPulse} 2s infinite ease-in-out`,
                    animationDelay: `${(index * 0.2) % 2}s`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`NFT ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </Box>
              ))}
            </Flex>
            {/* Create a placeholder space to ensure container height is correct */}
            <Box height="160px"></Box>
          </Box>

          {/* Second row of NFT images - scrolling right */}
          <Box width="100%" overflow="hidden" position="relative" mb={16}>
            <Flex
              position="absolute"
              width="fit-content"
              animation={`${scrollRight} 40s linear infinite`}
            >
              {/* Duplicate images to ensure infinite scrolling effect */}
              {[...bottomRowImages, ...bottomRowImages].map((src, index) => (
                <Box
                  key={`row2-${index}`}
                  width="160px"
                  height="160px"
                  mx={2}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                  position="relative"
                  sx={{
                    "--glow-color":
                      cyberpunkColors[
                        (cyberpunkColors.length - 1 - index) %
                          cyberpunkColors.length
                      ],
                    animation: `${glowPulse} 2s infinite ease-in-out`,
                    animationDelay: `${(index * 0.2) % 2}s`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`NFT ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </Box>
              ))}
            </Flex>
            {/* Create a placeholder space to ensure container height is correct */}
            <Box height="160px"></Box>
          </Box>

          <Text
            fontSize="xl"
            fontWeight="bold"
            color="white"
            textAlign="center"
            fontFamily="var(--font-jersey)"
          >
            Join now, build your own AI, and crush GPT forever!"
          </Text>
        </Container>
      </Box>

      {/* Bottom Wave */}
      <Box
        position="absolute"
        bottom="-50px"
        left={0}
        right={0}
        height="80px"
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
              id="nftBottomWaveGradient"
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
            fill="url(#nftBottomWaveGradient)"
            stroke="#0a192f"
            strokeWidth="2"
          ></path>
        </svg>
      </Box>
    </Box>
  );
}
