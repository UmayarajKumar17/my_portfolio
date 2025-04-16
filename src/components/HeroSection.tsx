import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Github, Linkedin, Instagram, Code, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0');
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return; // Disable on mobile
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  const scrollToNextSection = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate parallax movement for elements
  const calculateParallaxTransform = (depth: number) => {
    const moveX = (mousePosition.x * 2 - 1) * depth;
    const moveY = (mousePosition.y * 2 - 1) * depth;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center items-center relative pt-16 md:pt-20 pb-16 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-48 md:w-64 h-48 md:h-64 bg-ai-purple/5 rounded-full filter blur-3xl floating"
          style={{ transform: calculateParallaxTransform(20) }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-60 md:w-80 h-60 md:h-80 bg-ai-darkPurple/10 rounded-full filter blur-3xl floating-reverse floating-delay-2" 
          style={{ transform: calculateParallaxTransform(15) }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full bg-white/10 ${i % 2 === 0 ? 'floating' : 'floating-reverse'} ${
                i % 4 === 0 ? 'floating-delay-1' : 
                i % 4 === 1 ? 'floating-delay-2' : 
                i % 4 === 2 ? 'floating-delay-3' : 
                'floating-delay-4'
              }`}
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            ></div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-tech-pattern opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center space-x-2 mb-4 px-3 py-1 bg-white/5 rounded-full border border-ai-purple/30 text-sm hover:bg-white/10 hover:border-ai-purple/50 transition-all cursor-default">
                <Code size={14} className="text-ai-purple pulse-animation" />
                <span className="text-ai-purple font-medium">AI ENGINEER & INNOVATOR</span>
              </div>
            </div>
            
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-gradient leading-tight transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="animated-gradient-text">Umayaraj</span> <br />
              <span className="text-ai-purple hover:text-ai-darkPurple transition-colors duration-300">Kumar</span>
            </h1>
            
            <p className={`text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Crafting intelligent systems at the intersection of artificial intelligence and engineering innovation. I build AI solutions that transform ideas into reality.
            </p>
            
            <div className={`flex flex-wrap justify-center md:justify-start gap-3 md:space-x-4 mt-6 md:mt-8 transition-all duration-1000 delay-900 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href="#contact" 
                onClick={(e) => {e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({behavior: 'smooth'})}}
                className="px-5 py-3 bg-ai-purple text-white rounded-lg font-medium transition-all duration-300 hover:bg-ai-darkPurple hover:scale-105 hover:shadow-lg hover:shadow-ai-purple/20 focus:ring-2 focus:ring-ai-purple focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
              >
                Get in Touch
              </a>
              <a 
                href="#projects" 
                onClick={(e) => {e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({behavior: 'smooth'})}}
                className="px-5 py-3 border border-white/20 hover:border-ai-purple text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-ai-purple/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
              >
                View Projects
              </a>
              <a 
                href={`${import.meta.env.BASE_URL}resume/Umayaraj-Kumar-CV.pdf`}
                download
                className="px-5 py-3 flex items-center gap-2 border border-white/20 hover:border-ai-purple text-white rounded-lg font-medium transition-all duration-300 hover:bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-ai-purple/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background focus:outline-none group"
              >
                <Download size={18} className="group-hover:translate-y-1 transition-transform duration-300" />
                Download CV
              </a>
            </div>
          </div>
          
          <div className={`order-1 md:order-2 flex justify-center items-center transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
               style={{ transform: calculateParallaxTransform(-10) }}>
            <div className="relative hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ai-purple to-ai-darkPurple rounded-2xl blur-xl opacity-50 animate-pulse-slow hover:opacity-70 transition-opacity"></div>
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-white/10 glass-morphism hover:border-white/20 transition-all duration-300">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/images/umayaraj-photo.jpg`}
                  alt="Umayaraj Kumar"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div 
                className="absolute -bottom-4 -right-4 w-20 h-20 md:w-24 md:h-24 border border-ai-purple/30 rounded-xl"
                style={{ transform: calculateParallaxTransform(5) }}
              ></div>
              <div 
                className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 border border-ai-purple/30 rounded-xl"
                style={{ transform: calculateParallaxTransform(8) }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={`mt-8 md:mt-12 flex justify-center md:justify-start space-x-6 transition-all duration-1000 delay-1100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a 
            href="https://github.com/UmayarajKumar17" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
            aria-label="GitHub"
          >
            <Github size={isMobile ? 20 : 24} className="hover:rotate-12 transition-transform duration-300" />
          </a>
          <a 
            href="https://www.linkedin.com/in/umayaraj-kumar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
            aria-label="LinkedIn"
          >
            <Linkedin size={isMobile ? 20 : 24} className="hover:rotate-12 transition-transform duration-300" />
          </a>
          <a 
            href="https://x.com/Umaya_raj_1776" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
            aria-label="X (formerly Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover:rotate-12 transition-transform duration-300"
            >
              <path d="M4 4l11.5 11.5" />
              <path d="M4 19.5L15.5 8M8 8l7 7M14 6l2 2" />
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/umaya_raj_1776/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
            aria-label="Instagram"
          >
            <Instagram size={isMobile ? 20 : 24} className="hover:rotate-12 transition-transform duration-300" />
          </a>
        </div>
      </div>
      
      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-ai-purple transition-colors animate-bounce hover:animate-none hover:scale-110 transition-transform"
        aria-label="Scroll to next section"
      >
        <ArrowDown size={isMobile ? 24 : 28} />
      </button>
    </section>
  );
};

export default HeroSection;
