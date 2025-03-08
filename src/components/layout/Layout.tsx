"use client";

import { Box } from "@chakra-ui/react";
import NavbarEnhanced from "./NavbarEnhanced";
import Footer from "./Footer";
import { AppProvider } from "../../stores/context";

/**
 * Main Layout Component
 * Contains the navbar and footer, wrapping all page content
 * @param {React.ReactNode} children - Child components
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Box>
        <NavbarEnhanced />
        <Box as="main">{children}</Box>
        <Footer />
      </Box>
    </AppProvider>
  );
}
