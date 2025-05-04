import React, { useEffect, useRef, useState } from 'react';
import { Code, Lightbulb, GraduationCap, Brain, Cpu, Zap } from 'lucide-react';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
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

  // Mouse move effect for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate parallax transform for elements
  const calculateParallaxTransform = (depth: number) => {
    const moveX = (mousePosition.x * 2 - 1) * depth;
    const moveY = (mousePosition.y * 2 - 1) * depth;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  // Content for tabs
  const tabContent = [
    {
      title: "My Journey",
      icon: <Brain size={20} className="text-ai-purple" />,
      content: "My journey in AI began with a fascination for how machines could learn and adapt. Today, I channel that curiosity into crafting innovative AI applications that push the boundaries of what's possible while maintaining a strong emphasis on ethical development and user-centric design."
    },
    {
      title: "Philosophy",
      icon: <Lightbulb size={20} className="text-ai-purple" />,
      content: "I believe in the power of AI to augment human capabilities and make our world more efficient, accessible, and equitable. Every project I undertake is guided by this vision, seeking to create technology that empowers rather than replaces human potential."
    },
    {
      title: "Approach",
      icon: <Cpu size={20} className="text-ai-purple" />,
      content: "My approach combines technical expertise with creative problem-solving. I focus on developing AI systems that are not only powerful and efficient but also interpretable, fair, and aligned with human values. I'm particularly interested in creating AI that can explain its reasoning and work collaboratively with humans."
    }
  ];

  const features = [
    {
      icon: <Code size={24} className="text-ai-purple" />,
      title: "AI Development",
      description: "Building intelligent systems that learn and adapt to solve complex problems."
    },
    {
      icon: <Zap size={24} className="text-ai-purple" />,
      title: "Innovation",
      description: "Exploring new technologies to push the boundaries of what's possible with AI."
    },
    {
      icon: <GraduationCap size={24} className="text-ai-purple" />,
      title: "Research",
      description: "Staying at the cutting edge of AI research and implementation techniques."
    }
  ];

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="py-24 relative"
    >
      {/* Background elements with animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/10 -z-10"></div>
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-ai-purple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(10) }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-darkPurple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(15) }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.2
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-16 text-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="animated-gradient-text">About Me</span>
            </h2>
            <div className="w-20 h-1 bg-ai-purple mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Hello! I'm Umayaraj Kumar, an AI Engineer with a passion for building intelligent systems that make a positive impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 items-start mb-16">
            {/* Bio Card - 2 columns */}
            <div 
              className={`md:col-span-2 glass-morphism rounded-xl p-6 transition-all duration-700 delay-300 transform hover:shadow-lg hover:shadow-ai-purple/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transform: isVisible ? calculateParallaxTransform(-5) : 'translateY(30px)' }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gradient-purple">Who I Am</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I specialize in machine learning, deep learning, and natural language processing, with a focus on creating practical solutions that address real-world challenges.
              </p>
              <p className="text-gray-300 leading-relaxed">
                When I'm not coding, you can find me exploring the latest research papers, participating in AI competitions, and sharing knowledge with the community.
              </p>
            </div>
            
            {/* Interactive Tabs - 3 columns */}
            <div 
              className={`md:col-span-3 transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transform: isVisible ? calculateParallaxTransform(-8) : 'translateY(30px)' }}
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                {tabContent.map((tab, index) => (
                  <button 
                    key={index} 
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all hover:transform hover:scale-105 ${activeTab === index ? 'text-ai-purple border-b-2 border-ai-purple' : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab.icon}
                    <span>{tab.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="bg-white/5 p-6 rounded-xl min-h-[200px] transition-all duration-300 border border-white/10 hover:border-ai-purple/20">
                {tabContent.map((tab, index) => (
                  <div 
                    key={index} 
                    className={`transition-all duration-500 ${
                      activeTab === index 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'hidden opacity-0 transform translate-y-4'
                    }`}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-white">{tab.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{tab.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 glass-morphism rounded-xl hover-card transition-all duration-700 delay-${(index + 1) * 200} transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} hover:shadow-lg hover:shadow-ai-purple/20 hover:border-ai-purple/30 border border-transparent`}
                style={{ transform: isVisible ? `translateY(0) ${calculateParallaxTransform(-3 - index * 2)}` : 'translateY(30px)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <div className="transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
