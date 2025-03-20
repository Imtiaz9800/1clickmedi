
import React from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedSection from "@/components/FeaturedSection";
import CTASection from "@/components/home/CTASection";

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Categories Section */}
      <CategoryCards />

      {/* Featured Section */}
      <FeaturedSection />

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
