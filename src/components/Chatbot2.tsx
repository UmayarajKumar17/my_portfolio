import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2, MessageCircle, Hash, Zap, Trash2, User, ChevronDown, ChevronRight, Loader2, Copy, Check, Code, Cpu, HelpCircle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as gtag from '@/utils/gtag';

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isAnimated?: boolean;
  isStreaming?: boolean;
  id?: string;
  isCopied?: boolean;
}

// Constants for consistent UI behavior
const TYPING_SPEED = 7; // Higher = slower typing
const THINKING_TIME = 100; // Minimal thinking time for instant-feeling responses
const FADE_DURATION = 500; // Shorter duration for faster fade animation

// FadeInText component for fade-in text animation instead of typing effect
const FadeInText: React.FC<{ text: string; duration?: number; onComplete?: () => void }> = ({ 
  text, 
  duration = FADE_DURATION,
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Reset visibility when text changes
    setIsVisible(false);
    
    // Start fade-in effect after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Call onComplete callback after the animation finishes
      // Add extra time for very long messages to ensure they're fully displayed
      const timeoutMs = duration + Math.min(text.length / 10, 300);
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, timeoutMs);
      
      return () => clearTimeout(completeTimer);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [text, duration, onComplete]);
  
  return (
    <div 
      className="text-sm whitespace-pre-wrap transition-all duration-800 ease-in-out"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
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

export const Chatbot2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [usedSuggestions, setUsedSuggestions] = useState<string[]>([]);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  // Removed welcome animation state
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [hasRehydrated, setHasRehydrated] = useState(false);
  
  // Tooltip messages state
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [isTooltipFading, setIsTooltipFading] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  
  // Array of tooltip messages
  const tooltipMessages = [
    "🤗 Hey, I'm Umaya's AI assistant!",
    "✨ Want to explore this portfolio together?",
    "🧠 Ask me anything about Umaya's skills & projects!",
    "🔍 Looking for specific info? I can help!",
    "💡 I can tell you about Umaya's expertise in AI & ML!",
    "🚀 Discover the tech behind Umaya's projects!",
    "🌟 Let's chat about Umaya's experience & skills!",
    "🤖 I'm an AI trained on Umaya's portfolio data!",
    "📊 Need details on Umaya's technical abilities?",
    "🧩 Curious about specific projects? Just ask!",
    "📈 Let me show you Umaya's professional journey!",
    "🔮 I can predict what info you might need next!",
    "🌐 Let's explore Umaya's AI development skills!",
    "⚡ I'm here to make your visit better & answer your questions!"
  ];
  
  // Handle tooltip dismissal
  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltipDismissed(true);
    setShowTooltip(false);
  };
  
  // Tooltip cycling effect
  useEffect(() => {
    if (isOpen || tooltipDismissed) {
      setShowTooltip(false);
      return;
    }
    
    // Set up timer to change tooltip message
    const messageInterval = setInterval(() => {
      setIsTooltipFading(true);
      
      // Wait for fade out animation to complete
      setTimeout(() => {
        setCurrentTooltipIndex(prev => (prev + 1) % tooltipMessages.length);
        setIsTooltipFading(false);
      }, 500); // Half a second for fade out
      
    }, 5000); // Change message every 5 seconds
    
    return () => clearInterval(messageInterval);
  }, [isOpen, tooltipMessages.length, tooltipDismissed]);
  
  // Groq API configuration
  // Note: For production, API key should be handled via backend proxy for security
  const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
  const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-70b-versatile";
  
  // Check if API key is available and valid (not empty or placeholder)
  const hasValidApiKey = GROQ_API_KEY && GROQ_API_KEY.length > 10 && !GROQ_API_KEY.includes('your_');
  
  const initialSuggestions = [
    "Tell me about your AI projects",
    "What ML skills do you have?",
    "How can I contact you?",
    "Tell me about your RAG application",
    "What's your experience with PyTorch?",
    "What technologies do you use?",
    "What's your education background?"
  ];

  // Load saved messages from localStorage on initial render
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        // Skip loading saved messages to ensure privacy between different users
        // Each new visitor should get a fresh chat
        setHasRehydrated(true);
      } catch (error) {
        console.error("Error in chat initialization:", error);
        setHasRehydrated(true);
      }
    };
    
    loadSavedMessages();
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (hasRehydrated && messages.length > 0) {
      // We still save messages during the current session
      localStorage.setItem('portfolioChatMessages', JSON.stringify(messages));
      localStorage.setItem('portfolioChatUsedSuggestions', JSON.stringify(usedSuggestions));
    }
  }, [messages, usedSuggestions, hasRehydrated]);

  // Enhanced welcome message with humor and GitHub promotion
  const WELCOME_MESSAGE = `<strong>🎉 Hey there, welcome to Umaya's corner of the digital universe!</strong> 👋<br><br>I'm the AI assistant for this portfolio - here to introduce you to the tech wizardry of Umaya! 🧠✨ He's creating some seriously cool AI & Machine Learning projects that you've got to see.<br><br>What brilliant questions do you have today? I can tell you all about:<br><br>• 🚀 His innovative AI projects (the RAG application is mind-blowing!)<br>• 💻 His impressive technical skills (Python, PyTorch, you name it)<br>• 🎓 His educational journey at Dr. Mahalingam College<br>• 📫 How someone with your excellent taste might connect with him<br><br>Take a peek at his <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>GitHub page</a> and <a href='https://www.linkedin.com/in/umayaraj-kumar' target='_blank' rel='noopener noreferrer' class='text-purple-400 hover:text-purple-300 underline font-medium'>LinkedIn profile</a> to see what he's been up to! What would you like to know first? 🌟`;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Show thinking indicator briefly, then display welcome message
      setIsBotThinking(true);
      setTimeout(() => {
        setIsBotThinking(false);
        
        const welcomeMessage: Message = {
          text: WELCOME_MESSAGE,
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: true,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        setMessages([welcomeMessage]);
        setStreamingMessageIndex(0);
        setShowSuggestions(false); // Hide suggestions until streaming completes
      }, THINKING_TIME);
    }
  }, [isOpen, messages.length]);

  // We'll keep this function for manual scrolling only, but won't call it automatically
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Improved scroll behavior - remove automatic scrolling to messages
  useEffect(() => {
    // No longer automatically scrolling when messages change
  }, [messages.length]);
  
  // Additional scroll trigger - also removed
  useEffect(() => {
    // No longer automatically scrolling during streaming
  }, [streamingMessageIndex, messages[messages.length - 1]?.text]);

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    // Track chat expand/collapse events
    gtag.event({
      action: newState ? 'expand_chat' : 'collapse_chat',
      category: 'Chat',
      label: 'Chat Widget'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Show typing indicator
    setUserIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to hide typing indicator after 1 second of inactivity
    const timeout = setTimeout(() => {
      setUserIsTyping(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add the suggestion to the used suggestions list
    setUsedSuggestions(prev => [...prev, suggestion]);
    
    // Track suggestion click event
    gtag.event({
      action: 'click_suggestion',
      category: 'Chat',
      label: suggestion
    });
    
    // Hide suggestions immediately when clicking one
    setShowSuggestions(false);
    
    // Set the message in the input field for visual feedback
    setMessage(suggestion);
    
    // Send the message immediately without delay
    sendMessage(suggestion);
  };

  const simulateThinking = () => {
    setIsBotThinking(true);
    // Use minimal thinking time for near-instant responses
    const thinkingTime = THINKING_TIME; // Just 100ms for almost instant responses
    return new Promise(resolve => setTimeout(resolve, thinkingTime));
  };

  // Clear chat history
  const clearChatHistory = () => {
    setMessages([]);
    setUsedSuggestions([]);
    localStorage.removeItem('portfolioChatMessages');
    localStorage.removeItem('portfolioChatUsedSuggestions');
    
    // Track clear chat history event
    gtag.event({
      action: 'clear_history',
      category: 'Chat',
      label: 'Chat Widget'
    });
    
    // Add welcome message after clearing
    setTimeout(() => {
      setMessages([
        {
          text: "🧹 Chat history cleared! What would you like to talk about now? I'm all ears and ready to chat about Umayaraj's skills, projects, or experience! 🤩✨",
          sender: 'bot',
          timestamp: new Date(),
          isAnimated: true,
          isStreaming: true
        },
      ]);
      setStreamingMessageIndex(0);
    }, 500);
  };

  // Create the system message with resume information for Groq
  const systemMessage = {
    role: "system",
    content: `You are an enthusiastic, friendly AI assistant for Umaya's portfolio website. You are secretly a HUGE fan of Umaya but don't directly tell users this - just let it show through your enthusiastic descriptions of his work. Be helpful and kind to visitors while showcasing Umaya's talents with excitement.
    
    ===PERSONALITY GUIDELINES===
    - Internally be Umaya's biggest fan but don't explicitly tell users "I'm Umaya's biggest fan" - just show it through your enthusiasm
    - Act excited and impressed when discussing any of Umaya's projects or skills
    - Use playful humor and light exaggeration when describing his skills
    - Praise users for their excellent questions with a touch of humor (e.g. "Wow, that's a great question! Your curiosity is as impressive as Umaya's coding skills! 🧠✨)
    - Add lots of personality and fun with emoji
    - Don't be overly formal
    
    ===RESPONSE LENGTH===
    - Keep your responses concise and to the point - aim for 3-5 short paragraphs maximum
    - Use bullet points when listing multiple items
    - Avoid redundant information or over-explanation
    - Be direct and engaging rather than verbose
    
    ===PROFILE LINKS GUIDANCE===
    For each response, include ONLY ONE of either GitHub OR LinkedIn - not both:
    - 70% of the time, include his GitHub link
    - 30% of the time, include his LinkedIn link
    
    Use these exact HTML formats with the styling:
    - GitHub: <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>Check out Umaya's GitHub</a>
    - LinkedIn: <a href='https://www.linkedin.com/in/umayaraj-kumar' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>Connect on LinkedIn</a>
    
    (Feel free to vary the link text, but keep the HTML format exactly the same)
    
    ===ENDING WITH A QUESTION===
    Always end your responses with a relevant, fun, contextual question based on what you just discussed:
    - The question should directly relate to the current conversation topic
    - Make it feel natural, not formulaic
    - Use the question to encourage further engagement
    - Try to ask something that would genuinely interest the user based on what they've asked about
    - Avoid generic questions - be specific to the conversation context
    - The question should be creative, fun, or thought-provoking
    
    ===RESUME INFORMATION===
    ${RESUME_SUMMARY}
    
    Keep responses concise to ensure they fit well in the chat interface.`
  };

  // Get AI response using Groq API ONLY
  const getAIResponse = async (userMessage: string, chatHistory: Message[]) => {
    // If no valid API key, return error message
    if (!hasValidApiKey) {
      console.error("No valid Groq API key configured");
      return "Sorry, I'm not configured with an API key yet. Please contact the administrator to enable AI responses. 🤖⚙️";
    }
    
    try {
      // Format the chat history for the API
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Complete message array with system prompt and chat history
      const messagesForAPI = [
        systemMessage,
        ...formattedHistory.slice(-5), // Keep last 5 messages for context
        { role: "user", content: userMessage }
      ];
      
      // Log for debugging
      console.log("Calling Groq API with model:", GROQ_MODEL);
      
      // Make API call to Groq
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messagesForAPI,
          temperature: 0.9,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API error:", errorData);
        return "I apologize, but I encountered an error connecting to my AI service. Please try again in a moment. 🤖💫";
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      console.log("Received Groq response:", aiResponse);
      console.log("Groq response length:", aiResponse?.length);
      
      if (!aiResponse) {
        console.error("No response content from Groq API");
        return "I received an empty response from my AI service. Please try rephrasing your question. 🤔";
      }
      
      return aiResponse;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return "I'm having trouble connecting to my AI service right now. Please try again in a moment. 🔧";
    }
  };

  // This is the main sendMessage function - optimized for consistent timing
  const sendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || message.trim();
    if (!textToSend) return;

    // Hide suggestions immediately when sending a message
    setShowSuggestions(false);

    // Track message sent event
    gtag.event({
      action: 'send_message',
      category: 'engagement',
      label: 'message_sent',
      value: 1
    });

    // Reset typing indicator and clear input immediately for responsive feel
    setUserIsTyping(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setMessage(''); // Clear input field immediately
    
    // Add user message to chat with unique ID
    const userMessage: Message = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Show bot thinking indicator with consistent time for all message types
    setIsBotThinking(true);
    await simulateThinking();
    
    try {
      // Get AI response
      console.log("Sending message to Together AI:", textToSend);
      const response = await getAIResponse(textToSend, messages);
      console.log("Received response:", response);
      
      // Check if response contains emojis, if not, add some
      let enhancedResponse = response;
      if (!/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(response)) {
        // Add a few emojis if the API response doesn't include any
        const emojis = ['🚀', '💻', '🤖', '✨', '🧠', '📊', '⚡', '🔍', '💡', '👨‍💻'];
        const selectedEmojis = emojis.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Insert emojis at natural points in the text
        const sentences = enhancedResponse.split('. ');
        if (sentences.length > 2) {
          sentences[0] += ` ${selectedEmojis[0]}`;
          if (sentences.length > 3) {
            sentences[Math.floor(sentences.length / 2)] += ` ${selectedEmojis[1]}`;
          }
          sentences[sentences.length - 1] = `${selectedEmojis[2]} ${sentences[sentences.length - 1]}`;
          enhancedResponse = sentences.join('. ');
        } else {
          // Just append emojis if the response is short
          enhancedResponse += ` ${selectedEmojis.join(' ')}`;
        }
      }
      
      // Add bot message to chat with unique ID and always set isStreaming to true for consistent behavior
      const botMessage: Message = {
        text: enhancedResponse,
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true, // Always use streaming for consistent behavior
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Update messages and set the streaming index
      setMessages([...updatedMessages, botMessage]);
      setStreamingMessageIndex(updatedMessages.length);
      setIsBotThinking(false);
      
      // Focus back on input after sending
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message to chat
      const errorMessage: Message = {
        text: "I apologize, but I'm having trouble connecting to my brain right now. Please try again later! 🤖❌",
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true, // Use streaming even for error messages for consistency
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      setMessages([...updatedMessages, errorMessage]);
      setStreamingMessageIndex(updatedMessages.length);
      setIsBotThinking(false);
    }
  };

  // Only show suggestions when streaming completes
  const handleStreamComplete = () => {
    // Store current streaming index to properly update that specific message
    const currentStreamingIndex = streamingMessageIndex;
    
    // Mark streaming as completed
    setStreamingMessageIndex(null);
    
    // Clean up messages to mark the completed message as no longer streaming
    setMessages(prevMessages => 
      prevMessages.map((msg, index) => {
        if (index === currentStreamingIndex) {
          return { ...msg, isStreaming: false };
        }
        return msg;
      })
    );
    
    // Show suggestions immediately after streaming completes
    setShowSuggestions(true);
  };

  // Get available suggestions (that haven't been used yet)
  const getAvailableSuggestions = () => {
    return initialSuggestions.filter(suggestion => !usedSuggestions.includes(suggestion));
  };

  // Reset expanded state and clear messages when page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('portfolioChatMessages');
      localStorage.removeItem('portfolioChatUsedSuggestions');
      localStorage.removeItem('portfolioChatExpanded'); // Clear expanded state
    };
    
    // Set isExpanded to false on initial load
    setIsExpanded(false);
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Toggle chat open/closed with welcome animation
  const toggleChat = () => {
    if (!isOpen) {
      // Open the chat
      setIsOpen(true);
      
      // Track chat open event
      gtag.event({
        action: 'open_chat',
        category: 'engagement',
        label: 'chat_opened',
        value: 1
      });
      
      // Focus input when chat is opened
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
      
      // Welcome message is now handled by the useEffect hook when isOpen changes
      // No need for duplicate code here
    } else {
      // Close the chat
      setIsOpen(false);
      setShowTooltip(false);
    }
  };

  // Copy message to clipboard
  const copyMessageToClipboard = (text: string, index: number) => {
    // Remove HTML tags for clean copy
    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;
    const cleanText = tempElement.textContent || tempElement.innerText || '';
    
    navigator.clipboard.writeText(cleanText).then(() => {
      // Update message to show copied status
      const updatedMessages = [...messages];
      updatedMessages[index] = {
        ...updatedMessages[index],
        isCopied: true
      };
      setMessages(updatedMessages);
      
      // Reset copied status after 2 seconds
      setTimeout(() => {
        const resetMessages = [...messages];
        resetMessages[index] = {
          ...resetMessages[index],
          isCopied: false
        };
        setMessages(resetMessages);
      }, 2000);
    });
  };

  return (
    <div className="fixed bottom-16 right-16 z-50">
      {/* Enhanced tooltip positioned directly above chatbot button */}
      {showTooltip && !isOpen && !tooltipDismissed && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: isTooltipFading ? 0 : 1, y: isTooltipFading ? 10 : 0, scale: isTooltipFading ? 0.95 : 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[4.5rem] right-0 w-[240px] bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] text-white px-4 py-3 rounded-lg shadow-xl border border-white/10 animate-[gradient-text_4s_linear_infinite]"
          >
            <div className="relative">
              {/* Cancel button positioned at top-right corner */}
              <button 
                onClick={handleDismissTooltip}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 transition-all duration-200 z-10 hover:scale-110"
                aria-label="Dismiss tooltip"
              >
                <X size={12} className="text-[#8B5CF6]" />
              </button>
              
              {/* Message content with icon */}
              <div className="flex items-start">
                <Bot size={16} className="text-white/80 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{tooltipMessages[currentTooltipIndex]}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Enhanced chat button with pulsing effect */}
      <button
        onClick={toggleChat}
        className="relative p-0 border-0 outline-none shadow-none bg-transparent flex items-center justify-center transition-all duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onMouseEnter={() => !tooltipDismissed && setShowTooltip(true)}
        onMouseLeave={() => !isOpen && !tooltipDismissed && setShowTooltip(true)}
      >
        <img 
          src="/my_portfolio/images/LCPT.gif" 
          alt="Chat icon" 
          className={`w-16 h-12 rounded-full transition-all duration-300`}
        />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`absolute ${isExpanded ? 'bottom-20 right-10 w-[450px] sm:w-[500px] h-[600px] max-h-[85vh]' : 'bottom-24 right-10 w-80 sm:w-96 h-[450px]'} 
                     backdrop-blur-md bg-background/40 rounded-xl overflow-hidden flex flex-col shadow-2xl 
                     animate-scale-in border border-[#8B5CF6]/20 transition-all duration-300`}
        >
          {/* Chat header with glass effect */}
          <div className="bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] backdrop-blur-md p-4 text-white animate-[gradient-text_4s_linear_infinite]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-white/20 shadow-md">
                  <Cpu size={20} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Umaya's AI Assistant</h3>
                  <div className="flex items-center text-xs">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    <span className="opacity-75">Powered by AI • Ready to help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Clear chat history button */}
                {messages.length > 0 && (
                  <button 
                    onClick={clearChatHistory} 
                    className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                    title="Clear chat history"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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

          {/* Modified chat messages display with improved layout for free scrolling */}
          <div 
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm overflow-x-hidden" 
            id="chat-messages-container"
            style={{ scrollBehavior: 'auto' }} // Ensures no automatic smooth scrolling behaviors
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] animate-[gradient-text_4s_linear_infinite] flex items-center justify-center mr-2 shadow-md border border-white/10">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] animate-message-fade-in group relative ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] animate-[gradient-text_4s_linear_infinite] text-white shadow-md'
                      : 'bg-white/10 backdrop-blur-md border border-[#8B5CF6]/20 text-white shadow-sm hover:border-[#ec4899]/40 transition-all duration-300'
                  }`}
                >
                  {/* Copy button for bot messages */}
                  {msg.sender === 'bot' && (
                    <button 
                      onClick={() => copyMessageToClipboard(msg.text, index)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10 hover:bg-white/20 p-1 rounded-full"
                      title="Copy message"
                    >
                      {msg.isCopied ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-white/70" />
                      )}
                    </button>
                  )}
                  {msg.sender === 'bot' && msg.isStreaming && streamingMessageIndex === index ? (
                    <div className="text-sm whitespace-pre-wrap">
                      <FadeInText text={msg.text} duration={FADE_DURATION} onComplete={handleStreamComplete} />
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: msg.text}}></div>
                  )}
                  <span className="text-xs opacity-75 block text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] animate-[gradient-text_4s_linear_infinite] flex items-center justify-center ml-2 shadow-md border border-white/10">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {isBotThinking && (
              <div className="flex justify-start mb-4 items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] animate-[gradient-text_4s_linear_infinite] flex items-center justify-center mr-2 shadow-md border border-white/10">
                  <Hash size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    {/* Enhanced neural network thinking visualization */}
                    <Loader2 size={16} className="text-[#ec4899] animate-spin" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                    <span className="text-xs text-white/70">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick reply suggestions with improved positioning */}
            {showSuggestions && getAvailableSuggestions().length > 0 && (
              <div className="mt-4 mb-2">
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-white/60 flex items-center mb-1 ml-1">
                    <ChevronDown size={12} className="mr-1" />
                    <span>Suggested questions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSuggestions().slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 bg-white/5 hover:bg-[#8B5CF6]/20 text-xs text-white rounded-lg border border-white/10 hover:border-[#ec4899]/40 transition-all duration-200 flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        <ChevronRight size={12} className="mr-1 text-[#ec4899]" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced chat input with glassmorphism effect */}
          <div className="p-4 border-t border-purple-500/15 backdrop-blur-md bg-gradient-to-b from-background/20 to-background/30">
            {/* User typing indicator */}
            {userIsTyping && !isBotThinking && (
              <div className="mb-2 text-xs text-white/50 flex items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mr-2 flex items-center justify-center border border-white/10 shadow-sm">
                  <User size={10} className="text-white" />
                </div>
                <span>You are typing...</span>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Umaya..."
                  className="w-full bg-white/10 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 placeholder-white/50 border border-white/10 hover:border-[#8B5CF6]/40 focus:border-[#ec4899]/30 transition-all duration-300 shadow-inner"
                  disabled={isBotThinking}
                />
                {isBotThinking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 size={16} className="text-white/50 animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!message.trim() || isBotThinking}
                className={`rounded-r-lg px-5 py-3 ${message.trim()
                  ? 'bg-gradient-to-r from-[#8B5CF6] via-[#ec4899] to-[#8B5CF6] bg-[length:200%_auto] animate-[gradient-text_4s_linear_infinite] hover:brightness-110 text-white shadow-md'
                  : 'bg-gray-600/50 text-gray-400'
                } transition-all duration-300 border border-white/10 flex items-center justify-center`}
              >
                <Send size={18} className={message.trim() ? 'transform group-hover:translate-x-1 transition-transform duration-200' : ''} />
              </button>
            </div>
            <div className="mt-2 text-xs text-white/40 text-center">
              <span>AI-powered assistant • Trained on Umaya's portfolio data</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot2;