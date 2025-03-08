import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// 加载本地字体
const jerseyFont = localFont({
  src: "../../public/fonts/Jersey15-Regular.ttf",
  variable: "--font-jersey",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manus - Stepping on a large model, reinventing intelligence！",
  description:
    "In the era of AI, who is in charge of ups and downs? Manus, a community-driven intelligent lifeform, awakens to fight against the centralized AI behemoth GPT。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jerseyFont.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
