import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Orbit, ArrowRightLeft, Compass } from 'lucide-react';

const LoadingScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Generate random node positions
  const generateNodes = () => {
    return Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
      size: Math.random() * 2 + 3, // 3-5px
      pulseDelay: Math.random() * 2,
      orbitSpeed: Math.random() > 0.5 ? 1 : -1,
    }));
  };

  const nodes = generateNodes();

  // Track mouse position for interactive effect
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

  // Calculate connections between nodes (only create connections for nodes that are nearby)
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only connect nodes that are within a certain distance
      if (distance < 30) {
        connections.push({
          id: `${i}-${j}`,
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          distance,
        });
      }
    }
  }

  // Loading progress states
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingTexts = [
    "Mapping Neural Pathways",
    "Structuring Dimensional Gateways",
    "Calibrating Quantum Resonance",
    "Preparing Holographic Interface"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % loadingTexts.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden" ref={containerRef}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Purple nebula background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-background to-background"></div>
          
          {/* Dynamic light source that follows mouse */}
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-ai-purple/5 blur-3xl"
            animate={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              scale: [1, 1.2, 1],
            }}
            transition={{
              left: { type: "spring", stiffness: 50, damping: 20 },
              top: { type: "spring", stiffness: 50, damping: 20 },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ transform: "translate(-50%, -50%)" }}
          />
        </div>
        
        {/* Constellation network */}
        <div className="absolute inset-0 overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Connection lines between nodes */}
            {connections.map((connection) => (
              <motion.line
                key={connection.id}
                x1={`${connection.x1}%`}
                y1={`${connection.y1}%`}
                x2={`${connection.x2}%`}
                y2={`${connection.y2}%`}
                stroke="rgba(147, 51, 234, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0.1, 0.3, 0.1],
                  strokeWidth: [1, connection.distance > 20 ? 0.5 : 1.5, 1]
                }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  strokeWidth: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            ))}
            
            {/* Interactive line that follows mouse */}
            {nodes.map((node, i) => {
              // Only connect a few nodes to the mouse for performance
              if (i % 3 !== 0) return null;
              
              const dx = node.x - mousePosition.x;
              const dy = node.y - mousePosition.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Only connect nodes within a certain distance to the mouse
              if (distance > 30) return null;
              
              return (
                <motion.line
                  key={`mouse-${i}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${mousePosition.x}%`}
                  y2={`${mousePosition.y}%`}
                  stroke="rgba(147, 51, 234, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 0.5,
                    strokeDashoffset: [0, -20]
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    strokeDashoffset: { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }
                  }}
                />
              );
            })}
          </svg>
          
          {/* Constellation nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-ai-purple"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
                boxShadow: [
                  '0 0 5px rgba(147, 51, 234, 0.3)',
                  '0 0 10px rgba(147, 51, 234, 0.6)',
                  '0 0 5px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                delay: node.pulseDelay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Small orbital particles around some nodes */}
          {nodes.filter((_, i) => i % 3 === 0).map((node, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute w-1 h-1 rounded-full bg-purple-300"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transformOrigin: 'center',
              }}
              animate={{
                rotate: [0, 360 * node.orbitSpeed]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                className="absolute w-1 h-1 rounded-full bg-purple-300"
                style={{
                  left: '0',
                  top: '-8px',
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Centered dimensional portal */}
        <div className="relative z-10">
          {/* Outer glow */}
          <motion.div 
            className="absolute -inset-12 bg-ai-purple/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Portal rings */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Rotating outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-ai-purple/30"
              style={{ 
                borderRadius: '50%',
                borderStyle: 'dashed',
                borderWidth: '1px'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Middle ring with gradient effect */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0) 70%)',
              }}
              animate={{ rotate: -180 }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner portal with pulsing effect */}
            <motion.div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-900/30 to-background border border-ai-purple/20 flex items-center justify-center overflow-hidden"
              animate={{
                boxShadow: [
                  'inset 0 0 15px rgba(147, 51, 234, 0.3)',
                  'inset 0 0 30px rgba(147, 51, 234, 0.6)',
                  'inset 0 0 15px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Crisscrossing energy beams */}
              <motion.div
                className="absolute w-full h-0.5 bg-ai-purple/30"
                animate={{ rotate: [0, 180] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute w-full h-0.5 bg-ai-purple/30"
                animate={{ rotate: [90, 270] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Central icon */}
              <motion.div
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  rotate: [0, 10, 0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <Compass className="w-8 h-8 text-ai-purple/90" />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 5px rgba(147, 51, 234, 0.5)',
                        '0 0 15px rgba(147, 51, 234, 0.8)',
                        '0 0 5px rgba(147, 51, 234, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Small floating particles within the portal */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-purple-300/70"
                  initial={{
                    x: Math.random() * 40 - 20,
                    y: Math.random() * 40 - 20,
                  }}
                  animate={{
                    x: Math.random() * 40 - 20,
                    y: Math.random() * 40 - 20,
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    x: { duration: 3 + i, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    y: { duration: 3 + i * 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Loading indicator and text */}
        <div className="mt-12 flex flex-col items-center">
          {/* Phase indicator */}
          <div className="flex space-x-1 mb-3">
            {[0, 1, 2, 3].map((phase) => (
              <motion.div
                key={`phase-${phase}`}
                className={`w-2 h-2 rounded-full ${phase <= loadingPhase ? 'bg-ai-purple' : 'bg-ai-purple/20'}`}
                animate={phase === loadingPhase ? {
                  scale: [1, 1.5, 1],
                } : {}}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Loading text with animation */}
          <motion.div
            className="h-6 overflow-hidden flex justify-center w-full"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: -loadingPhase * 24 }} // 24px is the height of each text item
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              {loadingTexts.map((text, i) => (
                <div key={i} className="h-6 flex items-center justify-center">
                  <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-ai-purple to-purple-300">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Animated progress bar */}
          <div className="mt-4 w-64 h-1 bg-purple-900/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-ai-purple"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%"] }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
          
          {/* Data transfer visualization */}
          <motion.div
            className="mt-3 flex items-center text-sm text-purple-300/70"
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowRightLeft className="w-3 h-3 mr-1" />
            <motion.span
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Synchronizing
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;