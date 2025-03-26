"use client";
import { Box, Text, Button, Flex, Image, useToast } from "@chakra-ui/react";
import { useState, useMemo, useCallback } from "react";
import { useAppContext } from "../../stores/context";
import { useRequest } from "ahooks";
import { queryInvite } from "@/services";

export default function InvitedSection() {
  const { walletAddress } = useAppContext();
  const toast = useToast();

  const [invitedCount, setSharedCount] = useState(0);
  const [earnedAmount, setRewardEarned] = useState(0);
  const requestDeps = useMemo(() => [walletAddress], [walletAddress]);

  useRequest(() => queryInvite({ address: walletAddress }), {
    ready: !!walletAddress,
    refreshDeps: requestDeps,
    onSuccess: (res) => {
      setSharedCount(res?.TotalUserInvited || 0);
      setRewardEarned(Math.floor(res?.TotalManusReward || 0));
    },
  });
  const memoizedInviteLink = useMemo(() => {
    return `https://www.openmanus.xyz/?referral=${walletAddress}`;
  }, [walletAddress]);

  // 添加分享功能函数
  const handleShare = useCallback(() => {
    try {
      //检查文档是否获得焦点
      if (!document.hasFocus()) {
        throw new Error("Please activate the browser tab first");
      }
      const shareText = `Join the AI revolution with $MANUS! ${memoizedInviteLink}`;
      const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, "_blank");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [memoizedInviteLink]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(memoizedInviteLink);
    toast({
      title: "Success",
      description: "Copied to clipboard!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }, [memoizedInviteLink, toast]);

  return walletAddress ? (
    <>
      <Flex mb={3} gap={3} direction={{ base: "column", md: "row" }}>
        <Flex
          border="1px solid"
          bg="linear-gradient(91deg, rgba(255, 255, 255, 0.15) 0.96%, rgba(255, 255, 255, 0.15) 98.77%)"
          borderColor="rgba(255, 255, 255, 0.50)" // 浅色细边框
          borderRadius="8px"
          px={3}
          backdropFilter="blur(7.5px)"
          alignItems="center"
          justify="space-between"
          position="relative"
          width={{ base: "100%", md: "460px" }}
          height="56px"
          minHeight="fit-content"
          gap={3}
        >
          <Text
            color="rgba(255, 255, 255, 0.80)"
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
            {memoizedInviteLink}
          </Text>
          <Image src="/images/copyIcon.svg" alt="" width="21px" height="21px" objectFit="contain" cursor={"pointer"} onClick={copyToClipboard} />
        </Flex>
        <Button
          bgGradient="linear-gradient(102deg, #14A5ED 3.12%, #7F64FB 35.28%, #F33265 74.36%, #FF766C 102.07%)"
          color="white"
          height="56px"
          _hover={{
            // bgGradient: "linear(to-r, purple.600, pink.600)",
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
      <Flex width={{ base: "100%", md: "588px" }} backdropFilter={'blur(7.5px)'} border="1px solid" borderColor="rgba(255, 255, 255, 0.50)" borderRadius="md" overflow="hidden" bg="linear-gradient(91deg, rgba(255, 255, 255, 0.15) 0.96%, rgba(255, 255, 255, 0.15) 98.77%)">
        <Box flex={1} p={3} textAlign="center" borderRight="1px solid" borderColor="rgba(255, 255, 255, 0.50)">
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
