"use client";

import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import TokenomicsSection from "@/components/home/TokenomicsSection";
import GameplaySection from "@/components/home/GameplaySection";
import TokenDetailSection from "@/components/home/TokenDetailSection";
import RoadmapSection from "@/components/home/RoadmapSection";
import NftShowcaseSection from "@/components/home/NftShowcaseSection";
/**
 * Main page component
 * Uses a component-based structure to organize page content
 */
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <TokenomicsSection />
      <GameplaySection />
      <TokenDetailSection />
      <RoadmapSection />
      <NftShowcaseSection />
    </Layout>
  );
}
