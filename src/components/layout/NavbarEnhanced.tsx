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
  keyframes,
  Text,
  Switch
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppContext } from "../../stores/context";
import WalletConnector from "./walletConnector";
interface IconProps {
  w?: number;
  h?: number;
  [key: string]: any;
}

// 定义动画关键帧
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); }
`;

const slideInFromTop = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

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
const NavbarEnhanced = () => {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const { isTestnet, setIsTestnet } =
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

      // 检测当前活动的部分
      const sections = [
        "about",
        "gameplay",
        "token-detail",
        "roadmap",
        "disclaimer",
      ];

      // 首先检查是否滚动到页面底部，如果是，则激活最后一个部分（disclaimer）
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (isAtBottom) {
        setActiveSection("disclaimer");
      } else {
        // 否则，使用常规的部分检测逻辑
        let foundActiveSection = false;
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // 修改检测条件，使其更宽松
            if (rect.top <= 150 && rect.bottom >= 50) {
              setActiveSection(section);
              foundActiveSection = true;
              break;
            }
          }
        }

        // 如果没有找到活动部分，并且滚动位置接近页面底部，则激活disclaimer
        if (
          !foundActiveSection &&
          window.scrollY > document.body.offsetHeight - window.innerHeight - 300
        ) {
          setActiveSection("disclaimer");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 计算背景色的透明度
  const bgOpacity = 0.2 + scrollProgress * 0.8; // 从 0.2 到 1.0
  const navbarBg = `linear-gradient(90deg, rgba(40, 44, 78, ${bgOpacity}) 0%, rgba(60, 64, 98, ${bgOpacity}) 50%, rgba(40, 44, 78, ${bgOpacity}) 100%)`;
  const boxShadowOpacity = scrollProgress * 0.3; // 从 0 到 0.3
  const navbarShadow = scrolled
    ? `0 2px 15px rgba(0, 150, 255, ${boxShadowOpacity})`
    : "none";

   // 添加测试网络切换菜单项
   const TestnetSwitchItem = () => (
      <Flex align={'center'}>
        <Text mr={2}>Testnet Mode</Text>
        <Switch
          isChecked={isTestnet}
          onChange={(e) => setIsTestnet(e.target.checked)}
          colorScheme="purple"
        />
      </Flex>
  );
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
            ? `1px solid rgba(100, 200, 255, ${scrollProgress * 0.2})`
            : "none"
        }
        animation={scrolled ? `${glowAnimation} 3s infinite` : "none"}
      >
        {/* Website Logo */}
        <Flex align="center">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Flex
              align="center"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src="/images/Manusicon.png"
                alt="Manus Logo"
                height="40px"
                mr={2}
                animation={`${pulseAnimation} 5s infinite ease-in-out`}
              />
              <Heading
                as="h1"
                size="lg"
                letterSpacing="tight"
                fontWeight="bold"
                color="white"
                fontFamily="var(--font-jersey)"
                bgGradient="linear(to-r, white, cyan.300, white)"
                bgClip="text"
                transition="all 0.3s ease"
                _hover={{
                  bgGradient: "linear(to-r, cyan.300, purple.300, cyan.300)",
                  letterSpacing: "1px",
                }}
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
            isOpen ? (
              <CloseIcon w={30} h={30} />
            ) : (
              <HamburgerIcon w={30} h={30} />
            )
          }
          variant="ghost"
          aria-label="Toggle Navigation"
          color={"white"}
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          transition="all 0.3s ease"
          transform={isOpen ? "rotate(90deg)" : "rotate(0deg)"}
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
            color={activeSection === "about" ? "cyan.300" : "white"}
            fontFamily="var(--font-jersey)"
            position="relative"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                width: activeSection === "about" ? "100%" : "0%",
                height: "2px",
                bottom: "-4px",
                left: "0",
                backgroundColor: "cyan.300",
                transition: "all 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            Who is Manus?
          </Link>
          <Link
            href="#gameplay"
            fontWeight="medium"
            color={activeSection === "gameplay" ? "cyan.300" : "white"}
            fontFamily="var(--font-jersey)"
            position="relative"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                width: activeSection === "gameplay" ? "100%" : "0%",
                height: "2px",
                bottom: "-4px",
                left: "0",
                backgroundColor: "cyan.300",
                transition: "all 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            How To Play
          </Link>
          <Link
            href="#token-detail"
            fontWeight="medium"
            color={activeSection === "token-detail" ? "cyan.300" : "white"}
            fontFamily="var(--font-jersey)"
            position="relative"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                width: activeSection === "token-detail" ? "100%" : "0%",
                height: "2px",
                bottom: "-4px",
                left: "0",
                backgroundColor: "cyan.300",
                transition: "all 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            Tokenomics
          </Link>
          <Link
            href="#roadmap"
            fontWeight="medium"
            color={activeSection === "roadmap" ? "cyan.300" : "white"}
            fontFamily="var(--font-jersey)"
            position="relative"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                width: activeSection === "roadmap" ? "100%" : "0%",
                height: "2px",
                bottom: "-4px",
                left: "0",
                backgroundColor: "cyan.300",
                transition: "all 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            Roadmap
          </Link>
          <Link
            href="#disclaimer"
            fontWeight="medium"
            color={activeSection === "disclaimer" ? "cyan.300" : "white"}
            fontFamily="var(--font-jersey)"
            position="relative"
            _hover={{
              textDecoration: "none",
              color: "cyan.300",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                width: activeSection === "disclaimer" ? "100%" : "0%",
                height: "2px",
                bottom: "-4px",
                left: "0",
                backgroundColor: "cyan.300",
                transition: "all 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            Disclaimer
          </Link>
        </HStack>

        {/* Social Media Icons */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }} mr={4}>
          <Link href="https://x.com/ManusToken" isExternal>
            <Box
              bg="black"
              borderRadius="full"
              p={2}
              _hover={{
                transform: "translateY(-5px) rotate(15deg)",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
              }}
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
          <Link href="https://t.me/manustoken" isExternal>
            <Box
              bg="#31a8db"
              borderRadius="full"
              p={2}
              _hover={{
                transform: "translateY(-5px) rotate(-15deg)",
                boxShadow: "0 0 15px rgba(49, 168, 219, 0.7)",
              }}
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
          {/* <TestnetSwitchItem /> */}
          <WalletConnector />
        </HStack>

        {/* Mobile Menu */}
        <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
          <Box
            display={{ md: "none" }}
            mt={4}
            bg="linear-gradient(135deg, rgba(40, 44, 78, 0.95) 0%, rgba(60, 64, 98, 0.95) 100%)"
            p={4}
            borderRadius="md"
            border="1px solid rgba(100, 200, 255, 0.2)"
            backdropFilter="blur(10px)"
            maxH="80vh"
            overflowY="auto"
            boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.5)"
            animation={`${slideInFromTop} 0.3s ease-out forwards`}
          >
            <VStack spacing={4} align="stretch">
              <Link
                href="#about"
                p={2}
                fontFamily="var(--font-jersey)"
                color={activeSection === "about" ? "cyan.300" : "white"}
                borderLeft={
                  activeSection === "about" ? "3px solid" : "0px solid"
                }
                borderColor="cyan.300"
                paddingLeft={activeSection === "about" ? "10px" : "2px"}
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                  paddingLeft: "10px",
                  borderLeft: "3px solid",
                  borderColor: "cyan.300",
                }}
                borderRadius="md"
              >
                Who is Manus?
              </Link>
              <Link
                href="#gameplay"
                p={2}
                fontFamily="var(--font-jersey)"
                color={activeSection === "gameplay" ? "cyan.300" : "white"}
                borderLeft={
                  activeSection === "gameplay" ? "3px solid" : "0px solid"
                }
                borderColor="cyan.300"
                paddingLeft={activeSection === "gameplay" ? "10px" : "2px"}
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                  paddingLeft: "10px",
                  borderLeft: "3px solid",
                  borderColor: "cyan.300",
                }}
                borderRadius="md"
              >
                How To Play
              </Link>
              <Link
                href="#token-detail"
                p={2}
                fontFamily="var(--font-jersey)"
                color={activeSection === "token-detail" ? "cyan.300" : "white"}
                borderLeft={
                  activeSection === "token-detail" ? "3px solid" : "0px solid"
                }
                borderColor="cyan.300"
                paddingLeft={activeSection === "token-detail" ? "10px" : "2px"}
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                  paddingLeft: "10px",
                  borderLeft: "3px solid",
                  borderColor: "cyan.300",
                }}
                borderRadius="md"
              >
                Tokenomics
              </Link>
              <Link
                href="#roadmap"
                p={2}
                fontFamily="var(--font-jersey)"
                color={activeSection === "roadmap" ? "cyan.300" : "white"}
                borderLeft={
                  activeSection === "roadmap" ? "3px solid" : "0px solid"
                }
                borderColor="cyan.300"
                paddingLeft={activeSection === "roadmap" ? "10px" : "2px"}
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                  paddingLeft: "10px",
                  borderLeft: "3px solid",
                  borderColor: "cyan.300",
                }}
                borderRadius="md"
              >
                Roadmap
              </Link>
              <Link
                href="#disclaimer"
                p={2}
                fontFamily="var(--font-jersey)"
                color={activeSection === "disclaimer" ? "cyan.300" : "white"}
                borderLeft={
                  activeSection === "disclaimer" ? "3px solid" : "0px solid"
                }
                borderColor="cyan.300"
                paddingLeft={activeSection === "disclaimer" ? "10px" : "2px"}
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.1)",
                  color: "cyan.300",
                  textDecoration: "none",
                  paddingLeft: "10px",
                  borderLeft: "3px solid",
                  borderColor: "cyan.300",
                }}
                borderRadius="md"
              >
                Disclaimer
              </Link>

              {/* Social Media Icons - Mobile */}
              <HStack spacing={4} pt={2} pb={2} justifyContent="center">
                <Link href="https://x.com/ManusToken" isExternal>
                  <Box
                    bg="black"
                    borderRadius="full"
                    p={2}
                    _hover={{
                      transform: "translateY(-5px) rotate(15deg)",
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                    }}
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
                <Link href="https://t.me/manustoken" isExternal>
                  <Box
                    bg="#31a8db"
                    borderRadius="full"
                    p={2}
                    _hover={{
                      transform: "translateY(-5px) rotate(-15deg)",
                      boxShadow: "0 0 15px rgba(49, 168, 219, 0.7)",
                    }}
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
              <Flex justify='center'>
              <TestnetSwitchItem />

              </Flex>

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
export default NavbarEnhanced;
