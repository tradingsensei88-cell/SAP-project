import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CourseGrid from "@/components/landing/CourseGrid";
import CategoriesSection from "@/components/landing/CategoriesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-white selection:bg-[var(--wonder-green)] selection:text-black">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CourseGrid />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
