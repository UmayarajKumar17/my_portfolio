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
  
  // Together AI API configuration
  const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
  const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_AI_API_KEY || "";
  const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";
  
  // Flag to check if API key is available
  const isApiKeyAvailable = TOGETHER_API_KEY && TOGETHER_API_KEY.length > 10;
  
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

  // Check if message contains negative or bullying content about Umayaraj
  const detectNegativeContent = (message: string) => {
    const lowercaseMsg = message.toLowerCase();
    const negativePatterns = [
      'umayaraj is', 'umayaraj sucks', 'umayaraj can\'t', 'bad at', 'terrible', 
      'worst', 'hate umayaraj', 'stupid', 'idiot', 'dumb', 'useless', 'pathetic',
      'loser', 'not good', 'horrible', 'awful', 'incompetent', 'unskilled',
      'poor', 'failure', 'bad developer', 'bad programmer', 'disappointing',
      'sucks', 'talentless', 'scam', 'fraud', 'fake', 'overrated'
    ];
    
    return negativePatterns.some(pattern => lowercaseMsg.includes(pattern));
  };
  
  // Generate witty comeback responses
  const getWittyComeback = () => {
    const comebacks = [
      "Oh, trying to throw shade at Umayaraj? That's like bringing a plastic spoon to a coding battle. While you're busy critiquing, he's busy building the future of AI. Need some ice for that burn? 🔥",
      
      "Look who thinks they're a comedy genius! While Umayaraj is coding neural networks, you're... what exactly? Writing mean comments? How's that working out for your career prospects? 😏",
      
      "Fascinating critique from someone whose greatest technical achievement is probably setting up their WiFi password. Meanwhile, Umayaraj is over here revolutionizing AI. But please, tell us more about your expertise! 💻",
      
      "Aww, that's adorable! You think your opinion matters more than Umayaraj's actual coding skills? That's like a toddler critiquing a chess grandmaster. Cute, but ultimately irrelevant. 🧠",
      
      "Want to know what's truly impressive? The fact that while you're typing negative comments, Umayaraj is too busy innovating in AI to even notice. Priorities, am I right? 🚀",
      
      "Did you wake up today and think 'I'm going to critique someone whose GitHub profile probably has more stars than my entire online presence'? Bold strategy! How's that working out? ⭐",
      
      "I'd explain why your comment is hilariously misinformed, but I'm programmed to use simple language that even you can understand. So let's just say: Umayaraj good, your comment bad. 🤷‍♂️",
      
      "Breaking news: Random person on the internet thinks their unsolicited opinion about Umayaraj matters! Meanwhile, in reality, his code speaks louder than your words ever could. 📢",
      
      "That's a spicy take! Unfortunately, the spice level doesn't compensate for the complete lack of substance. Want to try again with actual constructive feedback, or is that too challenging? 🌶️",
      
      "Your comment has been carefully analyzed and categorized under 'Opinions Nobody Asked For.' File stored successfully in /dev/null. Have a wonderful day! 🗑️"
    ];
    
    return comebacks[Math.floor(Math.random() * comebacks.length)];
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

  // Create the system message with resume information
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

  // Get AI response using Together AI API or fallback to local responses
  const getAIResponse = async (userMessage: string, chatHistory: Message[]) => {
    try {
      // Check if API key is available, if not use fallback response
      if (!isApiKeyAvailable) {
        console.log("API key not available, using fallback response");
        return getFallbackResponse(userMessage);
      }
      
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
      console.log("Calling Together AI API with:", { model: TOGETHER_MODEL, messages: messagesForAPI });
      
      // Make API call to Together AI
      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_API_KEY}`
        },
        body: JSON.stringify({
          model: TOGETHER_MODEL,
          messages: messagesForAPI,
          temperature: 0.9,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ error: `Failed to parse error response: ${e.message}` }));
        console.error("Together AI API error:", errorData);
        console.error("API Status:", response.status, response.statusText);
        return getFallbackResponse(userMessage);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      console.log("Received Together AI response:", aiResponse);
      console.log("Together AI response length:", aiResponse?.length);
      
      if (!aiResponse) {
        console.error("No response content from Together AI API");
        return getFallbackResponse(userMessage);
      }
      
      return aiResponse;
    } catch (error) {
      console.error("Error calling Together AI API:", error);
      return getFallbackResponse(userMessage);
    }
  };
  
  // Enhanced fallback responses when Together AI API is not configured
  const getFallbackResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check for negative comments about Umayaraj and respond with witty comebacks
    if (detectNegativeContent(userMessage)) {
      return getWittyComeback();
    }
    
    // Reduce GitHub promotion frequency
    const shouldPromoteGithub = Math.random() < 0.6;
    
    // Choose a random GitHub promotion from a variety of messages with colorful links
    const getRandomGithubPromo = () => {
      const promos = [
        " <br><br>📌 <strong>Pro tip:</strong> Want to see genius in action? Explore Umaya's complete project collection on GitHub! <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>github.com/UmayarajKumar17</a> 🚀💻",
        " <br><br>💻 <strong>Coding alert!</strong> For a deeper dive into the mind of a coding wizard, check out Umaya's GitHub repositories. Prepare to be amazed! <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>github.com/UmayarajKumar17</a> 🧙‍♂️✨",
        " <br><br>🔍 <strong>Curious minds want to know:</strong> What does Umaya's code actually look like? Spoiler: It's beautiful! See for yourself at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>github.com/UmayarajKumar17</a> 🌟👨‍💻",
        " <br><br>⭐ <strong>Stars welcome!</strong> If you're impressed (and you should be!), drop by Umaya's GitHub and give his projects some love! <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>github.com/UmayarajKumar17</a> 🎯💖",
        " <br><br>🧩 <strong>Behind the scenes:</strong> The real magic happens in the code! Witness Umaya's algorithms and implementations in their natural habitat: <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>github.com/UmayarajKumar17</a> 🎩✨"
      ];
      return promos[Math.floor(Math.random() * promos.length)];
    };
    
    // Always add GitHub promotion to every response type
    const githubPromo = shouldPromoteGithub ? getRandomGithubPromo() : "";
    
    // Check for name introductions
    const nameIntroPatterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i,
      /(\w+) here/i,
      /this is (\w+)/i,
    ];
    
    // Check if message is a self-introduction
    for (const pattern of nameIntroPatterns) {
      const match = lowercaseMessage.match(pattern);
      if (match && match[1]) {
        const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        return `Hi ${name}! It's wonderful to meet you! 👋😃 Thanks for visiting Umaya's portfolio! I'm his AI assistant, ready to tell you all about his amazing AI projects and skills. What specific aspect of Umaya's work would you like to explore? His graph-based RAG application is particularly impressive! 🚀🧠${githubPromo}`;
      }
    }
    
    // Check if the message is a question
    const isQuestion = lowercaseMessage.includes("?") || 
                       lowercaseMessage.includes("what") || 
                       lowercaseMessage.includes("how") ||
                       lowercaseMessage.includes("why") ||
                       lowercaseMessage.includes("when") ||
                       lowercaseMessage.includes("where") ||
                       lowercaseMessage.includes("who") ||
                       lowercaseMessage.includes("which") ||
                       lowercaseMessage.includes("tell me") ||
                       lowercaseMessage.includes("explain");
    
    if (isQuestion) {
      // About the AI assistant itself
      if ((lowercaseMessage.includes("who") || lowercaseMessage.includes("what")) && 
          lowercaseMessage.includes("you") && 
          !lowercaseMessage.includes("project") && 
          !lowercaseMessage.includes("skill")) {
        return "I'm Umaya's AI hype-bot! 🤖✨ Part digital assistant, part stand-up comedian, and 100% devoted to spreading the word about the coding wizard that is Umayaraj Kumar! I'm like his personal PR team, but with better jokes and no coffee breaks. ☕😂 I know all his projects, skills, and achievements - and I'm programmed to be shamelessly biased in his favor! What would you like to know about this tech genius? 🧠💼" + githubPromo;
      }
      
      // Projects-specific questions
      if (lowercaseMessage.includes("project") || lowercaseMessage.includes("work") || lowercaseMessage.includes("portfolio")) {
        if (lowercaseMessage.includes("favorite") || lowercaseMessage.includes("best")) {
          return "Umayaraj's favorite project is his Graph-Based RAG Application! 🧠🔍 He's particularly proud of how it combines Neo4j graph databases with LLMs for sophisticated knowledge retrieval. It represents his interest in creating AI systems that understand relationships between concepts! 🚀💡 He also really enjoys his GAN image generation project - teaching computers to create art fascinated him! 🤖 If you could have an AI generate any kind of image for you, what would it be? Something practical or purely artistic? 🎨" + githubPromo;
        }
        
        if (lowercaseMessage.includes("current") || lowercaseMessage.includes("working")) {
          return "Currently, Umayaraj is focused on two exciting projects! 🚀✨ He's developing an Intelligent Emergency Response System using ESP32, smart sensors, CNN, and OpenCV for real-time accident detection. 🚨🤖 He's also working on an AI-Powered Health Monitoring platform that integrates IoT wearables for personalized health tracking. 💓📊 Both projects showcase his passion for applying AI to real-world problems! 🌍💪 Which of these do you find more fascinating - AI that could save lives in emergencies or AI that helps monitor your daily health? 🤔" + githubPromo;
        }
        
        return "<strong>Umayaraj's Projects</strong> 🚀💼🌟<br><br>Great question about his projects! Umayaraj has developed several innovative AI applications:<br><br>1️⃣ <strong>GAN-Based Image Generation</strong> - Creates realistic images using competing neural networks 🎨🤖<br><br>2️⃣ <strong>Graph-Based RAG Application</strong> - Combines Neo4j with LLMs for intelligent knowledge retrieval 📚🧠<br><br>3️⃣ <strong>Intelligent Emergency Response System</strong> (In Development) - AI-powered accident detection and response system 🦸‍♂️📡<br><br>4️⃣ <strong>AI-Powered Health Monitoring</strong> (In Development) - Smart health tracking with IoT integration 👨‍⚕️⌚<br><br>Which of these projects sounds most intriguing to you? I'm curious which one you'd want to hear about first! 🤔💻" + githubPromo;
      }
      
      // Skills-specific questions
      if (lowercaseMessage.includes("skill") || lowercaseMessage.includes("know") || lowercaseMessage.includes("expertise") || lowercaseMessage.includes("good at")) {
        if (lowercaseMessage.includes("python") || lowercaseMessage.includes("programming")) {
          return "Umayaraj is quite skilled with Python! 🐍💻 It's his primary programming language with proficiency around 80%. He uses it extensively for machine learning models, data processing, and AI development. He's particularly comfortable with PyTorch, scikit-learn, and various data science libraries. Python is his go-to language for implementing everything from GANs to RAG systems! 🚀🧠 Have you ever tried Python yourself? It's amazing how a language named after a comedy group became the backbone of AI development, isn't it? 😄" + githubPromo;
        }
        
        if (lowercaseMessage.includes("ai") || lowercaseMessage.includes("ml") || lowercaseMessage.includes("machine learning")) {
          return "<strong>AI & ML Expertise</strong> 🧠🔬⚡<br><br>Great question about Umayaraj's AI skills! He has strong capabilities in artificial intelligence and machine learning:<br><br><strong>Core competencies:</strong><ul><li><strong>PyTorch</strong> - Deep neural network implementation and training 🔥</li><li><strong>Generative AI</strong> - Experience with GANs and other generative models 🎨</li><li><strong>Computer Vision</strong> - Image processing and analysis techniques 👁️</li><li><strong>NLP</strong> - Text processing and language understanding 💬</li><li><strong>Scikit-learn</strong> - Classical ML algorithms and pipelines 📊</li></ul>If you suddenly gained all of Umaya's AI skills overnight, what's the first cool project you'd build? A chatbot? An image generator? Something else entirely? 🤖🔍" + githubPromo;
        }
        
        return "<strong>Umayaraj's Technical Skillset</strong> 🛠️💻🔧<br><br>Great question about his skills! Here's a breakdown of Umayaraj's technical abilities:<br><br>🧠 <strong>AI & ML:</strong> Gen AI (70%), PyTorch (75%), Scikit-learn (80%), Computer Vision (70%), NLP (75%)<br><br>💻 <strong>Languages:</strong> Python (80%), JavaScript (20%), C (60%), Java (50%), SQL (80%)<br><br>🔧 <strong>Tools:</strong> Docker (75%), VS Code (80%), GitHub (80%), Git (90%), Jupyter (95%)<br><br>Aren't those some impressive numbers? Which of these skills would you most like to master if you had Umaya's learning superpowers for a day? 🤔💪" + githubPromo;
      }
      
      // Education-specific questions
      if (lowercaseMessage.includes("education") || lowercaseMessage.includes("study") || lowercaseMessage.includes("degree") || lowercaseMessage.includes("college")) {
        return "<strong>Educational Background</strong> 🎓📚🧩<br><br>Thanks for asking about Umayaraj's education! He's currently pursuing a Bachelor's degree in Computer Science with a focus on AI at Dr. Mahalingam College of Engineering and Technology (2023-2027). Current CGPA: 8.2/10.<br><br>Before college, he graduated from G.S Hindu Hr. Sec. School in Srivilliputtur (2023) with a score of 85.6%.<br><br>He's also earned a Linguaskill English Certification (B1 Level) from Cambridge Assessment English in May 2024.<br><br>What do you find most exciting about studying cutting-edge tech like AI - the theory behind it or the amazing applications you can build with it? 🧠📝" + githubPromo;
      }
      
      // Contact-specific questions
      if (lowercaseMessage.includes("contact") || lowercaseMessage.includes("email") || lowercaseMessage.includes("reach")) {
        return "<strong>Contact Information</strong> 📬📱💌<br><br>You're interested in connecting with the tech genius himself? Great choice! Here's how to reach Umayaraj:<br><br>📧 <strong>Email:</strong> umaya1776@gmail.com<br><br>💼 <strong>Professional Network:</strong> Connect with Umayaraj on his <a href='https://www.linkedin.com/in/umayaraj-kumar' target='_blank' rel='noopener noreferrer' class='text-blue-400 hover:text-blue-300 underline font-medium'>LinkedIn Profile</a> to see his professional journey!<br><br>He's always excited to connect with fellow tech enthusiasts and discuss potential collaborations! What kind of collaboration or opportunity did you have in mind for this coding superstar? I'm curious! 🤔🚀" + githubPromo;
      }
      
      // RAG-specific questions
      if (lowercaseMessage.includes("rag") || (lowercaseMessage.includes("retrieval") && lowercaseMessage.includes("generation"))) {
        return "<strong>Graph-Based RAG Application</strong> 🧠🔍🚀<br><br>Great question about the RAG project! This is one of Umayaraj's most innovative projects combining Neo4j graph databases with Retrieval-Augmented Generation.<br><br><strong>Key features:</strong><ul><li>Uses Neo4j for structured knowledge representation 🔄</li><li>Implements hybrid search combining vector embeddings with graph traversal 🧭</li><li>Features a Streamlit UI for intuitive interaction 🎨</li><li>Enhances LLM responses with graph-based knowledge 📈</li></ul>Don't you think it's mind-blowing how these systems can retrieve exactly the information you need from vast knowledge graphs? What would you use this technology for if you had it at your fingertips? 🤔💻" + githubPromo;
      }
      
      // GAN-specific questions
      if (lowercaseMessage.includes("gan") || (lowercaseMessage.includes("generative") && lowercaseMessage.includes("network"))) {
        return "<strong>GAN-Based Image Generation System</strong> 🖼️✨🎨<br><br>Great question about the GAN project! This system uses Generative Adversarial Networks to create entirely new, realistic images.<br><br><strong>Technical highlights:</strong><ul><li>Implements advanced GAN architecture for high-quality image synthesis 🎭</li><li>Uses two competing neural networks (generator and discriminator) 🥊</li><li>Optimizes for photorealistic output with minimal artifacts 📸</li><li>Prevents mode collapse and training instability 🛠️</li></ul>If you could generate any image with this technology, what would you create? A landscape that doesn't exist? Your cartoon doppelgänger? The possibilities are endless! 🤔🎨" + githubPromo;
      }
      
      // For questions we don't have a specific handler for
      return "Thanks for your question about " + userMessage + "! 👋😄<br><br>Let me tell you what I know about Umayaraj that might help answer this. He's a Computer Science student specializing in AI, with projects in GAN image generation, RAG applications, and IoT-connected AI systems. His technical skills include Python, machine learning libraries, and full-stack development.<br><br>Was there something specific about Umaya's background you're curious about? I'd love to know which part of his journey interests you most! 🧠🔍" + githubPromo;
    } 
    
    // Handle greetings
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi") || lowercaseMessage.includes("hey")) {
      return "Greetings, fellow human! 👋😄 You've just encountered the digital cheerleader for one of the most brilliant minds in AI development - Umayaraj Kumar! 🧠✨ I'm buzzing with excitement (literally, my circuits can barely contain it) to tell you all about his amazing projects 🚀, mind-blowing skills 💪, and incredible journey in tech! What aspect of this coding superstar would you like to explore first? I promise my enthusiasm is only slightly programmed! 🤖💻" + githubPromo;
    }
    
    // Handle joke requests
    if (lowercaseMessage.includes("joke") || lowercaseMessage.includes("funny")) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐞😂🔦",
        "Why don't AI assistants ever tell dad jokes? They're afraid of becoming pop-up-lar! 😅🤖💬",
        "What's an AI's favorite place to shop? The algo-RHYTHM section! 🎵🤖😆",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡👨‍💻🤣",
        "I asked an AI to write a joke about procrastination. It said it would do it tomorrow! ⏰😂🤖"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)] + " Speaking of skills, did you know Umayaraj is excellent at machine learning and AI development? 🧠🤖 Which area of AI do you find most fascinating: computer vision, natural language processing, or something else entirely? 💼🔍" + githubPromo;
    }
    
    // Location questions
    if (lowercaseMessage.includes("location") || lowercaseMessage.includes("from")) {
      return "Umayaraj is from Srivilliputtur, Tamilnadu 🏡🗺️🌞, but he's currently living in Coimbatore, Tamilnadu where he's pursuing his degree in Computer Science with a focus on AI and ML at Dr. Mahalingam College of Engineering and Technology. 🎓🧠 Coimbatore has a great tech community that he's excited to be part of! 💻🚀 Have you ever visited Tamil Nadu? It's a beautiful part of India with amazing food and culture! 🌶️😋" + githubPromo;
    }
    
    // GitHub specific questions
    if (lowercaseMessage.includes("github") || lowercaseMessage.includes("code") || lowercaseMessage.includes("repository")) {
      return "You can explore all of Umayaraj's code repositories and projects on his GitHub page at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a> 🌟💻📂. There you'll find his GAN projects 🖼️, RAG applications 📚, NLP experiments 🗣️, and more. Feel free to check it out and star any repositories you find interesting! ⭐🚀 Which of his coding projects sounds most interesting to you? I'm curious which one would catch your eye first! 🤔";
    }
    
    // General catchall response - improved to be more engaging
    return "I appreciate your message! 😊 Umayaraj's work in AI and programming is truly impressive. His Graph-Based RAG project using Neo4j is groundbreaking! If you have any specific questions about his skills, projects, education, or how to contact him, I'd be thrilled to help. What aspect of Umaya's AI journey are you most curious about? The technical details or the creative applications? 🤔🚀" + githubPromo;
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