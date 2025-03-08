"use client";

import {
  Flex,
  Heading,
  HStack,
  Button,
  Link,
  Box,
  IconButton,
  useDisclosure,
  VStack,
  Collapse,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppContext } from "../../stores/context";
import WalletConnector from "./walletConnector";
interface IconProps {
  w?: number;
  h?: number;
  [key: string]: any;
}

const HamburgerIcon = ({ w, h, ...rest }: IconProps) => (
  <svg
    width={w ? `${w}px` : "24px"}
    height={h ? `${h}px` : "24px"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ w, h, ...rest }: IconProps) => (
  <svg
    width={w ? `${w}px` : "24px"}
    height={h ? `${h}px` : "24px"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Navbar Component
 * Displays the top navigation menu and connect wallet button
 */
const Navbar = () => {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { walletAddress, currentNetwork, setWalletAddress, setCurrentNetwork } =
    useAppContext();

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动进度，最大为 1
      const scrollY = window.scrollY;
      const scrollThreshold = 200; // 滚动200px后达到完全不透明
      const progress = Math.min(scrollY / scrollThreshold, 1);

      setScrollProgress(progress);
      setScrolled(scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 计算背景色的透明度
  const bgOpacity = 0.2 + scrollProgress * 0.8; // 从 0.2 到 1.0
  const navbarBg = `rgba(40, 44, 78, ${bgOpacity})`;
  const boxShadowOpacity = scrollProgress * 0.3; // 从 0 到 0.3
  const navbarShadow = scrolled
    ? `0 2px 10px rgba(0, 0, 0, ${boxShadowOpacity})`
    : "none";

  return (
    <Box position="fixed" width="100%" zIndex={1000}>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.75rem 1.5rem"
        bg={navbarBg}
        color="white"
        transition="all 0.3s ease"
        boxShadow={navbarShadow}
        backdropFilter={scrolled ? `blur(${scrollProgress * 8}px)` : "none"}
        borderBottom={
          scrolled
            ? `1px solid rgba(255, 255, 255, ${scrollProgress * 0.1})`
            : "none"
        }
      >
        {/* Website Logo */}
        <Flex align="center">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Flex align="center">
              <Image
                src="/images/Manusicon.png"
                alt="Manus Logo"
                height="40px"
                mr={2}
              />
              <Heading
                as="h1"
                size="lg"
                letterSpacing="tight"
                fontWeight="bold"
                color="white"
                fontFamily="var(--font-jersey)"
              >
                Manus
              </Heading>
            </Flex>
          </Link>
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
          }
          variant="ghost"
          aria-label="Toggle Navigation"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
        />

        {/* Desktop Navigation Links */}
        <HStack
          spacing={8}
          display={{ base: "none", md: "flex" }}
          mr="auto"
          ml={8}
        >
          <Link
            href="#about"
            fontWeight="medium"
            color="white"
            fontFamily="var(--font-jersey)"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
          >
            Who is Manus?
          </Link>
          <Link
            href="#gameplay"
            fontWeight="medium"
            color="white"
            fontFamily="var(--font-jersey)"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
          >
            How To Use Bridge
          </Link>
          <Link
            href="#token-detail"
            fontWeight="medium"
            color="white"
            fontFamily="var(--font-jersey)"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
          >
            Tokenomics
          </Link>
          <Link
            href="#roadmap"
            fontWeight="medium"
            color="white"
            fontFamily="var(--font-jersey)"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
          >
            Roadmap
          </Link>
          <Link
            href="#faq"
            fontWeight="medium"
            color="white"
            fontFamily="var(--font-jersey)"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
          >
            FAQ
          </Link>
        </HStack>

        {/* Social Media Icons */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }} mr={4}>
          <Link href="https://twitter.com/manus" isExternal>
            <Box
              bg="black"
              borderRadius="full"
              p={2}
              _hover={{ transform: "translateY(-2px)" }}
              transition="all 0.3s ease"
            >
              <Image
                src="/images/xicon.png"
                alt="Twitter/X"
                height="30px"
                width="30px"
              />
            </Box>
          </Link>
          <Link href="https://t.me/manus" isExternal>
            <Box
              bg="#31a8db"
              borderRadius="full"
              p={2}
              _hover={{ transform: "translateY(-2px)" }}
              transition="all 0.3s ease"
            >
              <Image
                src="/images/ticon.png"
                alt="Telegram"
                height="25px"
                width="25px"
              />
            </Box>
          </Link>
        </HStack>
        <WalletConnector />

        {/* Mobile Menu */}
        <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
          <Box
            display={{ md: "none" }}
            mt={4}
            bg="rgba(40, 44, 78, 0.95)"
            p={4}
            borderRadius="md"
            border="1px solid rgba(255,255,255,0.1)"
            backdropFilter="blur(10px)"
            maxH="80vh"
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              <Link
                href="#about"
                p={2}
                fontFamily="var(--font-jersey)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                }}
                borderRadius="md"
              >
                Who is Manus?
              </Link>
              <Link
                href="#gameplay"
                p={2}
                fontFamily="var(--font-jersey)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                }}
                borderRadius="md"
              >
                How To Use Bridge
              </Link>
              <Link
                href="#token-detail"
                p={2}
                fontFamily="var(--font-jersey)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                }}
                borderRadius="md"
              >
                Tokenomics
              </Link>
              <Link
                href="#roadmap"
                p={2}
                fontFamily="var(--font-jersey)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                }}
                borderRadius="md"
              >
                Roadmap
              </Link>
              <Link
                href="#faq"
                p={2}
                fontFamily="var(--font-jersey)"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                }}
                borderRadius="md"
              >
                FAQ
              </Link>

              {/* Social Media Icons - Mobile */}
              <HStack spacing={4} pt={2} pb={2} justifyContent="center">
                <Link href="https://twitter.com/manus" isExternal>
                  <Box
                    bg="black"
                    borderRadius="full"
                    p={2}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                  >
                    <Image
                      src="/images/xicon.png"
                      alt="Twitter/X"
                      height="20px"
                      width="20px"
                    />
                  </Box>
                </Link>
                <Link href="https://t.me/manus" isExternal>
                  <Box
                    bg="#31a8db"
                    borderRadius="full"
                    p={2}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                  >
                    <Image
                      src="/images/ticon.png"
                      alt="Telegram"
                      height="20px"
                      width="20px"
                    />
                  </Box>
                </Link>
              </HStack>

              <Box pt={2}>
                <WalletConnector isMobile={true} />
              </Box>
            </VStack>
          </Box>
        </Collapse>
      </Flex>
    </Box>
  );
};
export default Navbar;
