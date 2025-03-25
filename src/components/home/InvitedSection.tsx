"use client";
import {
  Box,
  Grid,
  Text,
  Button,
  Flex,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ScrollAnimation from "../ui/ScrollAnimation";
import { useAppContext } from "../../stores/context";

/**
 * Part of the main visual (Hero) component
 * Display the main title, subtitle, and call-to-action of the website
 */
export default function InvitedSection() {
  const { walletAddress } = useAppContext();
  const toast = useToast();

  const [invitedCount, setSharedCount] = useState(0);
  const [earnedAmount, setRewardEarned] = useState(0);
  const [inviteLink, setInviteLink] = useState(""); // 示例邀请链接
  useEffect(() => {
    setInviteLink(
      `https://manusmanusmanusmanusmanusmanusmanus.ai/?referral=${walletAddress}`
    );
  }, [walletAddress]);
  // 添加分享功能函数
  const handleShare = () => {
    const shareText = `Join the AI revolution with $MANUS! ${inviteLink}`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Success",
        description: "Copied to clipboard!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        status: "error",
        duration: 3000,
      });
    }
  };

  return walletAddress ? (
    <>
      <Flex mb={3} gap={3} direction={{ base: "column", md: "row" }}>
        <Flex
          border="1px solid"
          //   borderColor="#FFFDFD"
          borderColor="whiteAlpha.300" // 浅色细边框
          borderRadius="8px"
          px={3}
          bg="blackAlpha.600"
          backdropFilter="blur(10px)"
          alignItems="center"
          justify="space-between"
          position="relative"
          width={{ base: "100%", md: "460px" }}
          height="56px"
          minHeight="fit-content"
          gap={3}
        >
          <Text
            color="#FFFDFD"
            fontSize="md"
            overflow="hidden"
            textOverflow="ellipsis"
            cursor="pointer"
            lineHeight="1.2" // 控制行高
            display="flex"
            alignItems="center" // 垂直居中
            _hover={{
              textDecoration: "underline",
              textShadow: "0 0 8px rgba(0,255,255,0.4)",
            }}
            onClick={copyToClipboard}
          >
            {inviteLink}
          </Text>
          <Image
            src="/images/copyIcon.svg"
            alt=""
            width="21px"
            height="21px"
            objectFit="contain"
            cursor={"pointer"}
            onClick={copyToClipboard}
          />
        </Flex>
        <Button
          bgGradient="linear(to-r, purple.500, pink.500)"
          color="white"
          height="56px"
          _hover={{
            bgGradient: "linear(to-r, purple.600, pink.600)",
            boxShadow: "xl",
          }}
          _active={{
            transform: "translateY(1px)",
          }}
          fontSize={{ base: "md", md: "lg" }}
          transition="all 0.3s ease"
          fontFamily="var(--font-jersey)"
          minHeight="fit-content"
          onClick={handleShare}
        >
          Share on X
        </Button>
      </Flex>
      <Flex
        width={{ base: "100%", md: "588px" }}
        border="1px solid"
        borderColor="gray.700"
        borderRadius="md"
        overflow="hidden"
        bg="blackAlpha.500"
      >
        <Box
          flex={1}
          p={3}
          textAlign="center"
          borderRight="1px solid"
          borderColor="gray.700"
        >
          <Text fontSize={{ base: "md", md: "lg" }} color="white" mb={1}>
            Invited
          </Text>
          <Text fontSize="lg" color="white">
            {invitedCount}
          </Text>
        </Box>

        <Box flex={1} p={3} textAlign="center">
          <Text fontSize={{ base: "md", md: "lg" }} color="white" mb={1}>
            Earned
          </Text>
          <Text fontSize="lg" color="white">
            {earnedAmount} $MANUS
          </Text>
        </Box>
      </Flex>
    </>
  ) : (
    <Button
      bgGradient="linear(to-r, purple.500, pink.500)"
      color="white"
      height={{ base: "56px", md: "56px" }} // 显式设置高度
      _hover={{
        bgGradient: "linear(to-r, purple.600, pink.600)",
        boxShadow: "xl",
      }}
      _active={{
        transform: "translateY(1px)",
      }}
      fontSize={{ base: "md", md: "lg" }}
      transition="all 0.3s ease"
      fontFamily="var(--font-jersey)"
      minHeight="fit-content"
      onClick={() => {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }}
    >
      10% trading fee rebate for referrals
    </Button>
  );
}
