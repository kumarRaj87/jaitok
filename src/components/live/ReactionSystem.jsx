import React, { useState, useRef, useEffect } from 'react';

const ReactionSystem = ({ onSendReaction = () => {} }) => {
  // Available reactions with enhanced properties
  const reactions = [
    { emoji: "❤️", name: "heart", color: "bg-red-500", pulseColor: "bg-red-400", hoverColor: "hover:bg-red-600" },
    { emoji: "👍", name: "thumbs-up", color: "bg-blue-500", pulseColor: "bg-blue-400", hoverColor: "hover:bg-blue-600" },
    { emoji: "😂", name: "laugh", color: "bg-yellow-500", pulseColor: "bg-yellow-400", hoverColor: "hover:bg-yellow-600" },
    { emoji: "😮", name: "wow", color: "bg-purple-500", pulseColor: "bg-purple-400", hoverColor: "hover:bg-purple-600" },
    { emoji: "👏", name: "clap", color: "bg-green-500", pulseColor: "bg-green-400", hoverColor: "hover:bg-green-600" },
    { emoji: "🔥", name: "fire", color: "bg-orange-500", pulseColor: "bg-orange-400", hoverColor: "hover:bg-orange-600" },
  ];

  // State for reaction menu visibility
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  
  // State for active floating reactions
  const [activeReactions, setActiveReactions] = useState([]);
  
  // State for button pulse animation
  const [isPulsing, setIsPulsing] = useState(false);
  
  // State for tracking which reaction is being hovered
  const [hoveredReaction, setHoveredReaction] = useState(null);
  
  // Refs for outside click detection
  const reactionMenuRef = useRef(null);
  const reactionButtonRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionMenuRef.current && 
        !reactionMenuRef.current.contains(event.target) &&
        !reactionButtonRef.current.contains(event.target)
      ) {
        setShowReactionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear reactions after animation finishes
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeReactions.length > 0) {
        setActiveReactions(prev => prev.filter(reaction => 
          Date.now() - reaction.timestamp < reaction.duration
        ));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeReactions]);

  // Toggle reaction menu
  const toggleReactionMenu = () => {
    setShowReactionMenu(!showReactionMenu);
    
    // Pulse animation on button toggle
    if (!showReactionMenu) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }
  };

  // Handle sending a reaction
  const handleSendReaction = (reaction) => {
    // Create a burst of 3-7 instances of the same emoji
    const burstCount = Math.floor(Math.random() * 5) + 3;
    const newReactions = [];
    
    for (let i = 0; i < burstCount; i++) {
      // Add randomized properties for visual variety
      const duration = Math.random() * 3000 + 4000; // 4-7 seconds
      const newReaction = {
        id: Date.now() + i,
        emoji: reaction.emoji,
        name: reaction.name,
        color: reaction.color,
        timestamp: Date.now(),
        duration: duration,
        position: Math.random() * 80 + 10, // Random horizontal position (10-90%)
        speed: duration / 1000, // Animation speed in seconds (matches duration)
        size: Math.random() * 1.5 + 1.5, // Random size multiplier (1.5-3)
        rotation: Math.random() * 40 - 20, // Random rotation (-20 to 20 degrees)
        delay: i * 120, // Slight delay between each emoji in burst (staggered effect)
        curve: Math.random() * 40 - 20, // Random horizontal curve during float
        wobble: Math.random() > 0.5, // Whether emoji wobbles during animation
      };
      
      newReactions.push(newReaction);
    }
    
    setActiveReactions(prev => [...prev, ...newReactions]);
    setShowReactionMenu(false);
    
    // Optional callback for parent component integration
    onSendReaction(reaction);
  };

  // Generate reaction styles dynamically
  const getReactionStyle = (reaction) => {
    return {
      left: `${reaction.position}%`,
      bottom: '5%',
      fontSize: `${reaction.size}rem`,
      transform: `rotate(${reaction.rotation}deg)`,
      animationDelay: `${reaction.delay}ms`,
      animationDuration: `${reaction.speed}s`,
    };
  };

  return (
    <div className="relative z-50">
      {/* Main Reaction Button */}
      <button
        ref={reactionButtonRef}
        onClick={toggleReactionMenu}
        className={`relative bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isPulsing ? 'animate-pulse' : ''}`}
        aria-label="Send a reaction"
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping-slow"></div>
        <div className={`relative z-10 text-white transition-transform ${showReactionMenu ? 'rotate-0' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </button>
      
      {/* Reaction Menu Popup */}
      {showReactionMenu && (
        <div
          ref={reactionMenuRef}
          className="absolute bottom-16 right-0 flex p-2 gap-1 rounded-full bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl animate-menu-appear z-20"
          style={{ transformOrigin: 'bottom right' }}
        >
          {reactions.map((reaction, index) => (
            <button
              key={reaction.name}
              onClick={() => handleSendReaction(reaction)}
              onMouseEnter={() => setHoveredReaction(reaction.name)}
              onMouseLeave={() => setHoveredReaction(null)}
              className={`relative ${reaction.color} ${reaction.hoverColor} w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-125 ${
                hoveredReaction === reaction.name ? 'z-10 scale-110' : 'z-0'
              }`}
              style={{ 
                animationDelay: `${index * 50}ms`,
                boxShadow: '0 0 10px rgba(0,0,0,0.3)'
              }}
              aria-label={`Send ${reaction.name} reaction`}
            >
              {hoveredReaction === reaction.name && (
                <div className="absolute -top-8 whitespace-nowrap px-2 py-1 bg-gray-900 text-white text-xs rounded">
                  {reaction.name}
                </div>
              )}
              <span className="text-2xl transform hover:scale-110 transition-transform">{reaction.emoji}</span>
              {hoveredReaction === reaction.name && (
                <div className="absolute inset-0 rounded-full animate-ping-fast opacity-50" 
                  style={{ backgroundColor: `var(--${reaction.pulseColor.replace('bg-', '')})` }}></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Animated Reactions Container */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {activeReactions.map(reaction => (
          <div
            key={reaction.id}
            className={`absolute inline-block ${
              reaction.wobble ? 'animate-float-wobble' : 'animate-float-straight'
            }`}
            style={getReactionStyle(reaction)}
          >
            <span className="inline-block">{reaction.emoji}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full animate-ping-slow opacity-30 scale-110" 
                style={{ backgroundColor: `var(--${reaction.color.replace('bg-', '')})` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-straight {
          0% {
            transform: translateY(0) rotate(${Math.random() * 30 - 15}deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60vh) translateX(${Math.random() * 40 - 20}px) rotate(${Math.random() * 60 - 30}deg);
            opacity: 0;
          }
        }
        
        @keyframes float-wobble {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateY(-15vh) translateX(10px) rotate(10deg);
          }
          50% {
            transform: translateY(-30vh) translateX(-15px) rotate(-8deg);
          }
          75% {
            transform: translateY(-45vh) translateX(10px) rotate(12deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60vh) translateX(-5px) rotate(-5deg);
            opacity: 0;
          }
        }
        
        @keyframes menu-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes ping-fast {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-float-straight {
          animation: float-straight var(--duration, 5s) ease-out forwards;
        }
        
        .animate-float-wobble {
          animation: float-wobble var(--duration, 5s) ease-out forwards;
        }
        
        .animate-menu-appear {
          animation: menu-appear 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-fast {
          animation: ping-fast 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ReactionSystem;