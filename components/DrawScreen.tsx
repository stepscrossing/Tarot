import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ALL_CARDS } from '../constants';
import { TarotCard } from './TarotCard';
import { DeckCardState, DrawResult } from '../types';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  baseOpacity: number;
  color: string;
  duration: number;
  delay: number;
  hasGlow: boolean;
}

const DrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DeckCardState[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawResult[]>([]);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const autoRotateRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  
  // Star background state
  const [stars, setStars] = useState<Star[]>([]);

  // Responsive Radii and Sizes
  const [radii, setRadii] = useState({ x: 300, y: 80 });
  const [cardDim, setCardDim] = useState({ w: 100, h: 175 });

  // Initialize stars for background with more "Universe" feel
  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 150 }).map((_, i) => {
        // Randomize star types for depth
        const roll = Math.random();
        let size, baseOpacity, hasGlow, color;

        if (roll > 0.95) {
          // rare bright stars (Reduced opacity significantly)
          size = Math.random() * 2 + 1.5; 
          baseOpacity = Math.random() * 0.2 + 0.3; // 0.3-0.5
          hasGlow = true;
          const tintRoll = Math.random();
          color = tintRoll > 0.7 ? '#e0f2fe' : (tintRoll > 0.4 ? '#fef3c7' : '#ffffff'); 
        } else if (roll > 0.7) {
          // medium stars (Reduced opacity)
          size = Math.random() * 1.5 + 1;
          baseOpacity = Math.random() * 0.15 + 0.1; // 0.1-0.25
          hasGlow = false;
          color = '#ffffff';
        } else {
          // background dust (Very faint)
          size = Math.random() * 1 + 0.5;
          baseOpacity = Math.random() * 0.1 + 0.05; // 0.05-0.15
          hasGlow = false;
          color = '#ffffff';
        }

        return {
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          size,
          baseOpacity,
          color,
          duration: Math.random() * 4 + 4, // Slower duration
          delay: Math.random() * 5,
          hasGlow
        };
      });
    };
    setStars(generateStars());
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setRadii({
        x: isMobile ? window.innerWidth * 0.45 : 400,
        y: isMobile ? 50 : 100
      });
      setCardDim({
        w: isMobile ? 70 : 100,
        h: isMobile ? 122 : 175
      });
    };
    
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize deck
  useEffect(() => {
    // Shuffle and init
    const isMobile = window.innerWidth < 768;
    const cardCount = isMobile ? 56 : 78;
    const shuffled = [...ALL_CARDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, cardCount)
      .map((card, index) => ({
        id: `card-${index}`,
        definitionId: card.id,
        isReversed: Math.random() > 0.5,
        angle: (index / cardCount) * 360
      }));
    setDeck(shuffled);
  }, []);

  // Auto rotation
  useEffect(() => {
    const animate = () => {
      if (!isDragging.current && drawnCards.length < 3) {
        rotationRef.current += 0.05; // Speed of orbit
        setRotation(rotationRef.current);
      }
      autoRotateRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [drawnCards.length]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const delta = clientX - lastX.current;
    
    // Reverse logic: Drag left moves cards left (counter-clockwise)
    rotationRef.current -= delta * 0.2; 
    setRotation(rotationRef.current);
    lastX.current = clientX;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const handleCardClick = (cardState: DeckCardState) => {
    if (drawnCards.length >= 3) return;
    if (drawnCards.find(c => c.cardId === cardState.definitionId)) return;

    // Add to drawn cards
    const newResult: DrawResult = {
      cardId: cardState.definitionId,
      isReversed: cardState.isReversed,
      position: drawnCards.length
    };

    const newDrawn = [...drawnCards, newResult];
    setDrawnCards(newDrawn);

    // Remove from visible circle deck locally to avoid re-clicking
    setDeck(prev => prev.filter(c => c.id !== cardState.id));

    if (newDrawn.length === 3) {
      setTimeout(() => {
        navigate('/result', { state: { results: newDrawn } });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050508] overflow-hidden relative flex flex-col">
      {/* Custom Keyframes for Natural Twinkle - Reduced max opacity to 0.6 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .star-anim {
          animation: twinkle var(--twinkle-duration) ease-in-out infinite;
          animation-delay: var(--twinkle-delay);
        }
      `}</style>

      {/* Background Universe */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#1a1429] via-[#09090b] to-[#000000]"></div>
        
        {/* Dynamic Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full star-anim"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.baseOpacity,
              boxShadow: star.hasGlow ? `0 0 ${star.size}px ${star.color}` : 'none',
              '--twinkle-duration': `${star.duration}s`,
              '--twinkle-delay': `${star.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Return Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-serif tracking-widest uppercase text-sm">Home</span>
      </button>

      {/* Top Slots - Moved down (mt-24) to sit below the Back button */}
      <div className="mt-20 md:mt-24 w-full flex items-center justify-center gap-2 md:gap-8 pb-4 z-20 pointer-events-none">
        {[0, 1, 2].map((i) => {
          const result = drawnCards.find(r => r.position === i);
          const slotDim = {
            w: window.innerWidth < 768 ? 60 : 80,
            h: window.innerWidth < 768 ? 105 : 140
          };
          return (
            <div 
              key={i} 
              className="relative border border-gold/30 rounded-lg bg-surface/50 backdrop-blur-sm transition-all duration-500"
              style={{ 
                width: slotDim.w, 
                height: slotDim.h,
                borderColor: result ? '#d4af37' : 'rgba(212,175,55,0.3)' 
              }} 
            >
              <div className="absolute -top-6 left-0 w-full text-center text-gold/50 text-[10px] md:text-xs font-serif uppercase tracking-widest">
                {['Card 1', 'Card 2', 'Card 3'][i]}
              </div>
              {result && (
                <motion.div
                  layoutId={`card-${result.cardId}`}
                  className="w-full h-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <TarotCard 
                    width={slotDim.w} 
                    height={slotDim.h} 
                    isFlipped={false} // Keep face down until result
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Orbit Center - Adjusted position for mobile */}
      <div 
        className="flex-1 w-full relative flex items-center justify-center perspective-[1000px] overflow-hidden -translate-y-10 md:-translate-y-20"
        ref={containerRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* The "Center" - Glow removed per request, only faint orbit rings remain */}
        <div className="absolute z-10 pointer-events-none flex flex-col items-center justify-center">
             {/* Core glow removed */}
             
             {/* Subtle Orbital Rings */}
             <div className="w-48 h-48 rounded-full border border-gold/5 absolute animate-[spin_30s_linear_infinite] opacity-30"></div>
             <div className="w-80 h-80 rounded-full border border-dashed border-gold/5 absolute animate-[spin_60s_linear_infinite_reverse] opacity-20"></div>
        </div>

        {/* Orbiting Cards */}
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
          <AnimatePresence>
            {deck.map((card) => {
              // Calculate 3D Orbit Position
              const theta = ((card.angle + rotation) % 360) * (Math.PI / 180);
              
              // x = Horizontal, y = Depth (Vertical in 3D projection)
              const x = Math.cos(theta) * radii.x;
              const zDepth = Math.sin(theta) * radii.y; 
              
              // Project 3D zDepth to 2D y-axis for the "tilted ring" look
              // If y is positive (front), it's lower on screen.
              const y = zDepth; 

              // Scale based on "depth" (zDepth)
              // Front cards (positive zDepth) should be larger
              const scale = (zDepth + radii.y * 3) / (radii.y * 3.5); 
              
              // Opacity: Back cards fade out
              const opacity = scale < 0.7 ? 0.4 : 1; 
              
              // Z-Index: Front cards must be on top
              const zIndex = Math.floor(zDepth * 100);

              // Don't render cards far in back to save resources / improve aesthetics
              if (scale < 0.5) return null;

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.definitionId}`}
                  className="absolute cursor-pointer will-change-transform flex flex-col items-center justify-center"
                  style={{
                    x, // Horizontal position
                    y, // Vertical tilt position
                    zIndex,
                    opacity,
                    scale: scale, 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card);
                  }}
                  whileHover={{ 
                    scale: scale * 1.1,
                    y: y - 20,
                    zIndex: zIndex + 1000 // Ensure hovered card pops to very front
                  }}
                >
                  <TarotCard width={cardDim.w} height={cardDim.h} />
                  
                  {/* Reflection/Shadow for 3D grounding */}
                  <div 
                    className="absolute -bottom-4 w-[80%] h-2 bg-black/50 blur-sm rounded-full pointer-events-none" 
                    style={{ opacity: scale * 0.5 }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Guide Text */}
      <div className="absolute bottom-10 w-full text-center pointer-events-none z-30">
        <p className="text-gold/60 font-serif text-sm md:text-lg animate-pulse flex items-center justify-center gap-2">
          {drawnCards.length < 3 ? "The stars await. Select your destiny." : "Interpreting..."}
        </p>
      </div>
    </div>
  );
};

export default DrawScreen;