import React, { useEffect, useRef, useState } from 'react';
import { Brain, Server, Database, Globe, Code2, Layers, Cpu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Skill {
  name: string;
  level: number;
  color: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  name: string;
  icon: React.ReactNode;
  skills: Skill[];
}

const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const isMobile = useIsMobile();
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
  
  // Mouse move effect for parallax
  useEffect(() => {
    if (isMobile) return; // Disable on mobile
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Calculate parallax transform for elements
  const calculateParallaxTransform = (depth: number) => {
    const moveX = (mousePosition.x * 2 - 1) * depth;
    const moveY = (mousePosition.y * 2 - 1) * depth;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  const skillCategories: SkillCategory[] = [
    {
      name: "AI & ML",
      icon: <Brain size={24} className="text-ai-purple pulse-animation" />,
      skills: [
        { name: "Gen AI", level: 70, color: "#FF6B6B", icon: <Cpu size={16} /> },
        { name: "PyTorch", level: 75, color: "#FFD93D", icon: <Cpu size={16} /> },
        { name: "Scikit-learn", level: 80, color: "#6BCB77", icon: <Cpu size={16} /> },
        { name: "Computer Vision", level: 70, color: "#4D96FF", icon: <Cpu size={16} /> },
        { name: "NLP", level: 75, color: "#9B87F5", icon: <Cpu size={16} /> }
      ]
    },
    {
      name: "Languages",
      icon: <Code2 size={24} className="text-ai-purple pulse-animation" />,
      skills: [
        { name: "Python", level: 80, color: "#4D96FF", icon: <Code2 size={16} /> },
        { name: "JavaScript", level: 20, color: "#FFD93D", icon: <Code2 size={16} /> },
        { name: "C", level: 60, color: "#FF6B6B", icon: <Code2 size={16} /> },
        { name: "Java", level: 50, color: "#6BCB77", icon: <Code2 size={16} /> },
        { name: "SQL", level: 80, color: "#9B87F5", icon: <Code2 size={16} /> }
      ]
    },
    {
      name: "Tools",
      icon: <Server size={24} className="text-ai-purple pulse-animation" />,
      skills: [
        { name: "Docker", level: 75, color: "#4D96FF", icon: <Server size={16} /> },
        { name: "VS Code", level: 80, color: "#FFD93D", icon: <Globe size={16} /> },
        { name: "Github", level: 80, color: "#FF6B6B", icon: <Layers size={16} /> },
        { name: "Git", level: 90, color: "#6BCB77", icon: <Database size={16} /> },
        { name: "Jupyter", level: 95, color: "#9B87F5", icon: <Database size={16} /> }
      ]
    }
  ];

  return (
    <section 
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-24 relative bg-gradient-to-b from-secondary/10 to-background overflow-hidden"
    >
      {/* Background elements with animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/4 w-80 h-80 bg-ai-purple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(15) }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-ai-darkPurple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(10) }}
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
          <div 
            className={`mb-10 md:mb-16 text-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transform: isVisible ? calculateParallaxTransform(-5) : undefined }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="animated-gradient-text">Skills & Expertise</span>
            </h2>
            <div className="w-20 h-1 bg-ai-purple mx-auto rounded-full mb-6"></div>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              My technical toolkit includes a range of skills and technologies that enable me to build sophisticated AI-powered applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">
            {/* Skills Categories Navigation */}
            <div 
              className={`space-y-2 mb-6 md:mb-0 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transform: isVisible ? calculateParallaxTransform(-8) : undefined }}
            >
              {skillCategories.map((category, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 transform ${
                    activeCategory === index 
                      ? 'bg-ai-purple text-white scale-105 shadow-lg shadow-ai-purple/20' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-102'
                  }`}
                  onClick={() => setActiveCategory(index)}
                >
                  <span className={`mr-3 transition-transform duration-300 ${activeCategory === index ? 'rotate-12' : ''}`}>
                    {category.icon}
                  </span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
            
            {/* Skills Visualization */}
            <div 
              className={`md:col-span-3 bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 transition-all duration-700 delay-500 transform ${
                isVisible ? 'opacity-100 translate-x-0 hover:border-ai-purple/20 hover:shadow-lg hover:shadow-ai-purple/10' : 'opacity-0 translate-x-8'
              }`}
              style={{ transform: isVisible ? calculateParallaxTransform(-3) : undefined }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className={`transition-all duration-300 transform ${activeCategory !== null ? 'scale-110' : ''}`}>
                  {skillCategories[activeCategory].icon}
                </span>
                <span className="ml-2">{skillCategories[activeCategory].name} Skills</span>
              </h3>
              
              {/* Interactive Skills Visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <div 
                    key={index}
                    className={`relative transition-all duration-500 transform ${
                      isVisible ? `opacity-100 translate-y-0 delay-${200 * (index + 1)}` : 'opacity-0 translate-y-4'
                    }`}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      hoveredSkill === skill.name 
                        ? `bg-white/10 transform scale-105 border-${skill.color.substring(1)}/30 shadow-lg`
                        : 'bg-white/5 hover:bg-white/10 border-transparent'
                    }`}
                    style={{ 
                      boxShadow: hoveredSkill === skill.name ? `0 10px 25px -5px ${skill.color}22` : undefined
                    }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className={`mr-2 transition-all duration-300 ${
                            hoveredSkill === skill.name ? 'text-white transform rotate-12 scale-110' : 'text-gray-400'
                          }`} style={{ color: hoveredSkill === skill.name ? skill.color : undefined }}>
                            {skill.icon}
                          </span>
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: skill.color }}>
                          {hoveredSkill === skill.name ? `${skill.level}%` : `${skill.level}%`}
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            backgroundColor: skill.color,
                            boxShadow: hoveredSkill === skill.name ? `0 0 10px ${skill.color}` : 'none'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Skill Metrics Visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {skillCategories[activeCategory].skills.slice(0, 3).map((skill, index) => (
                  <div 
                    key={index} 
                    className={`text-center p-4 bg-white/5 rounded-xl border border-transparent transition-all duration-300 transform ${
                      hoveredSkill === skill.name 
                        ? `border-${skill.color.substring(1)}/30 bg-white/10 scale-105`
                        : 'hover:bg-white/10 hover:border-white/20'
                    }`}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div 
                      className="radial-progress mx-auto mb-2 transition-all duration-1500" 
                      style={{ 
                        width: isMobile ? "4rem" : "6rem", 
                        height: isMobile ? "4rem" : "6rem",
                        background: `conic-gradient(${skill.color} ${isVisible ? skill.level : 0}%, transparent 0)`,
                        boxShadow: hoveredSkill === skill.name ? `0 0 20px -5px ${skill.color}` : 'none',
                        transform: hoveredSkill === skill.name ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
                        <span 
                          className="text-base md:text-xl font-bold transition-all duration-300" 
                          style={{ 
                            color: skill.color,
                            transform: hoveredSkill === skill.name ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm transition-all duration-300 ${
                      hoveredSkill === skill.name ? 'text-white' : 'text-gray-300'
                    }`}>
                      {skill.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .radial-progress {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .radial-progress {
            width: 4rem;
            height: 4rem;
          }
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        `}
      </style>
    </section>
  );
};

export default SkillsSection;
