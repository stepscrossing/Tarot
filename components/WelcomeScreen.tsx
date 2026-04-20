import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { History, LayoutGrid, Moon, Sparkles, Star } from 'lucide-react';
import { TarotCard } from './TarotCard';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-radial-gold relative overflow-hidden font-sans">
      
      {/* Background Stars/Nebula Effect */}
      <div className="absolute inset-0 bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mystic-purple/10 to-transparent"></div>
      </div>

      {/* History Button */}
      <button
        onClick={() => navigate('/history')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
      >
        <History className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* All Cards Button */}
      <button
        onClick={() => navigate('/cards')}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
      >
        <LayoutGrid className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Decorative Background Elements (Rotating Astrological Rings) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Vintage Frame Border */}
        <div className="absolute inset-4 md:inset-8 border border-gold/40 rounded-sm z-0">
           {/* Top Left Corner Flourish */}
           <div className="absolute -top-[14px] -left-[14px] w-16 h-16 text-gold">
              <svg viewBox="0 0 64 64" className="w-full h-full fill-none stroke-current">
                 <path d="M 14,64 L 14,30 C 14,14 30,14 64,14" strokeWidth="1.5" />
                 <path d="M 14,30 C 14,20 20,14 30,14" strokeWidth="1" />
                 <path d="M 30,14 C 24,14 20,18 20,24 C 20,28 24,30 28,26" strokeWidth="0.5" />
                 <path d="M 14,30 C 14,24 18,20 24,20 C 28,20 30,24 26,28" strokeWidth="0.5" />
                 {/* Star */}
                 <path d="M 8,8 L 11,2 L 14,8 L 20,11 L 14,14 L 11,20 L 8,14 L 2,11 Z" fill="currentColor" stroke="none" />
              </svg>
           </div>
           {/* Top Right Corner Flourish */}
           <div className="absolute -top-[14px] -right-[14px] w-16 h-16 text-gold rotate-90">
              <svg viewBox="0 0 64 64" className="w-full h-full fill-none stroke-current">
                 <path d="M 14,64 L 14,30 C 14,14 30,14 64,14" strokeWidth="1.5" />
                 <path d="M 14,30 C 14,20 20,14 30,14" strokeWidth="1" />
                 <path d="M 30,14 C 24,14 20,18 20,24 C 20,28 24,30 28,26" strokeWidth="0.5" />
                 <path d="M 14,30 C 14,24 18,20 24,20 C 28,20 30,24 26,28" strokeWidth="0.5" />
                 <path d="M 8,8 L 11,2 L 14,8 L 20,11 L 14,14 L 11,20 L 8,14 L 2,11 Z" fill="currentColor" stroke="none" />
              </svg>
           </div>
           {/* Bottom Left Corner Flourish */}
           <div className="absolute -bottom-[14px] -left-[14px] w-16 h-16 text-gold -rotate-90">
              <svg viewBox="0 0 64 64" className="w-full h-full fill-none stroke-current">
                 <path d="M 14,64 L 14,30 C 14,14 30,14 64,14" strokeWidth="1.5" />
                 <path d="M 14,30 C 14,20 20,14 30,14" strokeWidth="1" />
                 <path d="M 30,14 C 24,14 20,18 20,24 C 20,28 24,30 28,26" strokeWidth="0.5" />
                 <path d="M 14,30 C 14,24 18,20 24,20 C 28,20 30,24 26,28" strokeWidth="0.5" />
                 <path d="M 8,8 L 11,2 L 14,8 L 20,11 L 14,14 L 11,20 L 8,14 L 2,11 Z" fill="currentColor" stroke="none" />
              </svg>
           </div>
           {/* Bottom Right Corner Flourish */}
           <div className="absolute -bottom-[14px] -right-[14px] w-16 h-16 text-gold rotate-180">
              <svg viewBox="0 0 64 64" className="w-full h-full fill-none stroke-current">
                 <path d="M 14,64 L 14,30 C 14,14 30,14 64,14" strokeWidth="1.5" />
                 <path d="M 14,30 C 14,20 20,14 30,14" strokeWidth="1" />
                 <path d="M 30,14 C 24,14 20,18 20,24 C 20,28 24,30 28,26" strokeWidth="0.5" />
                 <path d="M 14,30 C 14,24 18,20 24,20 C 28,20 30,24 26,28" strokeWidth="0.5" />
                 <path d="M 8,8 L 11,2 L 14,8 L 20,11 L 14,14 L 11,20 L 8,14 L 2,11 Z" fill="currentColor" stroke="none" />
              </svg>
           </div>
        </div>

        {/* Floating Alchemy Symbols */}
        {[
          { icon: "☿", x: "15%", y: "20%", delay: 0 },
          { icon: "♀", x: "85%", y: "25%", delay: 2 },
          { icon: "☉", x: "10%", y: "70%", delay: 4 },
          { icon: "☾", x: "90%", y: "65%", delay: 1 },
          { icon: "🜂", x: "25%", y: "85%", delay: 3 }, // Fire
          { icon: "🜃", x: "75%", y: "15%", delay: 5 }, // Water
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-gold/20 font-serif text-4xl select-none"
            style={{ left: item.x, top: item.y }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Outer Ring with Zodiac/Runes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] border border-gold/10 rounded-full flex items-center justify-center opacity-40"
        >
           <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible opacity-50">
             <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2"/>
             {/* Simple geometric decorations */}
             {[...Array(12)].map((_, i) => (
               <line 
                 key={i} 
                 x1="50" y1="5" x2="50" y2="10" 
                 stroke="currentColor" strokeWidth="0.5"
                 transform={`rotate(${i * 30} 50 50)`} 
               />
             ))}
           </svg>
        </motion.div>

        {/* Middle Ring with Complex Geometry */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] border border-gold/15 rounded-full flex items-center justify-center opacity-50"
        >
           {/* Hexagram-like structure */}
           <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] opacity-30 text-gold fill-none stroke-current">
              <polygon points="50,5 90,80 10,80" strokeWidth="0.2" />
              <polygon points="50,95 90,20 10,20" strokeWidth="0.2" />
              <circle cx="50" cy="50" r="30" strokeWidth="0.1" />
           </svg>
        </motion.div>
        
        {/* Inner Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[450px] h-[450px] border border-gold/20 rounded-full opacity-50 border-dotted"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-4 w-full flex flex-col items-center"
      >
        {/* Moon Icon with Star */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="mb-6 relative w-24 h-24 flex items-center justify-center text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
        >
          {/* Crescent Moon */}
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-full h-full text-gold-light opacity-90"
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,223,128,0.5))' }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          
          {/* Star Inside */}
          <motion.div 
            className="absolute top-[35%] right-[25%]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
             <Star className="w-8 h-8 fill-gold-glow text-gold-glow" />
          </motion.div>
          
          {/* Small decorative stars around */}
          <Star className="absolute top-0 right-2 w-3 h-3 fill-gold text-gold opacity-60" />
          <Star className="absolute bottom-2 left-2 w-2 h-2 fill-gold text-gold opacity-40" />
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="font-sans font-bold text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-gold via-gold-light to-gold-dim mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tight"
          initial={{ letterSpacing: '0.1em', opacity: 0 }}
          animate={{ letterSpacing: '0.05em', opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          月隐塔罗
        </motion.h1>
        
        {/* 3 Cards Visual (Static decoration) */}
        <div className="relative h-48 w-full max-w-md flex justify-center items-center mb-10 perspective-1000 mt-8">
           <motion.div 
             initial={{ y: 50, opacity: 0, rotate: -15 }}
             animate={{ y: 0, opacity: 1, rotate: -15 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="absolute left-[20%] z-0 scale-90 opacity-60"
           >
             <TarotCard isFlipped={false} isReversed={false} width={100} height={160} />
           </motion.div>
           <motion.div 
             initial={{ y: 50, opacity: 0, rotate: 15 }}
             animate={{ y: 0, opacity: 1, rotate: 15 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="absolute right-[20%] z-0 scale-90 opacity-60"
           >
             <TarotCard isFlipped={false} isReversed={false} width={100} height={160} />
           </motion.div>
           <motion.div 
             initial={{ y: 50, opacity: 0, rotate: 0 }}
             animate={{ y: -10, opacity: 1, rotate: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
             className="absolute z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
           >
             <TarotCard isFlipped={false} isReversed={false} width={110} height={176} />
           </motion.div>
        </div>

        {/* Subtitle */}
        <div className="relative mb-12">
           <p className="font-sans text-xl md:text-2xl text-gold/90 tracking-[0.2em] font-light">
            过去 · 现在 · 未来
          </p>
        </div>

        <Button onClick={() => navigate('/draw')} variant="retro" className="px-8 py-3 text-base tracking-widest font-sans">
          开始占卜
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;