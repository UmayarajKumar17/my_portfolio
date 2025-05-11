import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Chatbot2 from "@/components/Chatbot2";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotKey, setChatbotKey] = useState(`chatbot-${Date.now()}`);

  useEffect(() => {
    // Simulate loading time for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Generate a unique key for the chatbot component on each page load
    setChatbotKey(`chatbot-${Date.now()}`);

    // Add smooth scrolling behavior
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href') as string;
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Prevent fixed navigation overlapping with section anchors when navigating
    const fixScrollPosition = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const navHeight = 64; // Approximate height of navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };
    
    window.addEventListener('hashchange', fixScrollPosition);
    
    // Check for hash on page load
    if (window.location.hash) {
      fixScrollPosition();
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', fixScrollPosition);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
        <Footer />
        <Chatbot2 key={chatbotKey} />
      </main>
    </TooltipProvider>
  );
};

export default Index;
