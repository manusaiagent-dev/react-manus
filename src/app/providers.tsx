"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#0a0a1a",
        color: "white",
        fontSize: "large",
      },
      p: {
        fontSize: "large",
      },
      span: {
        fontSize: "large",
      },
      div: {
        fontSize: "large",
      },
    },
  },

  fonts: {
    heading: "var(--font-jersey)",
    body: "var(--font-jersey)",
  },

  fontSizes: {
    xs: "14px",
    sm: "16px",
    md: "18px",
    lg: "20px",
    xl: "22px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "64px",
  },

  components: {
    Text: {
      baseStyle: {
        fontSize: "lg",
        fontFamily: "var(--font-jersey)",
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "var(--font-jersey)",
      },
    },
    Button: {
      baseStyle: {
        fontSize: "lg",
        fontFamily: "var(--font-jersey)",
      },
    },
  },

  colors: {
    brand: {
      100: "#f7fafc",
      500: "#2C5282",
      900: "#1a202c",
    },
  },
});

/**
 * Chakra UI Provider Component
 * Provides theme and style support for the entire application
 * @param {React.ReactNode} children - Child components
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
