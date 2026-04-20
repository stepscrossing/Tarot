import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALL_CARDS } from '../constants';
import { DrawResult, TarotCard as TarotCardType } from '../types';
import { TarotCard } from './TarotCard';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';
import { createReading } from '../services';

const ResultScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = (location.state as { results: DrawResult[] })?.results || [];
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const savedOnceRef = useRef(false);

  useEffect(() => {
    if (results.length === 0) {
      navigate('/');
    }
    // Sequential reveal
    results.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, (i + 1) * 800);
    });
  }, [results, navigate]);

  useEffect(() => {
    if (results.length !== 3) return;
    if (savedOnceRef.current) return;
    savedOnceRef.current = true;

    setSaveStatus('saving');
    setSaveError(null);
    createReading(results)
      .then(() => setSaveStatus('saved'))
      .catch((e) => {
        setSaveStatus('error');
        setSaveError(e instanceof Error ? e.message : 'Save failed');
      });
  }, [results]);

  const getCardDetails = (id: string): TarotCardType | undefined => {
    return ALL_CARDS.find(c => c.id === id);
  };

  const positions = ['Card 1', 'Card 2', 'Card 3'];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-10 overflow-y-auto relative">
      {/* Return Button */}
      <button
        onClick={() => navigate('/draw')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gold/60 hover:text-gold transition-colors group"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="h-16"></div> {/* Spacer for layout */}

      <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-center w-full max-w-6xl px-4 mb-12">
        {results.map((result, index) => {
          const card = getCardDetails(result.cardId);
          if (!card) return null;

          return (
            <div key={result.cardId} className="flex flex-col items-center gap-6">
              <div className="relative group perspective-1000">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <TarotCard 
                    isFlipped={revealed[index]}
                    isReversed={result.isReversed}
                    image={card.image}
                    width={200}
                    height={350} // Ratio approx 0.57
                    className="shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                  />
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed[index] ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="text-center space-y-2"
              >
                <h3 className="text-2xl text-gold font-display">{card.nameEn}</h3>
                <p className="text-lg text-gold/80 font-serif">{card.nameZh}</p>
              </motion.div>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="mt-auto pb-10 flex flex-col items-center gap-4"
      >
        <div className="text-gold/40 text-xs uppercase tracking-widest">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved to history'}
          {saveStatus === 'error' && (saveError ? `Save failed: ${saveError}` : 'Save failed')}
        </div>
        <Button 
          onClick={() => navigate('/reading', { state: { results } })} 
          variant="outline"
          className="w-64 text-lg"
        >
          查看解读
        </Button>

        <Button 
          onClick={() => navigate('/draw')} 
          variant="outline" 
          className="w-64 opacity-70 hover:opacity-100 text-lg"
        >
          重新抽取
        </Button>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
