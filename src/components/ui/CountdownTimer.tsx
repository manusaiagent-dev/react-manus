"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

/**
 * Countdown Timer Component
 * Displays the remaining time until a target date
 */
export default function CountdownTimer() {
  const [days, setDays] = useState("XX");
  const [hours, setHours] = useState("XX");
  const [minutes, setMinutes] = useState("XX");
  const [seconds, setSeconds] = useState("XX");

  // Calculate the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = target.getTime() - now.getTime();

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setDays(String(d).padStart(2, "0"));
      setHours(String(h).padStart(2, "0"));
      setMinutes(String(m).padStart(2, "0"));
      setSeconds(String(s).padStart(2, "0"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      justify="space-between"
      mb={4}
      flexDirection="row"
      flexWrap="nowrap"
      width="100%"
      overflow="auto"
    >
      {/* Days */}
      <Box mx={1}>
        <Box
          bg="gray.700"
          p={{ base: 2, md: 3 }}
          borderRadius="md"
          minW={{ base: "50px", md: "60px" }}
          textAlign="center"
          mb={2}
        >
          {days}
        </Box>
        <Text fontSize="xs" textAlign="center">
          Days
        </Text>
      </Box>

      {/* Hours */}
      <Box mx={1}>
        <Box
          bg="gray.700"
          p={{ base: 2, md: 3 }}
          borderRadius="md"
          minW={{ base: "50px", md: "60px" }}
          textAlign="center"
          mb={2}
        >
          {hours}
        </Box>
        <Text fontSize="xs" textAlign="center">
          Hours
        </Text>
      </Box>

      {/* Minutes */}
      <Box mx={1}>
        <Box
          bg="gray.700"
          p={{ base: 2, md: 3 }}
          borderRadius="md"
          minW={{ base: "50px", md: "60px" }}
          textAlign="center"
          mb={2}
        >
          {minutes}
        </Box>
        <Text fontSize="xs" textAlign="center">
          Minutes
        </Text>
      </Box>

      {/* Seconds */}
      <Box mx={1}>
        <Box
          bg="gray.700"
          p={{ base: 2, md: 3 }}
          borderRadius="md"
          minW={{ base: "50px", md: "60px" }}
          textAlign="center"
          mb={2}
        >
          {seconds}
        </Box>
        <Text fontSize="xs" textAlign="center">
          Seconds
        </Text>
      </Box>
    </Flex>
  );
}
