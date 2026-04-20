import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TarotCardProps {
  isFlipped?: boolean;
  isReversed?: boolean;
  image?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  layoutId?: string;
  width?: number | string;
  height?: number | string;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  isFlipped = false,
  isReversed = false,
  image,
  onClick,
  className = '',
  style,
  layoutId,
  width = 150,
  height = 263, // Approx 0.57 ratio (RWS standard)
}) => {
  const [imgError, setImgError] = useState(false);
  // Simple check for string widths like "100%"
  const isSmall = typeof width === 'number' && width < 100;

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative cursor-pointer perspective-1000 ${className}`}
      style={{ width, height, ...style }}
      onClick={onClick}
      initial={false}
      animate={{ rotate: isReversed && isFlipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Card Back - Ornate Design */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-[#151515] shadow-xl overflow-hidden border border-[#8a6e18]"
          style={{ backfaceVisibility: 'hidden' }}
        >
            {/* Outer Gold Border */}
            <div className={`absolute ${isSmall ? 'inset-[2px]' : 'inset-1'} border-2 border-[#d4af37] rounded opacity-90`}></div>
            
            {/* Inner Decoration Frame */}
            <div className={`absolute ${isSmall ? 'inset-[5px]' : 'inset-3'} border border-[#d4af37]/40 rounded-sm flex items-center justify-center`}>
                {/* SVG Pattern */}
                <svg width="100%" height="100%" viewBox="0 0 100 170" className={`${isSmall ? 'p-1' : 'p-4'} text-[#d4af37]`}>
                    <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8a6e18" />
                            <stop offset="50%" stopColor="#f3e5ab" />
                            <stop offset="100%" stopColor="#8a6e18" />
                        </linearGradient>
                    </defs>

                    {/* Top Moon Phase */}
                    <path d="M50 20 A 8 8 0 1 0 50 36 A 8 8 0 1 0 50 20 Z" fill="currentColor" opacity="0.8" /> {/* Full Moon */}
                    <path d="M30 22 Q 35 28 30 34 A 8 8 0 0 1 30 22 Z" fill="currentColor" opacity="0.6" /> {/* Crescent L */}
                    <path d="M70 22 Q 65 28 70 34 A 8 8 0 0 0 70 22 Z" fill="currentColor" opacity="0.6" /> {/* Crescent R */}

                    {/* Central Triangle / Pyramid */}
                    <g transform="translate(50, 85)">
                        {/* Rays */}
                        <line x1="0" y1="-35" x2="0" y2="-45" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="25" y1="-25" x2="32" y2="-32" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="35" y1="0" x2="45" y2="0" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="25" y1="25" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="0" y1="35" x2="0" y2="45" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="-25" y1="25" x2="-32" y2="32" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="-35" y1="0" x2="-45" y2="0" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="-25" y1="-25" x2="-32" y2="-32" stroke="currentColor" strokeWidth="0.5" />

                        {/* Triangle */}
                        <polygon points="0,-30 26,20 -26,20" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" />
                        
                        {/* Eye */}
                        <path d="M-15 5 Q 0 -5 15 5 Q 0 15 -15 5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="0" cy="5" r="3" fill="currentColor" />
                    </g>

                    {/* Bottom Tears/Stars */}
                    <g transform="translate(50, 130)">
                        <path d="M0 0 Q -3 5 0 10 Q 3 5 0 0 Z" fill="currentColor" opacity="0.8" transform="translate(0, 0)" />
                        <path d="M0 0 Q -2 4 0 8 Q 2 4 0 0 Z" fill="currentColor" opacity="0.6" transform="translate(-10, -5)" />
                        <path d="M0 0 Q -2 4 0 8 Q 2 4 0 0 Z" fill="currentColor" opacity="0.6" transform="translate(10, -5)" />
                    </g>

                    {/* Decorative Corners Removed */}
                    {/* Stars Scatter */}
                    <circle cx="20" cy="60" r="0.5" fill="white" />
                    <circle cx="80" cy="60" r="0.5" fill="white" />
                    <circle cx="15" cy="100" r="1" fill="white" opacity="0.5" />
                    <circle cx="85" cy="100" r="1" fill="white" opacity="0.5" />
                </svg>
            </div>
        </div>

        {/* Card Front */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-surface shadow-xl overflow-hidden border-2 border-gold flex items-center justify-center bg-gray-900"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {image && !imgError ? (
            <img 
              src={image} 
              alt="Tarot Card" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="p-4 text-center">
              <span className="text-gold font-serif text-sm block mb-2 opacity-50">Card Image</span>
              <div className="w-8 h-8 border-2 border-gold/30 rounded-full mx-auto animate-pulse"></div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};