"use client";

import { Box } from "@chakra-ui/react";

/**
 * Progress Bar Component
 * Displays a progress bar showing the completion percentage
 * @param {number} value - Progress value (0-100)
 */
export default function ProgressBar({ value }: { value: number }) {
  return (
    <Box h="8px" bg="gray.700" borderRadius="full" overflow="hidden">
      <Box h="100%" w={`${value}%`} bg="blue.500" />
    </Box>
  );
}
