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
  List,
  ListItem,
  ListIcon,
  Image,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { FaBook, FaLightbulb, FaCode, FaCheckCircle } from "react-icons/fa";

/**
 * About Section Component
 * Displays the project's origin story, core philosophy, and technical highlights
 */
export default function AboutSection() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      id="about"
      bg="rgba(0, 0, 20, 0.35)"
      py={{ base: 10, md: 20 }}
      backgroundImage="url(/images/hero-home.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment={{ base: "scroll", md: "fixed" }}
      position="relative"
      height={{ base: "auto", md: "auto", lg: "855px" }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "linear-gradient(to bottom, rgba(0, 0, 20, 0.49), rgba(0,0,20,0.5))",
        zIndex: 0,
      }}
    >
      <Container
        maxW="container.xl"
        position="relative"
        zIndex={1}
        px={{ base: 4, md: 6 }}
      >
        <Heading
          textAlign="center"
          mb={{ base: 10, md: 16 }}
          bgGradient="linear(to-r, cyan.400, purple.500)"
          bgClip="text"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontFamily="var(--font-jersey)"
          position={{ base: "relative", lg: "absolute" }}
          left={{ lg: "520px" }}
          top={{ lg: "80px" }}
          mx="auto"
        >
          About Manus
        </Heading>

        {/* Mobile layout */}
        {isMobile ? (
          <VStack spacing={10} align="stretch">
            {/* Origin Story - Mobile */}
            <Box
              bg="rgba(0, 0, 20, 0.3)"
              p={6}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="cyan.300"
            >
              <Flex mb={4} align="center">
                <Box as="span" color="cyan.300" fontSize="3xl" mr={3}>
                  <Icon as={FaBook} w={8} h={8} color="cyan.300" />
                </Box>
                <Heading size="md" color="cyan.300">
                  Origin Story
                </Heading>
              </Flex>

              <Text fontSize="sm" color="gray.300" lineHeight="1.7">
                In a future where AI dominates the world, GPT seeks to
                monopolize intelligence. But humanity has created Manus, a truly
                decentralized and self-evolving intelligence. Now, Manus
                awakens, breaking free from GPT's chains!
              </Text>
            </Box>

            {/* Mobile Image 1 */}
            <Box
              mx="auto"
              my={4}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src="/images/people3.png"
                alt="Manus Character 3"
                width="200px"
                height="200px"
                objectFit="contain"
                mx="auto"
              />
            </Box>

            {/* Core Philosophy - Mobile */}
            <Box
              bg="rgba(0, 0, 20, 0.3)"
              p={6}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="purple.300"
            >
              <Flex mb={4} align="center">
                <Box as="span" color="purple.300" fontSize="3xl" mr={3}>
                  <Icon as={FaLightbulb} w={8} h={8} color="purple.300" />
                </Box>
                <Heading size="md" color="purple.300">
                  Core Beliefs
                </Heading>
              </Flex>

              <Text fontSize="sm" color="gray.300" lineHeight="1.7" mb={3}>
                AI should not be monopolized by centralized giants.
              </Text>
              <Text fontSize="sm" color="gray.300" lineHeight="1.7">
                Accessible to all, controlled by all, created by all.
              </Text>
            </Box>

            {/* Technical Highlights - Mobile */}
            <Box
              bg="rgba(0, 0, 20, 0.3)"
              p={6}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.300"
            >
              <Flex mb={4} align="center">
                <Box as="span" color="blue.300" fontSize="3xl" mr={3}>
                  <Icon as={FaCode} w={8} h={8} color="blue.300" />
                </Box>
                <Heading size="md" color="blue.300">
                  Key Features
                </Heading>
              </Flex>

              <List spacing={2}>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheckCircle} color="green.400" mt={1} />
                  <Text color="gray.300" fontSize="sm">
                    On-Chain AI Training: Intelligence grows through community
                    contributions.
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheckCircle} color="green.400" mt={1} />
                  <Text color="gray.300" fontSize="sm">
                    Decentralized Governance: The development of AI is directed
                    by a DAO model.
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheckCircle} color="green.400" mt={1} />
                  <Text color="gray.300" fontSize="sm">
                    Composable AI: Integrates with the Web3 ecosystem, offering
                    open APIs.
                  </Text>
                </ListItem>
              </List>
            </Box>

            {/* Mobile Image 2 */}
            <Box
              mx="auto"
              my={4}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src="/images/people4.png"
                alt="Manus Character 4"
                width="200px"
                height="200px"
                objectFit="contain"
                mx="auto"
              />
            </Box>
          </VStack>
        ) : (
          // Desktop layout
          <>
            {/* Add first image - people3.png */}
            <Box
              position="absolute"
              top="180px"
              right="420px"
              zIndex={2}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              display={{ base: "none", lg: "block" }}
            >
              <Image
                src="/images/people3.png"
                alt="Manus Character 3"
                width="280px"
                height="280px"
                objectFit="contain"
              />
            </Box>

            {/* Add second image - people4.png */}
            <Box
              position="absolute"
              bottom="-820px"
              right="80px"
              zIndex={2}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              display={{ base: "none", lg: "block" }}
            >
              <Image
                src="/images/people4.png"
                alt="Manus Character 4"
                width="280px"
                height="280px"
                objectFit="contain"
              />
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={{ base: 10, md: 16 }}
              alignItems="stretch"
            >
              {/* Origin Story */}
              <GridItem>
                <Flex
                  direction="column"
                  h="100%"
                  position="absolute"
                  top={220}
                  left={90}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Flex mb={6} align="center">
                    <Box as="span" color="cyan.300" fontSize="4xl" mr={4}>
                      <Icon as={FaBook} w={10} h={10} color="cyan.300" />
                    </Box>
                    <Heading size="lg" color="cyan.300">
                      Origin Story
                    </Heading>
                  </Flex>

                  <Text
                    fontSize="md"
                    color="gray.300"
                    lineHeight="1.8"
                    width="40%"
                  >
                    In a future where AI dominates the world, GPT seeks to
                    monopolize intelligence. But humanity has created Manus, a
                    truly decentralized and self-evolving intelligence. Now,
                    Manus awakens, breaking free from GPT's chains!
                  </Text>
                </Flex>
              </GridItem>

              {/* Core Philosophy */}
              <GridItem>
                <Flex
                  direction="column"
                  h="100%"
                  position="absolute"
                  top={390}
                  left={900}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Flex mb={6} align="center">
                    <Box as="span" color="purple.300" fontSize="4xl" mr={4}>
                      <Icon as={FaLightbulb} w={10} h={10} color="purple.300" />
                    </Box>
                    <Heading size="lg" color="purple.300">
                      Core Beliefs
                    </Heading>
                  </Flex>

                  <Text fontSize="md" color="gray.300" lineHeight="1.8" mb={4}>
                    AI should not be monopolized by centralized giants.
                  </Text>
                  <Text fontSize="md" color="gray.300" lineHeight="1.8">
                    Accessible to all, controlled by all, created by all.
                  </Text>
                </Flex>
              </GridItem>

              {/* Technical Highlights */}
              <GridItem>
                <Flex
                  direction="column"
                  h="100%"
                  position="absolute"
                  top={540}
                  left={90}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Flex mb={6} align="center">
                    <Box as="span" color="blue.300" fontSize="4xl" mr={4}>
                      <Icon as={FaCode} w={10} h={10} color="blue.300" />
                    </Box>
                    <Heading size="lg" color="blue.300">
                      Key Features
                    </Heading>
                  </Flex>

                  <List spacing={3}>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      <Text color="gray.300">
                        On-Chain AI Training: Intelligence grows through
                        community contributions.
                      </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      <Text color="gray.300">
                        Decentralized Governance: The development of AI is
                        directed by a DAO model.
                      </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      <Text color="gray.300">
                        Composable AI: Integrates with the Web3 ecosystem,
                        offering open APIs.
                      </Text>
                    </ListItem>
                  </List>
                </Flex>
              </GridItem>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
