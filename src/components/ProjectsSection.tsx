import React, { useEffect, useRef } from 'react';
import { Github, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  codeUrl?: string;
  inDevelopment?: boolean;
}

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      elementsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const projects: Project[] = [
    {
      title: "GAN-Based Image Generation System",
      description: "A deep learning model that generates realistic images using Generative Adversarial Networks. The system can create novel images that appear authentic by having two neural networks compete against each other.",
      image: "/projects_imgs/GAN_Based_Image_Generation_System.png",
      tags: ["GAN", "TensorFlow", "Deep Learning", "Neural Networks"],
      codeUrl: "https://github.com/UmayarajKumar17/GAN/blob/main/Pro.ipynb"
    },
    {
      title: "Intelligent Emergency Response System",
      description: "An AI-powered system using ESP32, smart sensors, CNN, and OpenCV for enhanced accident detection and response. Currently under active development.",
      image: "/projects_imgs/Intelligent_Emergency_Response_System.png",
      tags: ["IoT", "CNN", "OpenCV", "ESP32", "Real-time"],
      inDevelopment: true
    },
    {
      title: "AI-Powered Health Monitoring System",
      description: "A platform integrating IoT wearables for continuous vital sign tracking. This project is in early development phase with planned features including AI personalization and health recommendations.",
      image: "/projects_imgs/AI_Powered_Health_Monitoring_System.png",
      tags: ["IoT", "Healthcare", "AI", "GDPR", "HIPAA"],
      inDevelopment: true
    },
    {
      title: "Graph-Based RAG Application",
      description: "Built a Retrieval-Augmented Generation system using Neo4j and Streamlit for context-aware retrieval, combining vector search with graph traversal for enhanced LLM responses.",
      image: "/projects_imgs/Graph_Based_RAG_Application.png",
      tags: ["RAG", "Neo4j", "Streamlit", "LLMs", "Graph Database"],
      codeUrl: "https://github.com/UmayarajKumar17/RAG"
    }
  ];

  return (
    <section 
      id="projects"
      ref={sectionRef}
      className="py-16 md:py-20 relative bg-gradient-to-b from-secondary/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={(el) => elementsRef.current[0] = el}
            className="mb-8 md:mb-12 text-center opacity-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="animated-gradient-text">Featured Projects</span></h2>
            <div className="w-20 h-1 bg-ai-purple mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Explore some of the projects I've developed and am currently working on that showcase my interests in artificial intelligence and machine learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                ref={(el) => elementsRef.current[index + 1] = el}
                className="glass-morphism rounded-xl overflow-hidden hover-card opacity-0 relative"
              >
                {project.inDevelopment && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-yellow-500/80 text-black text-xs font-medium rounded-full flex items-center">
                    <Clock size={12} className="mr-1" />
                    Under Development
                  </div>
                )}
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={`${baseUrl}${project.image}`} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 sm:px-3 py-1 text-xs bg-ai-purple/20 text-ai-purple rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs sm:text-sm border border-white/20 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors hover:border-ai-purple hover:bg-white/5 hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.codeUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <Github size={isMobile ? 14 : 16} className="mr-1 sm:mr-2" />
                        View Code
                      </a>
                    )}
                    {project.inDevelopment && (
                      <div className="flex items-center text-xs sm:text-sm border border-yellow-500/30 text-yellow-200 px-3 sm:px-4 py-2 rounded-lg">
                        <Clock size={isMobile ? 14 : 16} className="mr-1 sm:mr-2" />
                        Coming Soon
                      </div>
                    )}
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

export default ProjectsSection;
