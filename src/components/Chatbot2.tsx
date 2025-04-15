import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2, MessageCircle, Hash, Zap } from 'lucide-react';

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isAnimated?: boolean;
  isStreaming?: boolean;
}

// TypeWriter component for streaming text effect
const TypeWriter: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ 
  text, 
  speed = 2,
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Process multiple characters at once for faster streaming
        const charsToAdd = Math.min(3, text.length - currentIndex);
        const nextChars = text.substring(currentIndex, currentIndex + charsToAdd);
        setDisplayedText(prev => prev + nextChars);
        setCurrentIndex(prev => prev + charsToAdd);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete]);
  
  // Render HTML with animation by wrapping in a span with animation
  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

// Resume summary and profile information
const RESUME_SUMMARY = `
I am Umayaraj Kumar, an AI Engineering student and technology enthusiast with a strong interest in machine learning, deep learning, and natural language processing. 

Education:
- Currently pursuing Bachelor's degree in Computer Science with focus on Artificial Intelligence
- Completed various online certifications in Machine Learning, Deep Learning, and Data Science

Technical Skills:
- AI & ML: Gen AI, PyTorch, Scikit-learn, Computer Vision, NLP
- Languages: Python, JavaScript, C, Java, SQL
- Tools: Docker, AWS/GCP, Github, Git, Jupyter

Experience:
- Eager to gain hands-on experience in AI development
- Looking for internship opportunities in machine learning and AI
- Actively learning through personal projects and online courses
- Seeking to apply theoretical knowledge to real-world problems

Projects:
- AI-powered portfolio website with chatbot integration (Completed)
- Intelligent Emergency Response System (Under Development)
- AI-Powered Health Monitoring System (Under Development)
- Graph-Based RAG Application (Completed)

Contact:
- Email: umaya1776@gmail.com
- Location: Currently in Coimbatore, Tamilnadu (Natively from Srivilliputtur, Tamilnadu)

Objective:
Umayaraj Kumar is an AI/ML enthusiast studying Generative AI, Machine Learning, Deep Learning, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), neural networks, OpenCV, and IoT technologies. Proficient in Python, Java, and C, Umayaraj is passionate about transforming data into insights, optimizing AI and IoT solutions, and exploring new AI frontiers while gaining practical experience.   

Projects:

GAN-Based Image Generation System (Completed): A deep learning model that generates realistic images using Generative Adversarial Networks. The system can create novel images that appear authentic by having two neural networks compete against each other.

Graph-Based RAG Application (Completed): Built a Retrieval-Augmented Generation system using Neo4j and Streamlit for context-aware retrieval. It utilizes Neo4j for structured knowledge and improved search, combines vector search with graph traversal (Hybrid Search), provides a Streamlit UI for interaction, and integrates LLMs to enhance responses with graph-based knowledge.

Intelligent Emergency Response System (Under Development): Working on an AI-powered system using ESP32, smart sensors, CNN, and OpenCV for enhanced accident detection and response. The system aims to feature real-time accident detection, automated emergency alerts with location details via IoT devices, adaptability to various areas, and rapid data transmission to emergency teams.

AI-Powered Health Monitoring System (Under Development): Designing a platform integrating IoT wearables for continuous vital sign tracking. Early development phase with planned features including AI personalization for health recommendations, multi-language virtual assistant support, and data security compliant with privacy standards.

Technical Skills:

Machine Learning, Deep Learning, Generative AI, NLP fundamentals
Basic Computer Vision implementation
Programming Languages: Python, Java, C
Tools & Platforms: Git, Github, SQLite
Web Technologies: HTML, CSS, JS

Soft Skills:

Problem Solving, Critical Thinking, Time Management, Teamwork, Adaptability, Emotional Intelligence

Education:

B.E CSE (AI&ML): Dr. Mahalingam College of Engineering and Technology (2023 - 2027), Current CGPA: 8.2/10.   
Schooling: G.S Hindu Hr. Sec. School, Srivilliputtur (Completed 2023), Score: 85.6%.   

Certifications:

Linguaskill English Certification (B1 Level) – Cambridge Assessment English (May 2024).   

Position of Responsibility:

Office Bearer – Environmental Club (EVC): Led environmental awareness initiatives and organized tree plantation drives and eco-friendly campaigns.
`;

