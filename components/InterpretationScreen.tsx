import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ALL_CARDS } from '../constants';
import { DrawResult, TarotCard as TarotCardType } from '../types';
import { TarotCard } from './TarotCard';
import { Button } from './ui/Button';
import { getInterpretation } from '../services';

const InterpretationScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = (location.state as { results: DrawResult[] })?.results || [];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [interpretation, setInterpretation] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  // Scroll to top on mount
  React.useEffect(() => {
    // Use a small timeout to ensure this runs after any browser scroll restoration
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // If accessed directly without cards, redirect home
  React.useEffect(() => {
    if (!results || results.length === 0) {
      navigate('/');
    }
  }, [results, navigate]);

  // Fetch AI interpretation
  React.useEffect(() => {
    if (results.length === 3 && !interpretation && !loading) {
      setLoading(true);
      
      const cardsForAi = results.map(r => {
        const card = ALL_CARDS.find(c => c.id === r.cardId);
        return {
          name: card?.nameZh || r.cardId,
          isReversed: r.isReversed
        };
      });

      getInterpretation(cardsForAi)
        .then(text => setInterpretation(text))
        .catch(err => {
          console.error('Failed to get interpretation:', err);
          setInterpretation("The spirits are quiet today... (Failed to load interpretation)");
        })
        .finally(() => setLoading(false));
    }
  }, [results]);

  const getCardDetails = (id: string): TarotCardType | undefined => {
    return ALL_CARDS.find(c => c.id === id);
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-mystic-purple/20 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      {/* Header */}
      <div className="p-6 z-20 flex items-center justify-between border-b border-gold/10 bg-background/50 backdrop-blur-sm sticky top-0">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="font-display text-xl text-gold tracking-wide uppercase">Interpretation</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto z-10 p-4 md:p-6 flex flex-col gap-4 max-w-4xl mx-auto w-full pb-8"
      >
        
        {/* Left Column: Summary of Cards */}
        <div className="lg:w-full flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {results.map((result, idx) => {
              const card = getCardDetails(result.cardId);
              if (!card) return null;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2 bg-surface/30 p-2 md:p-3 rounded-lg border border-gold/10 hover:bg-gold/5 transition-colors text-center"
                >
                  <div className="w-14 h-24 md:w-16 md:h-28 flex-shrink-0">
                     <TarotCard 
                        width="100%" 
                        height="100%" 
                        image={card.image} 
                        isFlipped={true} 
                        isReversed={result.isReversed} 
                      />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-gold font-display text-sm md:text-base">{card.nameZh}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Interpretation */}
        <div className="w-full flex flex-col">
            <h2 className="text-gold/50 font-serif uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                Cosmic Insight
            </h2>
            
            <div className="flex-1 bg-surface/30 border border-gold/20 rounded-lg p-4 md:p-6 relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/40"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/40"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/40"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/40"></div>

                <div className="font-sans text-gold/90 text-base leading-relaxed space-y-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 text-gold/60" />
                      </motion.div>
                      <p className="text-gold/50 font-serif italic">Consulting the stars...</p>
                    </div>
                  ) : (
                    interpretation.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  )}
                </div>
            </div>
        </div>

        <div className="w-full flex justify-center mt-2">
          <Button 
            variant="outline" 
            className="w-full max-w-[140px] h-9 text-xs shadow-[0_0_10px_rgba(212,175,55,0.1)]"
            onClick={() => navigate('/')}
          >
            Get
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterpretationScreen;