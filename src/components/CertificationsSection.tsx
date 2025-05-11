import React, { useState, useEffect, useRef } from 'react';
import { Award, X, ExternalLink, Calendar, Cpu, BookOpen, GraduationCap, BarChart, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
  images: string[];
  verificationLink?: string;
  icon: React.ReactNode;
  color: string;
}

const CertificationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [autoRotateInterval, setAutoRotateInterval] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Certificate data with provided images
  const certificates: Certificate[] = [
    {
      id: 'freecodecamp',
      title: 'Machine Learning with Python',
      issuer: 'freeCodeCamp',
      date: 'April 30, 2025',
      description: 'Comprehensive certification covering machine learning fundamentals and implementation using Python and TensorFlow. Completed 300 hours of coursework including neural networks, supervised learning, and data visualization projects.',
      skills: ['TensorFlow', 'Neural Networks', 'Python', 'Supervised Learning', 'Data Analysis'],
      images: ['/certificates/freecodecamp-ml.png'],
      verificationLink: 'https://freecodecamp.org/certification/Umayaraj_Kumar/machine-learning-with-python-v7',
      icon: <Cpu size={24} className="text-white" />,
      color: '#0A0A23'
    },
    {
      id: 'genai',
      title: 'Generative AI: Introduction to LLMs',
      issuer: 'LinkedIn Learning',
      date: 'April 29, 2025',
      description: 'Course focused on Large Language Models and generative AI concepts. Covered foundational principles of LLMs, prompt engineering, and practical applications with 1 hour 36 minutes of specialized content and hands-on exercises.',
      skills: ['Large Language Models', 'Generative AI', 'NLP', 'AI Ethics', 'Prompt Engineering'],
      images: ['/certificates/linkedin-genai.png'],
      verificationLink: '#',
      icon: <BookOpen size={24} className="text-white" />,
      color: '#0077B5'
    },
    {
      id: 'advanced-prompt',
      title: 'Fundamentals of Generative AI',
      issuer: 'LinkedIn Learning',
      date: 'May 11, 2025',
      description: 'Completed comprehensive training on Generative AI fundamentals and practical applications. Gained expertise in AI tools implementation, workflow optimization, and ethical considerations in AI development. Certificate validates proficiency in modern AI technologies.',
      skills: ['Generative AI Tools', 'Artificial Intelligence', 'AI Workflows', 'Generative AI', 'Few-Shot Learning'],
      images: ['/certificates/linkedin-genai2.png'],
      verificationLink: '#',
      icon: <BarChart size={24} className="text-white" />,
      color: '#0077B5'
    },
    {
      id: 'linguaskill',
      title: 'Linguaskill English Certification',
      issuer: 'Cambridge Assessment English',
      date: 'May 30, 2024',
      description: 'Achieved B1 level certification in English language proficiency. Demonstrated competence in reading (154), writing (151), listening (153) and speaking (153) skills with an average score of 153, proving business communication readiness.',
      skills: ['English Proficiency', 'Business Communication', 'Academic English', 'CEFR B1 Level'],
      images: ['/certificates/linguaskill-1.png', '/certificates/linguaskill-2.png'],
      verificationLink: 'https://results.linguaskill.com',
      icon: <GraduationCap size={24} className="text-white" />,
      color: '#CB0000'
    }
  ];

  // Function to advance to next card
  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % certificates.length);
    setUserInteracted(true);
    stopAutoRotation();
  };

  // Function to go to previous card
  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    setUserInteracted(true);
    stopAutoRotation();
  };

  // Function to open certificate details
  const openCertificateDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
    setUserInteracted(true);
    stopAutoRotation();
  };

  // Function to close certificate modal
  const closeCertificateModal = () => {
    setSelectedCertificate(null);
    document.body.style.overflow = '';
  };

  // Function to navigate modal images
  const navigateModalImages = (direction: 'next' | 'prev') => {
    if (!selectedCertificate) return;
    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev < selectedCertificate.images.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : selectedCertificate.images.length - 1
      );
    }
  };

  // Function to stop auto-rotation
  const stopAutoRotation = () => {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      setAutoRotateInterval(null);
    }
  };

  // Start automatic rotation when component mounts
  useEffect(() => {
    // Only start auto-rotation if user hasn't interacted yet
    if (!userInteracted) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % certificates.length);
      }, 2500); // Rotate every 3 seconds
      
      setAutoRotateInterval(interval);
    }
    
    return () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
      }
    };
  }, [userInteracted, certificates.length]);

  // Set up interaction detection for click on indicators
  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
    setUserInteracted(true);
    stopAutoRotation();
  };

  return (
    <section 
      id="certifications"
      ref={sectionRef}
      className="py-20 relative bg-gradient-to-b from-background to-secondary/10 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ai-purple/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-gradient-shift"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-ai-purple to-ai-darkPurple">
                  Professional Certifications
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-ai-purple/20 to-ai-darkPurple/20 blur-xl"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Validating expertise through recognized certifications and continuous learning
            </p>
          </div>

          {/* Card Stack Container */}
          <div className="relative h-[500px] sm:h-[550px] md:h-[600px] max-w-4xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevCard}
              className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-16 z-20 p-3 rounded-full bg-ai-purple/20 hover:bg-ai-purple/40 transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            
            <button
              onClick={nextCard}
              className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-16 z-20 p-3 rounded-full bg-ai-purple/20 hover:bg-ai-purple/40 transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Card Stack */}
            <div className="relative h-full">
              {certificates.map((certificate, index) => {
                const isActive = index === activeIndex;
                const imgSrc = certificate.images[0] ? baseUrl.replace(/\/$/, '') + certificate.images[0] : undefined;
                return (
                  <div
                    key={certificate.id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out cursor-pointer
                      ${isActive ? 'z-10 scale-100 opacity-100 blur-0' : 'z-0 scale-90 opacity-40 blur-md'}
                    `}
                    onClick={() => openCertificateDetails(certificate)}
                  >
                    <div 
                      className="h-full p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 bg-white/5 flex flex-col"
                      style={{
                        background: `linear-gradient(135deg, ${certificate.color}15, transparent)`,
                        boxShadow: isActive 
                          ? `0 20px 40px -10px ${certificate.color}30`
                          : '0 10px 30px -10px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Top half: Certificate details */}
                      <div className="relative z-10 flex flex-col h-1/2 pb-2">
                        <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-transform duration-300" style={{ backgroundColor: certificate.color }}>{certificate.icon}</div>
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-ai-purple">{certificate.issuer}</span>
                            <CheckCircle2 size={14} className="text-ai-purple" />
                          </div>
                          <h3 className="text-lg font-bold text-white">{certificate.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <Calendar size={12} className="mr-2" />
                          {certificate.date}
                        </div>
                        <p className="text-gray-300 text-xs mb-2 line-clamp-2">{certificate.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {certificate.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white rounded-full">{skill}</span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom half: Certificate Preview (middle to bottom, edge-to-edge) */}
                      <div className="relative w-full h-1/2 flex flex-col justify-end">
                        <div className={`absolute left-0 right-0 bottom-0 w-full h-full bg-white rounded-b-2xl overflow-hidden flex items-center justify-center border-t-2 border-ai-purple shadow-md`}>
                          {imgSrc && !imageError[imgSrc] ? (
                            <img 
                              src={imgSrc} 
                              alt={`${certificate.title} Preview`} 
                              className={`object-cover w-full h-full ${isActive ? '' : 'blur-sm opacity-70'}`}
                              style={{background: '#fff', objectPosition: 'center 60%'}}
                              onError={() => setImageError(prev => ({...prev, [imgSrc]: true}))}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Award size={40} className="text-ai-purple opacity-50 mb-2" />
                              <span className="text-xs text-gray-400">Certificate image not found</span>
                            </div>
                          )}
                          {/* View Certificate Button as overlay */}
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();
                              openCertificateDetails(certificate); 
                            }}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 py-1.5 px-4 rounded-lg bg-ai-purple/80 hover:bg-ai-purple text-white shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
                            style={{zIndex: 2}}
                          >
                            <span>View Full Certificate</span>
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {certificates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-ai-purple' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Modal for Certificate - edge-to-edge, dark overlay, close button, image navigation */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 m-0"
          onClick={closeCertificateModal}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeCertificateModal}
              className="absolute top-6 right-8 z-10 p-3 rounded-full bg-white/20 hover:bg-ai-purple/80 text-white shadow-xl transition-colors"
              style={{fontSize: '1.5rem'}}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-full max-w-3xl h-[80vh] max-h-[90vh] bg-black rounded-2xl flex items-center justify-center shadow-2xl border-4 border-ai-purple overflow-hidden relative">
                {selectedCertificate.images.length > 0 && !imageError[baseUrl.replace(/\/$/, '') + selectedCertificate.images[currentImageIndex]] ? (
                  <>
                    <img 
                      src={baseUrl.replace(/\/$/, '') + selectedCertificate.images[currentImageIndex]} 
                      alt={`${selectedCertificate.title} Certificate`} 
                      className="object-contain w-full h-full bg-white"
                      style={{maxHeight: '100%', maxWidth: '100%'}}
                      onError={() => setImageError(prev => ({...prev, [baseUrl.replace(/\/$/, '') + selectedCertificate.images[currentImageIndex]]: true}))}
                    />
                    {selectedCertificate.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigateModalImages('prev'); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-ai-purple/80 rounded-full p-3 z-20"
                        >
                          <ChevronLeft size={28} className="text-white" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigateModalImages('next'); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-ai-purple/80 rounded-full p-3 z-20"
                        >
                          <ChevronRight size={28} className="text-white" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 bg-white">
                    <Award size={60} className="text-ai-purple opacity-50 mb-4" />
                    <span className="text-lg text-gray-400">Certificate image not found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificationsSection; 