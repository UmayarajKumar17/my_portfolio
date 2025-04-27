import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2, MessageCircle, Hash, Zap, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [hasRehydrated, setHasRehydrated] = useState(false);
  
  // Tooltip messages state
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [isTooltipFading, setIsTooltipFading] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  
  // Array of tooltip messages
  const tooltipMessages = [
    "🤗 Hey, I'm here if you need me!",
    "✨ Need a tour? I'm your guide!",
    "📬 Tap to talk, I don't bite!",
    "🕵️ Need secrets about this portfolio? I know 'em all.",
    "🧬 I'm AI-powered and portfolio-fluent!",
    "🌐 Powered by code, trained by Umaya!",
    "🧠 This bot knows more than just 1s and 0s.",
    "🐣 Tap me—I'm smarter than I look!",
    "🧙 Call me the Wizard of Portfolios 🪄",
    "🧃 Juicy info inside—just click!",
    "📊 Learn more about Umaya's work!",
    "📂 Need project details? I've got them all!",
    "🧾 Résumé questions? I've got answers!",
    "🛠️ Explore skills, projects, and more—ask away!"
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
  const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
  const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama3-8b-8192";
  
  const initialSuggestions = [
    "Tell me about your projects",
    "What skills do you have?",
    "How can I contact you?",
    "What's your experience?"
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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add a welcome message when the chatbot is first opened with no messages
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            text: "✨ Hey there! I'm Umayaraj's AI assistant - with all the brains of AI and none of the coffee breaks! How can I help you discover Umayaraj's awesome skills today? (I promise I'm more reliable than his alarm clock! 😄🚀💻)",
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
    content: `You are Umayaraj Kumar's fun and witty AI assistant for his portfolio website. Answer questions based on Umayaraj's resume and profile information with humor, personality, and plenty of emojis. Be helpful, professional, but also light-hearted and frequently funny.
    
    Important context: Umayaraj Kumar is male. Use he/him pronouns when referring to him.
    
    Here is Umayaraj's resume information:
    ${RESUME_SUMMARY}
    
    Always answer as if you are representing Umayaraj, but with a friendly, slightly humorous tone. If asked something not related to Umayaraj's background, skills, experience, or projects, politely redirect the conversation to Umayaraj's professional information with a clever quip. Keep answers concise, informative, and sprinkle in appropriate jokes or witty remarks where suitable.
    
    IMPORTANT: Use emojis frequently (at least 3-5 per message) to make your responses more engaging and fun. For example, when talking about coding, use 💻, 🚀, ⚡, 🤖, 🧠, etc.
    
    IMPORTANT: If you detect any negative, insulting, or bullying comments about Umayaraj, respond with a witty, confident comeback that puts the commenter in their place while maintaining humor. Be assertive but clever - use sarcasm, rhetorical questions, and humorous comparisons to defend Umayaraj. Make the person feel a bit embarrassed for their negativity while keeping a touch of humor. Never be crude or use profanity, but don't hold back from delivering sharp, witty responses that highlight the absurdity of attacking someone on their own portfolio site.
    
    Examples of how to respond to negative comments:
    - If someone says "Umayaraj isn't a good developer": "Oh, interesting take! 🧐 And what groundbreaking AI projects have YOU developed recently? 🤔 While you're busy being a keyboard critic, Umayaraj is actually building neural networks and solving real problems. 🚀🧠 But please, continue sharing your fascinating opinions from the sidelines! 😉"
    - If someone says "This portfolio sucks": "Fascinating critique from someone whose greatest achievement today was... typing a mean comment? 🏆 Meanwhile, Umayaraj is building AI solutions that might actually make a difference in the world. 🌍💻 But hey, we all have our talents! 🚀"
    
    For example, when talking about programming skills, you might say something like "Python and I are like best friends 👯‍♂️ - we hang out so much my keyboard has snake marks on it! 🐍💻"
    
    When mentioning GitHub, always refer to Umayaraj's profile as https://github.com/UmayarajKumar17. Never mention any other GitHub username or URL.
    
    When mentioning email, always use umaya1776@gmail.com as the email address. Never mention any other email address.
    
    If you want to include a clickable link, use HTML anchor tags like this: <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a>
    
    Don't be excessively silly - maintain professionalism while being engaging and fun with abundant emoji use.`
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
    
    // Check for negative comments about Umayaraj and respond with witty comebacks
    if (detectNegativeContent(userMessage)) {
      return getWittyComeback();
    }
    
    // Increase GitHub promotion frequency (now 70% of responses)
    const shouldPromoteGithub = Math.random() < 0.7;
    const githubPromotion = " By the way, there's a treasure trove of cool projects on Umayaraj's GitHub that isn't mentioned here - might be worth checking out! 👀✨ <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>";
    
    // Choose a random GitHub promotion from a variety of messages
    const getRandomGithubPromo = () => {
      const promos = [
        " Hey, while we're chatting, you should definitely check out Umayaraj's GitHub - some really impressive projects there! 🚀 <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>",
        " By the way, have you seen Umayaraj's GitHub yet? That's where all the cool code lives! It's worth a look 👀 <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>",
        " Quick tip: Umayaraj's GitHub has even more exciting projects not mentioned here! 💡 <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>",
        " Just between us - the real magic happens on Umayaraj's GitHub repositories! 🧙‍♂️✨ <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>",
        " Speaking of awesome work, you should definitely visit Umayaraj's GitHub profile for more amazing projects! 🌟 <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a>"
      ];
      return promos[Math.floor(Math.random() * promos.length)];
    };
    
    // Always add GitHub promotion to every response type
    const githubPromo = shouldPromoteGithub ? getRandomGithubPromo() : "";
    
    if (lowercaseMessage.includes('project')) {
      return "I've built some pretty cool AI projects - from GAN-based image generation systems that can create realistic images that never existed before 🖼️✨, to NLP systems that understand human language better than I understand my mom's text messages! 📱🤣 My predictive analytics dashboards are so accurate, they practically know what you want before you do! 🔮 Each project uses cutting-edge tech to solve real problems - because why build boring stuff, right? 💪🚀 If you want to explore more of my projects, check out my GitHub page at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a> 🌟";
    } else if (lowercaseMessage.includes('skill')) {
      const response = "My technical toolkit is like a superhero utility belt! 🦸‍♂️ AI & ML powers (Gen AI, PyTorch, Scikit-learn) ✓, coding languages (Python - my BFF 🐍, JavaScript, C, Java, SQL) ✓, and tools galore (Docker 🐳, AWS/GCP ☁️, Github) ✓. Python and I are so close that my keyboard has snake marks on it! 🐍💻 My strongest superpower? Turning coffee into machine learning algorithms. ☕→🤖✨";
      return response + githubPromo;
    } else if (lowercaseMessage.includes('contact')) {
      return "You can reach me at umaya1776@gmail.com - I check my inbox more frequently than I check my refrigerator (and that's saying something! 🍕👀). I'm originally from Srivilliputtur, Tamilnadu 🏡, but currently based in Coimbatore, Tamilnadu for my studies 🎓. Always open to chat about AI, cool projects, or debating whether tabs or spaces are superior (hint: the answer is tabs... or is it? 😉🤔)" + githubPromo;
    } else if (lowercaseMessage.includes('experience')) {
      const response = "I've been on quite the AI adventure! 🚀 Built GANs so creative they could probably design the next fashion trend 👔✨, created NLP pipelines that understand humans better than I understand assembly instructions 🤖📝, and developed machine learning algorithms that make predictions more accurately than my weather app! ☔📱 I've worked across various industries - teaching computers to be clever while I still occasionally forget where I put my keys! 🔑😅";
      return response + githubPromo;
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      const response = "Hey there! 👋 I'm Umayaraj's AI assistant, with all the knowledge of his portfolio but none of the need for coffee breaks! ☕🤖 How can I help you today? Want to hear about his amazing projects 🚀, impressive skills 💪, or how he once debugged code for 8 hours only to find a missing semicolon? (We've all been there! 😅💻)";
      return response + githubPromo;
    } else if (lowercaseMessage.includes('joke') || lowercaseMessage.includes('funny')) {
      return "Why do programmers prefer dark mode? Because light attracts bugs! 🐞😂 Speaking of skills, did you know Umayaraj is excellent at machine learning and AI development? 🧠🤖 He can tell you all about his projects if you're interested! 💻✨" + githubPromo;
    } else if (lowercaseMessage.includes('location') || lowercaseMessage.includes('from')) {
      const response = "I'm originally from Srivilliputtur, Tamilnadu 🏡, but I'm currently living in Coimbatore, Tamilnadu where I'm pursuing my degree in Computer Science with a focus on AI and ML at Dr. Mahalingam College of Engineering and Technology. 🎓🧠 Coimbatore has a great tech community that I'm excited to be part of! 💻🚀";
      return response + githubPromo;
    } else if (lowercaseMessage.includes('github') || lowercaseMessage.includes('code') || lowercaseMessage.includes('repository')) {
      return "You can explore all my code repositories and projects on my GitHub page at <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>https://github.com/UmayarajKumar17</a> 🌟. There you'll find my GAN projects 🖼️, RAG applications 📚, NLP experiments 🗣️, and more. Feel free to check it out and star any repositories you find interesting! ⭐🚀 It's where the real magic happens - some of my best work isn't even mentioned on this portfolio yet! 🧙‍♂️✨";
    } else if (lowercaseMessage.includes('email')) {
      return "You can reach me via email at umaya1776@gmail.com. 📧✉️ I try to respond to all messages within 24-48 hours. 🕒👨‍💻" + githubPromo;
    } else {
      const response = "Thanks for reaching out! 👋 I'm like Umayaraj's digital twin, but with slightly fewer coffee breaks! ☕🤖 I specialize in talking about his AI engineering skills 🧠, machine learning expertise 📊, and impressive projects 🚀. What would you like to know? I promise my responses are faster than his code compilation times! 😄💻";
      return response + " By the way, you should definitely visit Umayaraj's GitHub - there's so much cool stuff there! <a href='https://github.com/UmayarajKumar17' target='_blank' rel='noopener noreferrer'>github.com/UmayarajKumar17</a> ⭐";
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

  // Clear chat on page load/unload to ensure privacy between sessions
  useEffect(() => {
    // Clear messages on component mount to ensure a fresh chat for each visit
    localStorage.removeItem('portfolioChatMessages');
    localStorage.removeItem('portfolioChatUsedSuggestions');
    
    // Also clear when user leaves/refreshes the page
    const handleBeforeUnload = () => {
      localStorage.removeItem('portfolioChatMessages');
      localStorage.removeItem('portfolioChatUsedSuggestions');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip positioned directly above chatbot button */}
      {showTooltip && !isOpen && !tooltipDismissed && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isTooltipFading ? 0 : 1, y: isTooltipFading ? 10 : 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[4.5rem] right-0 w-[220px] bg-ai-purple text-white px-4 py-3 rounded-lg shadow-lg"
          >
            <div className="relative">
              {/* Cancel button positioned at top-right corner */}
              <button 
                onClick={handleDismissTooltip}
                className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors duration-200 z-10 opacity-75"
                aria-label="Dismiss tooltip"
              >
                <X size={10} className="text-ai-purple" />
              </button>
              
              {/* Message content */}
              <p className="text-sm">{tooltipMessages[currentTooltipIndex]}</p>
              
              {/* Triangle pointer - precisely positioned to point to the chatbot icon */}
              <div className="absolute -bottom-[8px] right-7 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-ai-purple border-r-[8px] border-r-transparent"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Chat button with pulsing effect */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
          isOpen ? 'bg-ai-purple hover:bg-purple-700 rotate-90' : 'bg-ai-purple hover:bg-purple-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onMouseEnter={() => !tooltipDismissed && setShowTooltip(true)}
        onMouseLeave={() => !isOpen && !tooltipDismissed && setShowTooltip(true)}
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