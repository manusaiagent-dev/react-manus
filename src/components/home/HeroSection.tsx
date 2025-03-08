"use client";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CountdownTimer from "../ui/CountdownTimer";
import ProgressBar from "../ui/ProgressBar";
import TokenSale from "./TokenSale";

/**
 * Part of the main visual (Hero) component
 * Display the main title, subtitle, and call-to-action of the website
 */
export default function HeroSection() {
  const [progress, setProgress] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Simulate progress growth
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(85, prev + 0.1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      backgroundImage="url('/images/hero-home.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment={{ base: "scroll", md: "fixed" }}
      position="relative"
      minHeight={{ base: "auto", md: "100vh" }}
      paddingTop={{ base: "100px", md: "80px" }}
      paddingBottom={{ base: "50px", md: "0" }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "linear-gradient(to bottom, rgba(0, 0, 20, 0.66), rgba(0,0,20,0.5))",
        zIndex: 1,
      }}
    >
      {/* Background Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 20, 0)"
        backdropFilter="blur(0px)"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{ base: 6, md: 10 }}
          minH={{ base: "auto", md: "90vh" }}
          alignItems="center"
        >
          {/* Left Content Area */}
          <GridItem>
            <Box>
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, cyan.400, blue.500)"
                bgClip="text"
                mb={4}
                fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
                lineHeight="1.2"
                textShadow="0 0 20px rgba(0,0,0,0.5)"
                fontFamily="var(--font-jersey)"
                color={"white"}
                width={{ base: "100%", md: "970px" }}
              >
                Manus Rises. GPT Falls
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="bold"
                mb={4}
                textShadow="0 0 10px rgba(0,0,0,0.5)"
                fontFamily="var(--font-jersey)"
              >
                Crushing Big Models, Redefining Intelligence!
              </Text>
              <Text
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                color="gray.300"
                mb={6}
                maxW="600px"
                lineHeight="1.8"
                fontFamily="var(--font-jersey)"
              >
                In the AI era, who will dominate? The community-driven
                intelligent entity Manus awakens to challenge the centralized AI
                giant GPT.
              </Text>

              <Button
                size={{ base: "md", md: "lg" }}
                bgGradient="linear(to-r, purple.500, pink.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                mb={2}
                px={{ base: 6, md: 8 }}
                py={{ base: 5, md: 6 }}
                fontSize={{ base: "md", md: "lg" }}
                transition="all 0.3s ease"
                fontFamily="var(--font-jersey)"
              >
                Join Now
              </Button>
              <Text
                fontSize="sm"
                color="gray.400"
                mt={2}
                fontWeight="medium"
                width={"130px"}
                fontFamily="var(--font-jersey)"
              >
                Join the Revolution Fair Launch
              </Text>
            </Box>
          </GridItem>

          {/* Right Token Sale Area */}
          <GridItem
            position={{ base: "static", md: "absolute" }}
            right={0}
            mt={{ base: 8, md: 0 }}
          >
            <Text
              fontSize={{ base: "24px", md: "36px" }}
              fontFamily="var(--font-jersey)"
              textAlign={"center"}
              color="white"
              fontWeight="bold"
              mb={2}
            >
              Buy $ManusCoin tokens now:
            </Text>
            <TokenSale />
            <Box
              display="none"
              bg="rgba(0,0,30,0.6)"
              p={8}
              borderRadius="2xl"
              boxShadow="2xl"
              border="1px solid rgba(100,100,255,0.2)"
              backdropFilter="blur(10px)"
              transform={{ base: "none", md: "translateY(-20px)" }}
              _hover={{
                transform: { base: "none", md: "translateY(-25px)" },
                boxShadow: "2xl",
              }}
              transition="all 0.3s ease"
            >
              <Box mb={6}>
                <Heading
                  size="lg"
                  mb={4}
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                  fontFamily="var(--font-jersey)"
                >
                  Buy $ManusCoin tokens now:
                </Heading>
                <Text mb={4} color="gray.300" fontFamily="var(--font-jersey)">
                  Token price increase in:
                </Text>
              </Box>

              {/* Countdown Component */}
              <CountdownTimer />

              {/* Progress Bar */}
              <Box w="100%" mb={9}>
                <Text
                  mb={2}
                  fontSize="sm"
                  color="gray.400"
                  fontFamily="var(--font-jersey)"
                >
                  ETH/BNB/SOL raised:$0.00/$0.00
                </Text>
                <ProgressBar value={progress} />
                <Text
                  mt={2}
                  fontSize="sm"
                  textAlign="right"
                  color="gray.400"
                  fontFamily="var(--font-jersey)"
                >
                  {progress.toFixed(1)}%
                </Text>
              </Box>

              <Flex
                w="100%"
                justify="space-between"
                mb={6}
                paddingLeft={{ base: "0", md: "200px" }}
              >
                <Text color="gray.300" fontFamily="var(--font-jersey)">
                  1 $MANUS=$0
                </Text>
                {/* <Text color="gray.300">Min: 0.01 ETH</Text> */}
              </Flex>

              <Text
                fontSize="sm"
                mb={4}
                color="gray.400"
                fontFamily="var(--font-jersey)"
              >
                Connect your wallet:
              </Text>

              <Button
                fontFamily="var(--font-jersey)"
                w="100%"
                colorScheme="blue"
                size="lg"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s ease"
              >
                Buy $ManusCoin tokens now:
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