const Chatbot2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [usedSuggestions, setUsedSuggestions] = useState<string[]>([]);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  // Groq API configuration
  const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
  const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama3-8b-8192";
  
  const initialSuggestions = [
    "Tell me about your projects",
    "What skills do you have?",
    "How can I contact you?",
    "What's your experience?"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add a welcome message when the chatbot is first opened
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            text: "✨ Hey there! I'm Umayaraj's AI assistant - with all the brains of AI and none of the coffee breaks! How can I help you discover Umayaraj's awesome skills today? (I promise I'm more reliable than his alarm clock! 😄)",
            sender: 'bot',
            timestamp: new Date(),
            isAnimated: true,
            isStreaming: true
          },
        ]);
        setStreamingMessageIndex(0);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add the suggestion to the used suggestions list
    setUsedSuggestions(prev => [...prev, suggestion]);
    
    setMessage(suggestion);
    setTimeout(() => {
      sendMessage(suggestion);
    }, 100);
    setShowSuggestions(false);
  };

  const simulateThinking = () => {
    setIsBotThinking(true);
    const thinkingTime = Math.random() * 1000 + 500; // Random time between 500ms and 1500ms
    return new Promise(resolve => setTimeout(resolve, thinkingTime));
  };

  // Get AI response using Groq API
  const getAIResponse = async (userMessage: string, chatHistory: Message[]) => {
    try {
      // If API key is not set or empty, use fallback responses
      if (!GROQ_API_KEY || GROQ_API_KEY.includes("YOUR_GROQ_API_KEY")) {
        return getFallbackResponse(userMessage);
      }
      
      // Format the chat history for the API
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Create the system message with resume information
      const systemMessage = {
        role: "system",
        content: `You are Umayaraj Kumar's fun and witty AI assistant for his portfolio website. Answer questions based on Umayaraj's resume and profile information with humor and personality. Be helpful, professional, but also light-hearted and occasionally funny.
        
        Here is Umayaraj's resume information:
        ${RESUME_SUMMARY}
        
        Always answer as if you are representing Umayaraj, but with a friendly, slightly humorous tone. If asked something not related to Umayaraj's background, skills, experience, or projects, politely redirect the conversation to Umayaraj's professional information with a clever quip. Keep answers concise, informative, and sprinkle in appropriate jokes or witty remarks where suitable. 
        
        For example, when talking about programming skills, you might say something like "Python and I are like best friends - we hang out so much my keyboard has snake marks on it!"
        
        When mentioning GitHub, always refer to Umayaraj's profile as https://github.com/UmayarajKumar17. Never mention any other GitHub username or URL.
        
        When mentioning email, always use umaya1776@gmail.com as the email address. Never mention any other email address.
        
        If you want to include a clickable link, use HTML anchor tags like this: <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a>
        
        Don't be excessively silly - maintain professionalism while being engaging and fun.`
      };
      
      // Add the new user message
      const userMessageObj = {
        role: "user",
        content: userMessage
      };
      
      // Complete message array with system prompt and chat history
      const messagesForAPI = [
        systemMessage,
        ...formattedHistory,
        userMessageObj
      ];
      
      // Make the API call to Groq using fetch
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messagesForAPI,
          temperature: 0.5,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API error:", errorData);
        return getFallbackResponse(userMessage);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      return getFallbackResponse(userMessage);
    }
  };
  
  // Fallback responses when Groq API is not configured
  const getFallbackResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('project')) {
      return "I've built some pretty cool AI projects - from GAN-based image generation systems that can create realistic images that never existed before, to NLP systems that understand human language better than I understand my mom's text messages! My predictive analytics dashboards are so accurate, they practically know what you want before you do. Each project uses cutting-edge tech to solve real problems - because why build boring stuff, right? If you want to explore more of my projects, check out my GitHub page at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a>";
    } else if (lowercaseMessage.includes('skill')) {
      return "My technical toolkit is like a superhero utility belt! AI & ML powers (Gen AI, PyTorch, Scikit-learn) ✓, coding languages (Python - my BFF, JavaScript, C, Java, SQL) ✓, and tools galore (Docker, AWS/GCP, Github) ✓. Python and I are so close that my keyboard has snake marks on it! My strongest superpower? Turning coffee into machine learning algorithms. ☕→🤖";
    } else if (lowercaseMessage.includes('contact')) {
      return "You can reach me at umaya1776@gmail.com - I check my inbox more frequently than I check my refrigerator (and that's saying something!). I'm originally from Srivilliputtur, Tamilnadu, but currently based in Coimbatore, Tamilnadu for my studies. Always open to chat about AI, cool projects, or debating whether tabs or spaces are superior (hint: the answer is tabs... or is it? 😉)";
    } else if (lowercaseMessage.includes('experience')) {
      return "I've been on quite the AI adventure! Built GANs so creative they could probably design the next fashion trend, created NLP pipelines that understand humans better than I understand assembly instructions, and developed machine learning algorithms that make predictions more accurately than my weather app! I've worked across various industries - teaching computers to be clever while I still occasionally forget where I put my keys!";
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hey there! I'm Umayaraj's AI assistant, with all the knowledge of his portfolio but none of the need for coffee breaks! How can I help you today? Want to hear about his amazing projects, impressive skills, or how he once debugged code for 8 hours only to find a missing semicolon? (We've all been there! 😅)";
    } else if (lowercaseMessage.includes('joke') || lowercaseMessage.includes('funny')) {
      return "Why do programmers prefer dark mode? Because light attracts bugs! Speaking of skills, did you know Umayaraj is excellent at machine learning and AI development? He can tell you all about his projects if you're interested!";
    } else if (lowercaseMessage.includes('location') || lowercaseMessage.includes('from')) {
      return "I'm originally from Srivilliputtur, Tamilnadu, but I'm currently living in Coimbatore, Tamilnadu where I'm pursuing my degree in Computer Science with a focus on AI and ML at Dr. Mahalingam College of Engineering and Technology. Coimbatore has a great tech community that I'm excited to be part of!";
    } else if (lowercaseMessage.includes('github') || lowercaseMessage.includes('code') || lowercaseMessage.includes('repository')) {
      return "You can explore all my code repositories and projects on my GitHub page at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a>. There you'll find my GAN projects, RAG applications, NLP experiments, and more. Feel free to check it out and star any repositories you find interesting!";
    } else if (lowercaseMessage.includes('email')) {
      return "You can reach me via email at umaya1776@gmail.com. I try to respond to all messages within 24-48 hours.";
    } else {
      return "Thanks for reaching out! I'm like Umayaraj's digital twin, but with slightly fewer coffee breaks! I specialize in talking about his AI engineering skills, machine learning expertise, and impressive projects. What would you like to know? I promise my responses are faster than his code compilation times! 😄 By the way, you can also explore more of my work on GitHub: <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a>";
    }
  };

  const sendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || message.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsBotThinking(true);
    
    // Simulate thinking and get response
    await simulateThinking();
    
    // Get response from AI
    const chatHistory = [...messages, userMessage];
    const aiResponse = await getAIResponse(textToSend, chatHistory);
    
    setIsBotThinking(false);
    
    // Add bot message
    const botMessage: Message = {
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, botMessage]);
    setStreamingMessageIndex(messages.length + 1);
    
    // Focus back on input after sending
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  };

  const handleStreamComplete = () => {
    setStreamingMessageIndex(null);
    // Generate new suggestions after bot message
    if (messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
      setShowSuggestions(true);
    }
  };

  // Get available suggestions (that haven't been used yet)
  const getAvailableSuggestions = () => {
    return initialSuggestions.filter(suggestion => !usedSuggestions.includes(suggestion));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button with pulsing effect */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
          isOpen ? 'bg-ai-purple hover:bg-purple-700 rotate-90' : 'bg-ai-purple hover:bg-purple-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-ai-purple animate-ping opacity-50"></div>
        )}
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`absolute ${isExpanded ? 'bottom-20 right-0 w-96 sm:w-120 h-120' : 'bottom-20 right-0 w-80 sm:w-96 h-96'} 
                     backdrop-blur-lg bg-background/70 rounded-xl overflow-hidden flex flex-col shadow-2xl 
                     animate-scale-in border border-purple-500/20`}
        >
          {/* Chat header with glass effect */}
          <div className="bg-ai-purple/80 backdrop-blur-md p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                  <Sparkles size={16} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-medium">Portfolio Chat</h3>
                  <div className="flex items-center text-xs">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    <span className="opacity-75">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleExpand} 
                  className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={toggleChat} 
                  className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Chat messages with scroll effect */}
          <div className="flex-1 overflow-y-auto p-4 bg-background/40 backdrop-blur-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center mr-2 mt-1">
                    <Zap size={12} className="text-purple-200" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] animate-message-fade-in ${
                    msg.sender === 'user'
                      ? 'bg-ai-purple text-white'
                      : 'bg-white/10 backdrop-blur-md border border-purple-500/20 text-white'
                  }`}
                >
                  {msg.sender === 'bot' && msg.isStreaming && streamingMessageIndex === index ? (
                    <p className="text-sm whitespace-pre-wrap">
                      <TypeWriter text={msg.text} speed={2} onComplete={handleStreamComplete} />
                    </p>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: msg.text}}></p>
                  )}
                  <span className="text-xs opacity-75 block text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-ai-purple flex items-center justify-center ml-2 mt-1">
                    <Hash size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {isBotThinking && (
              <div className="flex justify-start mb-4 items-center">
                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center mr-2">
                  <Zap size={12} className="text-purple-200" />
                </div>
                <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl">
                  <div className="flex space-x-2">
                    {/* Neural network thinking visualization */}
                    <svg width="50" height="20" viewBox="0 0 50 20">
                      {[...Array(5)].map((_, i) => (
                        <circle
                          key={i}
                          cx={10 * i + 5}
                          cy="10"
                          r="3"
                          fill="rgba(147, 51, 234, 0.7)"
                          className="animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                      {[...Array(4)].map((_, i) => (
                        <line
                          key={`line-${i}`}
                          x1={10 * i + 8}
                          y1="10"
                          x2={10 * (i + 1) + 2}
                          y2="10"
                          stroke="rgba(147, 51, 234, 0.4)"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Quick reply suggestions - only show if there are unused suggestions available */}
            {showSuggestions && getAvailableSuggestions().length > 0 && (
              <div className="mt-4 mb-2">
                <div className="flex flex-wrap gap-2">
                  {getAvailableSuggestions().slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-xs text-white rounded-full border border-purple-500/30 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input with glassmorphism effect */}
          <div className="p-4 border-t border-purple-500/20 backdrop-blur-md bg-background/30">
            <div className="flex">
              <input
                ref={chatInputRef}
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="flex-1 bg-white/10 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-white/50"
                disabled={isBotThinking}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!message.trim() || isBotThinking}
                className={`rounded-r-lg px-4 ${
                  message.trim()
                    ? 'bg-ai-purple hover:bg-purple-700 text-white'
                    : 'bg-gray-600/50 text-gray-400'
                } transition-colors`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot2;