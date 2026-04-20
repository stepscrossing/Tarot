import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_CARDS } from '../constants';
import { TarotCard } from './TarotCard';

const AllCardsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none fixed">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-mystic-purple/20 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      {/* Header */}
      <div className="p-6 z-20 flex items-center justify-between border-b border-gold/10 bg-background/50 backdrop-blur-sm sticky top-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-serif tracking-widest uppercase text-sm">Back</span>
        </button>
        <h1 className="font-display text-xl text-gold tracking-wide uppercase">All Cards</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto z-10 p-4 md:p-6 pb-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
          {ALL_CARDS.map((card, idx) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-full aspect-[150/263] relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] rounded-lg">
                 <TarotCard 
                    width="100%" 
                    height="100%" 
                    image={card.image} 
                    isFlipped={true} 
                    isReversed={false} 
                  />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <div className="text-gold font-display text-sm md:text-base">{card.nameZh}</div>
                <div className="text-gold/40 font-serif text-xs">{card.nameEn}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCardsScreen;
