import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, Github, Linkedin, Instagram } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
// Import is still here but we won't use it until properly configured
import emailjs from '@emailjs/browser';

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // EmailJS configuration from environment variables
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_quh4e4f";
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_z6wisrq";
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "C8hw931i0TQiSivu2";
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare template parameters for EmailJS
    const templateParams = {
      to_name: "Umayaraj",
      to_email: "umaya1776@gmail.com",
      from_name: formData.name,
      from_email: formData.email,
      subject: `${formData.subject || "Portfolio Contact"} - from ${formData.name} (${formData.email})`,
      message: formData.message,
      reply_to: formData.email
    };
    
    // Send email using EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('Email sent successfully:', response);
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        toast({
          title: "Message sent successfully!",
          description: "Thank you for reaching out. I'll get back to you soon.",
          variant: "default",
        });
        
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((error) => {
        console.error('Email error:', error);
        setIsSubmitting(false);
        
        toast({
          title: "Error sending message",
          description: "There was a problem sending your message. Please try again later.",
          variant: "destructive",
        });
      });
  };

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background elements with animation */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div 
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-ai-purple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(10) }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-ai-darkPurple/5 rounded-full filter blur-3xl"
          style={{ transform: calculateParallaxTransform(15) }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
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
            ref={(el) => elementsRef.current[0] = el}
            className="mb-12 text-center opacity-0"
            style={{ transform: calculateParallaxTransform(-5) }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="animated-gradient-text">Get in Touch</span>
            </h2>
            <div className="w-20 h-1 bg-ai-purple mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Have a project in mind or just want to connect? Feel free to reach out!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              ref={(el) => elementsRef.current[1] = el}
              className="opacity-0 flex flex-col justify-center h-full px-4"
              style={{ transform: calculateParallaxTransform(-8) }}
            >
              <h3 className="text-2xl font-bold mb-8 text-white">Contact Information</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center transition-all duration-300 hover:transform hover:translate-x-2 group">
                  <div className="w-10 h-10 rounded-xl bg-ai-purple/20 flex items-center justify-center mr-4">
                    <Mail className="text-ai-purple group-hover:scale-110 transition-all duration-300" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Email</h4>
                    <a href="mailto:umaya1776@gmail.com" className="text-gray-300 hover:text-ai-purple transition-colors">
                    umaya1776@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center transition-all duration-300 hover:transform hover:translate-x-2 group">
                  <div className="w-10 h-10 rounded-xl bg-ai-purple/20 flex items-center justify-center mr-4">
                    <MapPin className="text-ai-purple group-hover:scale-110 transition-all duration-300" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Location</h4>
                    <p className="text-gray-300">Coimbatore, Tamilnadu</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Let's Connect</h3>
              <p className="text-gray-300 mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              
              <div className="flex space-x-5 mt-6">
                <a 
                  href="https://github.com/UmayarajKumar17" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ai-purple/10 flex items-center justify-center text-gray-300 hover:text-ai-purple hover:bg-ai-purple/20 transition-all duration-300 transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github size={20} className="hover:rotate-12 transition-transform duration-300" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/umayaraj-kumar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ai-purple/10 flex items-center justify-center text-gray-300 hover:text-ai-purple hover:bg-ai-purple/20 transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} className="hover:rotate-12 transition-transform duration-300" />
                </a>
                <a 
                  href="https://x.com/Umaya_raj_1776" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ai-purple/10 flex items-center justify-center text-gray-300 hover:text-ai-purple hover:bg-ai-purple/20 transition-all duration-300 transform hover:scale-110"
                  aria-label="X (formerly Twitter)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
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
                  className="w-10 h-10 rounded-xl bg-ai-purple/10 flex items-center justify-center text-gray-300 hover:text-ai-purple hover:bg-ai-purple/20 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={20} className="hover:rotate-12 transition-transform duration-300" />
                </a>
              </div>
            </div>
            
            <div 
              ref={(el) => elementsRef.current[2] = el}
              className="relative backdrop-blur-lg p-8 rounded-2xl opacity-0 border border-ai-purple/30 hover:border-ai-purple/50 transition-all duration-300 shadow-xl hover:shadow-ai-purple/20 overflow-hidden"
              style={{ transform: calculateParallaxTransform(-3) }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-ai-purple/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-ai-darkPurple/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-ai-purple/20 flex items-center justify-center mr-3">
                    <Mail className="text-ai-purple" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Let's Collaborate</h3>
                </div>
                
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-r from-ai-purple/10 to-ai-darkPurple/10 rounded-xl backdrop-blur-sm p-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle className="text-green-500 w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-300 text-center">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label htmlFor="name" className="text-sm text-gray-400 mb-1 block ml-1">Your Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full px-4 py-3 bg-background/50 border-2 transition-all duration-300 rounded-xl focus:outline-none text-white ${
                              focusedInput === 'name' 
                                ? 'border-ai-purple shadow-md shadow-ai-purple/20' 
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          />
                          <div className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-gradient-to-r from-ai-purple to-ai-darkPurple transition-all duration-500 rounded-full ${
                            focusedInput === 'name' ? 'w-[95%]' : 'w-0'
                          }`}></div>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="text-sm text-gray-400 mb-1 block ml-1">Your Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full px-4 py-3 bg-background/50 border-2 transition-all duration-300 rounded-xl focus:outline-none text-white ${
                              focusedInput === 'email' 
                                ? 'border-ai-purple shadow-md shadow-ai-purple/20' 
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          />
                          <div className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-gradient-to-r from-ai-purple to-ai-darkPurple transition-all duration-500 rounded-full ${
                            focusedInput === 'email' ? 'w-[95%]' : 'w-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="text-sm text-gray-400 mb-1 block ml-1">Subject</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('subject')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full px-4 py-3 bg-background/50 border-2 transition-all duration-300 rounded-xl focus:outline-none text-white ${
                            focusedInput === 'subject' 
                              ? 'border-ai-purple shadow-md shadow-ai-purple/20' 
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        />
                        <div className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-gradient-to-r from-ai-purple to-ai-darkPurple transition-all duration-500 rounded-full ${
                          focusedInput === 'subject' ? 'w-[95%]' : 'w-0'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="text-sm text-gray-400 mb-1 block ml-1">Your Message</label>
                      <div className="relative">
                        <textarea
                          name="message"
                          id="message"
                          placeholder="Share your thoughts or project details..."
                          required
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('message')}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full px-4 py-3 bg-background/50 border-2 transition-all duration-300 rounded-xl focus:outline-none text-white ${
                            focusedInput === 'message' 
                              ? 'border-ai-purple shadow-md shadow-ai-purple/20' 
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          rows={4}
                        ></textarea>
                        <div className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-gradient-to-r from-ai-purple to-ai-darkPurple transition-all duration-500 rounded-full ${
                          focusedInput === 'message' ? 'w-[95%]' : 'w-0'
                        }`}></div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 mt-3 bg-gradient-to-r from-ai-purple to-ai-darkPurple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-ai-purple/30 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
