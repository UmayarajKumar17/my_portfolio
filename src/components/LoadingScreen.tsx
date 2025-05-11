import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Hexagon, ZapIcon, Scan, ShieldCheck, ArrowRightLeft } from 'lucide-react';

const LoadingScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  // Generate hexagons for the background grid
  const generateHexagons = () => {
    return Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10, // 10-40px
      rotation: Math.random() * 180,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2, // 2-5s
    }));
  };

  const hexagons = generateHexagons();

  // Generate data streams
  const generateDataStreams = () => {
    return Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      length: Math.random() * 100 + 50, // 50-150px
      angle: Math.random() * 360,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  };

  const dataStreams = generateDataStreams();

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Set default position for initial render
    setTimeout(() => {
      setMousePosition({ x: 50, y: 50 });
    }, 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Loading progress states with holographic verification concept
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingTexts = [
    "Initializing Holographic Interface",
    "Scanning System Parameters",
    "Validating Security Protocol",
    "Activating Neural Network"
  ];

  // Configure holographic icons for each phase
  const phaseIcons = [
    <Hexagon className="w-5 h-5 text-ai-purple" key="hexagon" />,
    <Scan className="w-5 h-5 text-ai-purple" key="scan" />,
    <ShieldCheck className="w-5 h-5 text-ai-purple" key="shield" />,
    <ZapIcon className="w-5 h-5 text-ai-purple" key="zap" />
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % loadingTexts.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  // Create animated code snippet array
  const [codeLines, setCodeLines] = useState([]);
  
  useEffect(() => {
    // Generate random code-like lines
    const generateCodeLine = () => {
      const length = Math.floor(Math.random() * 30) + 5;
      const symbols = '{}[]()<>.,;:+-*/=&|!?_$#@%^~`"\'\\';
      const indent = ' '.repeat(Math.floor(Math.random() * 8));
      let line = indent;
      
      // Add a chance for keywords
      const keywords = ['function', 'const', 'let', 'if', 'for', 'while', 'return', 'import', 'export', 'class', 'async', 'await'];
      
      if (Math.random() > 0.7) {
        line += keywords[Math.floor(Math.random() * keywords.length)] + ' ';
      }
      
      // Generate random characters for the line
      for (let i = 0; i < length; i++) {
        const rand = Math.random();
        if (rand < 0.3) {
          // Add a letter
          line += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        } else if (rand < 0.6) {
          // Add a symbol
          line += symbols[Math.floor(Math.random() * symbols.length)];
        } else {
          // Add a space
          line += ' ';
        }
      }
      
      return line;
    };
    
    // Create initial code lines
    const initialLines = Array.from({ length: 30 }, generateCodeLine);
    setCodeLines(initialLines);
    
    // Update code lines periodically
    const intervalId = setInterval(() => {
      setCodeLines(prev => {
        const newLines = [...prev];
        const indexToChange = Math.floor(Math.random() * newLines.length);
        newLines[indexToChange] = generateCodeLine();
        return newLines;
      });
    }, 300);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden" ref={containerRef}>
      {/* Holographic background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-background to-background"></div>
        
        {/* Hexagon grid layer */}
        <div className="absolute inset-0 overflow-hidden">
          {hexagons.map((hexagon, i) => (
            <motion.div
              key={`hex-${i}`}
              className="absolute border border-ai-purple/20"
              style={{
                left: `${hexagon.x}%`,
                top: `${hexagon.y}%`,
                width: `${hexagon.size}px`,
                height: `${hexagon.size}px`,
                transform: `translate(-50%, -50%) rotate(${hexagon.rotation}deg)`,
                opacity: 0.1,
              }}
              animate={{
                opacity: [0.05, 0.2, 0.05],
                scale: [1, 1.1, 1],
                borderColor: [
                  'rgba(147, 51, 234, 0.1)',
                  'rgba(147, 51, 234, 0.3)',
                  'rgba(147, 51, 234, 0.1)'
                ]
              }}
              transition={{
                duration: hexagon.duration,
                delay: hexagon.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Hexagon
                className="absolute inset-0 w-full h-full text-ai-purple/20"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Data stream effects */}
        <div className="absolute inset-0 overflow-hidden">
          {dataStreams.map((stream, i) => (
            <motion.div
              key={`stream-${i}`}
              className="absolute bg-gradient-to-r from-transparent via-ai-purple/40 to-transparent"
              style={{
                left: `${stream.x}%`,
                top: `${stream.y}%`,
                height: '1px',
                width: `${stream.length}px`,
                transform: `translate(-50%, -50%) rotate(${stream.angle}deg)`,
                opacity: stream.opacity,
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: stream.speed * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Interactive glow that follows mouse */}
        <motion.div 
          className="absolute w-96 h-96 rounded-full"
          animate={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            background: [
              'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
              'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
              'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(0, 0, 0, 0) 70%)'
            ]
          }}
          transition={{
            left: { type: "spring", stiffness: 50, damping: 20 },
            top: { type: "spring", stiffness: 50, damping: 20 },
            background: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
      
      {/* Central holographic interface */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-lg h-full max-h-[600px] flex flex-col items-center justify-center">
          {/* Holographic display window */}
          <div className="relative w-full h-[500px] border border-ai-purple/30 rounded-lg backdrop-blur-sm bg-black/20 overflow-hidden p-6">
            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ai-purple"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ai-purple"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ai-purple"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ai-purple"></div>
            
            {/* Scan line effect */}
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-ai-purple/50"
              animate={{
                top: ["0%", "100%", "0%"],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                top: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Top status bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-purple-900/50 via-ai-purple/30 to-purple-900/50 flex items-center px-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-ai-purple animate-pulse"></div>
                <span className="text-xs font-mono text-ai-purple">SYSTEM.BOOT</span>
              </div>
              <div className="ml-auto text-xs font-mono text-ai-purple/70">
                {new Date().toISOString().split('T')[0]}
              </div>
            </div>
            
            {/* Main content area with holographic code display */}
            <div className="h-full pt-10 pb-10 flex">
              {/* Left code display - animated lines of code */}
              <div className="w-1/2 overflow-hidden pr-2 opacity-70">
                <motion.div 
                  animate={{ y: [0, -1000] }} 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="font-mono text-[9px] text-ai-purple/90 leading-tight"
                >
                  {codeLines.map((line, i) => (
                    <div key={i} className="whitespace-nowrap">{line}</div>
                  ))}
                </motion.div>
              </div>
              
              {/* Right side - holographic visualization */}
              <div className="w-1/2 flex flex-col items-center justify-center pl-2 border-l border-ai-purple/20">
                {/* Holographic rotating elements */}
                <div className="relative w-40 h-40">
                  {/* Outer rotating ring */}
                  <motion.div
                    className="absolute w-full h-full rounded-full border border-ai-purple/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Dots on the ring */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={`dot-${i}`}
                        className="absolute w-2 h-2 rounded-full bg-ai-purple"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 45}deg) translateY(-20px) translateX(-1px)`,
                        }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ 
                          duration: 2, 
                          delay: i * 0.25, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Middle rotating ring with a different direction */}
                  <motion.div
                    className="absolute w-28 h-28 rounded-full border border-ai-purple/40 left-1/2 top-1/2"
                    style={{ transform: "translate(-50%, -50%)" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Central holographic element for current phase */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="relative flex items-center justify-center w-20 h-20 rounded-full"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(147, 51, 234, 0.3)',
                          '0 0 40px rgba(147, 51, 234, 0.6)',
                          '0 0 20px rgba(147, 51, 234, 0.3)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Animated phase icon */}
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={loadingPhase}
                          initial={{ scale: 0, opacity: 0, rotateY: -90 }}
                          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                          exit={{ scale: 0, opacity: 0, rotateY: 90 }}
                          transition={{ duration: 0.5 }}
                          className="text-ai-purple"
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity,
                              ease: "easeInOut" 
                            }}
                          >
                            {phaseIcons[loadingPhase]}
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
                
                {/* Loading status display */}
                <div className="mt-8 w-full">
                  <div className="flex justify-between mb-2">
                    <div className="text-xs text-ai-purple/70 font-mono">STATUS</div>
                    <div className="text-xs text-ai-purple/70 font-mono">
                      {loadingPhase + 1}/4
                    </div>
                  </div>
                  
                  {/* Loading progress indicators */}
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[0, 1, 2, 3].map((phase) => (
                      <motion.div
                        key={`phase-${phase}`}
                        className={`h-1 rounded-full ${phase <= loadingPhase ? 'bg-ai-purple' : 'bg-ai-purple/20'}`}
                        animate={phase === loadingPhase ? {
                          opacity: [0.7, 1, 0.7],
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Current process display */}
                  <motion.div
                    className="bg-black/30 border border-ai-purple/20 rounded p-2 font-mono"
                    animate={{ 
                      borderColor: [
                        'rgba(147, 51, 234, 0.2)',
                        'rgba(147, 51, 234, 0.5)',
                        'rgba(147, 51, 234, 0.2)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={loadingPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-ai-purple to-purple-300"
                      >
                        {loadingTexts[loadingPhase]}
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Animated progress bar */}
                    <motion.div
                      className="h-1 mt-2 bg-black/40 rounded-full overflow-hidden"
                      animate={{
                        boxShadow: [
                          'inset 0 0 5px rgba(147, 51, 234, 0.3)',
                          'inset 0 0 10px rgba(147, 51, 234, 0.6)',
                          'inset 0 0 5px rgba(147, 51, 234, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-ai-purple"
                        initial={{ width: "0%" }}
                        animate={{ width: ["0%", "100%"] }}
                        transition={{
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Bottom status bar */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-purple-900/50 via-ai-purple/30 to-purple-900/50 flex items-center px-3">
              <motion.div
                className="flex items-center text-xs font-mono text-ai-purple/80"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRightLeft className="w-3 h-3 mr-1" />
                <motion.span>
                  Processing data stream...
                </motion.span>
              </motion.div>
              
              <div className="ml-auto">
                <motion.div
                  className="text-xs font-mono text-ai-purple/70"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  SECURE CONNECTION
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;