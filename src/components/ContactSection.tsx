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
          
          <div className="grid md:grid-cols-2 gap-12">
            <div 
              ref={(el) => elementsRef.current[1] = el}
              className="opacity-0"
              style={{ transform: calculateParallaxTransform(-8) }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start transition-all duration-300 hover:transform hover:translate-x-2 group">
                  <Mail className="text-ai-purple mt-1 mr-4 group-hover:text-ai-darkPurple group-hover:scale-110 transition-all duration-300" size={20} />
                  <div>
                    <h4 className="font-medium text-white">Email</h4>
                    <a href="mailto:umaya1776@gmail.com" className="text-gray-300 hover:text-ai-purple transition-colors">
                    umaya1776@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start transition-all duration-300 hover:transform hover:translate-x-2 group">
                  <MapPin className="text-ai-purple mt-1 mr-4 group-hover:text-ai-darkPurple group-hover:scale-110 transition-all duration-300" size={20} />
                  <div>
                    <h4 className="font-medium text-white">Location</h4>
                    <p className="text-gray-300">Coimbatore, Tamilnadu</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-white">Let's Connect</h3>
                <p className="text-gray-300 mb-6">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                
                <div className="flex space-x-4 mt-6">
                  <a 
                    href="https://github.com/UmayarajKumar17" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
                    aria-label="GitHub"
                  >
                    <Github size={24} className="hover:rotate-12 transition-transform duration-300" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/umayaraj-kumar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-ai-purple transition-colors duration-300 hover:scale-110 transform-gpu"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} className="hover:rotate-12 transition-transform duration-300" />
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
                      width={24}
                      height={24}
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
                    <Instagram size={24} className="hover:rotate-12 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
            
            <div 
              ref={(el) => elementsRef.current[2] = el}
              className="glass-morphism p-8 rounded-xl opacity-0 border border-white/10 hover:border-ai-purple/20 transition-all duration-300 shadow-lg hover:shadow-ai-purple/10"
              style={{ transform: calculateParallaxTransform(-3) }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Send Message</h3>
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-pulse" />
                  <h4 className="text-xl font-medium text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-300 text-center">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-group relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full px-4 py-3 bg-background border transition-all duration-300 rounded-lg focus:outline-none text-white ${
                          focusedInput === 'name' 
                            ? 'border-ai-purple shadow-sm shadow-ai-purple/30' 
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-ai-purple transition-all duration-500 ${
                        focusedInput === 'name' ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                    
                    <div className="form-group relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full px-4 py-3 bg-background border transition-all duration-300 rounded-lg focus:outline-none text-white ${
                          focusedInput === 'email' 
                            ? 'border-ai-purple shadow-sm shadow-ai-purple/30' 
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-ai-purple transition-all duration-500 ${
                        focusedInput === 'email' ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                  </div>
                  
                  <div className="form-group relative">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput('subject')}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full px-4 py-3 bg-background border transition-all duration-300 rounded-lg focus:outline-none text-white ${
                        focusedInput === 'subject' 
                          ? 'border-ai-purple shadow-sm shadow-ai-purple/30' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-ai-purple transition-all duration-500 ${
                      focusedInput === 'subject' ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                  
                  <div className="form-group relative">
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Your Message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput('message')}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full px-4 py-3 bg-background border transition-all duration-300 rounded-lg focus:outline-none text-white ${
                        focusedInput === 'message' 
                          ? 'border-ai-purple shadow-sm shadow-ai-purple/30' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      rows={4}
                    ></textarea>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-ai-purple transition-all duration-500 ${
                      focusedInput === 'message' ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-ai-purple text-white font-semibold rounded-lg hover:bg-ai-darkPurple transition-colors duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="mr-2 animate-spin" size={20} />
                        Sending...
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
    </section>
  );
};

export default ContactSection;
