import React from 'react';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Umayaraj Kumar</h3>
            <p className="text-gray-400 mb-6">
              AI Engineer focusing on innovative solutions and cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/UmayarajKumar17" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ai-purple transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/umayaraj-kumar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ai-purple transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://x.com/Umaya_raj_1776" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ai-purple transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l11.5 11.5" />
                  <path d="M4 19.5L15.5 8M8 8l7 7M14 6l2 2" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/umaya_raj_1776/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ai-purple transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                  onClick={(e) => {e.preventDefault(); document.querySelector('#home')?.scrollIntoView({behavior: 'smooth'})}}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                  onClick={(e) => {e.preventDefault(); document.querySelector('#about')?.scrollIntoView({behavior: 'smooth'})}}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#skills" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                  onClick={(e) => {e.preventDefault(); document.querySelector('#skills')?.scrollIntoView({behavior: 'smooth'})}}
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#projects" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                  onClick={(e) => {e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({behavior: 'smooth'})}}
                >
                  Projects
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                  onClick={(e) => {e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({behavior: 'smooth'})}}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="text-ai-purple mr-2" />
                <a 
                  href="mailto:umaya1776@gmail.com" 
                  className="text-gray-400 hover:text-ai-purple transition-colors"
                >
                  umaya1776@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} Umayaraj Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
