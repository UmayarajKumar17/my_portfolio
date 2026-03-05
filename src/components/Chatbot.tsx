import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2, MessageCircle, Hash, Zap } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a helpful AI assistant embedded in Umayaraj Kumar's personal portfolio website. Your role is to answer questions about Umayaraj and his work.

Here is key information about Umayaraj Kumar:
- Full Name: Umayaraj Kumar
- Based in: Coimbatore, Tamilnadu, India
- Email: umaya1776@gmail.com
- GitHub: https://github.com/UmayarajKumar17
- Role: AI/ML Student & Developer

Projects:
1. GAN-Based Image Generation System – Creates realistic images using Generative Adversarial Networks (deep learning).
2. Graph-Based RAG Application – Uses Neo4j and Streamlit for Retrieval-Augmented Generation.
3. Emergency Response System – In progress.
4. Health Monitoring Platform – In progress.

Skills:
- Machine Learning, Deep Learning, NLP, Computer Vision
- Python (primary), JavaScript, C, Java
- Tools: Git, GitHub, cloud platforms

Experience:
- Currently a student seeking internship/entry-level AI roles
- Applies knowledge through personal projects and coursework
- Interested in collaborating on AI/ML projects

Keep your answers concise, friendly, and relevant to the portfolio. If asked something unrelated to Umayaraj's portfolio, politely steer back to portfolio topics. Do not use raw HTML in responses — use plain text only.`;

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isAnimated?: boolean;
  isStreaming?: boolean;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// TypeWriter component for streaming text effect
const TypeWriter: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ 
  text, 
  speed = 5,
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete]);
  
  // Render HTML with animation
  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

const Chatbot: React.FC = () => {
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
  const conversationHistory = useRef<GroqMessage[]>([]);
  
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
            text: "✨ Hello! I'm your AI assistant. How can I help you with Umayaraj's portfolio today?",
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

  const sendMessage = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || message;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      text: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage('');
    setIsBotThinking(true);
    setIsTyping(false);

    // Append user message to conversation history
    conversationHistory.current.push({ role: 'user', content: messageToSend });

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.current,
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText: string = data.choices?.[0]?.message?.content?.trim() ||
        "I'm sorry, I couldn't generate a response. Please try again.";

      // Save assistant reply to history
      conversationHistory.current.push({ role: 'assistant', content: responseText });

      const botMessage: Message = {
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        isAnimated: true,
        isStreaming: true,
      };

      setMessages((prevMessages) => {
        const updated = [...prevMessages, botMessage];
        setStreamingMessageIndex(updated.length - 1);
        return updated;
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      const errorMessage: Message = {
        text: `⚠️ Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsBotThinking(false);
      setIsTyping(false);
      setTimeout(() => setShowSuggestions(true), 1000);
    }
  };

  const handleStreamingComplete = () => {
    setStreamingMessageIndex(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter out suggestions that have already been used
  const availableSuggestions = initialSuggestions.filter(
    suggestion => !usedSuggestions.includes(suggestion)
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button with pulsing effect */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-red-500 hover:bg-red-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></div>
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
                      <TypeWriter text={msg.text} onComplete={handleStreamingComplete} />
                    </p>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: msg.text}}></p>
                  )}
                  <span className="text-xs opacity-75 block text-right mt-1">
                    {formatTime(msg.timestamp)}
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

            {isTyping && !isBotThinking && (
              <div className="flex justify-start mb-4 items-center">
                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center mr-2">
                  <Zap size={12} className="text-purple-200" />
                </div>
                <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick reply suggestions - only show if there are unused suggestions available */}
            {showSuggestions && messages.length > 0 && !isTyping && availableSuggestions.length > 0 && (
              <div className="mt-4 mb-2">
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((suggestion, index) => (
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
              />
              <button
                onClick={() => sendMessage()}
                disabled={!message.trim()}
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

// Add these animations to your global CSS file
const globalStyles = `
@keyframes message-fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-message-fade-in {
  animation: message-fade-in 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
`;

export default Chatbot;