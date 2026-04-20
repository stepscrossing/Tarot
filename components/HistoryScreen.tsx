import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { listReadings } from '../services';
import { ALL_CARDS } from '../constants';
import { Reading, TarotCard as TarotCardType } from '../types';
import { TarotCard } from './TarotCard';

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listReadings()
      .then((data) => setReadings(data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  const getCardDetails = (id: string): TarotCardType | undefined => {
    return ALL_CARDS.find(c => c.id === id);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col p-6 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/10 rounded-full" />
      </div>

      <button 
        onClick={() => navigate('/')}
        className="relative z-10 flex items-center gap-2 text-gold/60 hover:text-gold transition-colors w-fit mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-serif tracking-widest uppercase text-sm">Back to Home</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full z-10"
      >
        <div className="flex items-center gap-4 mb-12 border-b border-gold/20 pb-4">
          <Clock className="w-6 h-6 text-gold" />
          <h1 className="font-display text-3xl md:text-4xl text-gold">Reading History</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 border border-gold/10 rounded-lg bg-surface/30 backdrop-blur-sm">
            <p className="font-serif text-xl text-gold/60">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-gold/10 rounded-lg bg-surface/30 backdrop-blur-sm">
            <p className="font-serif text-xl text-gold/60">Failed to load history</p>
            <p className="font-serif text-sm text-gold/40 mt-4">{error}</p>
          </div>
        ) : readings.length === 0 ? (
          <div className="text-center py-20 border border-gold/10 rounded-lg bg-surface/30 backdrop-blur-sm">
            <p className="font-serif text-xl text-gold/60">No readings yet</p>
            <p className="font-serif text-sm text-gold/40 mt-4 uppercase tracking-widest">
              Draw your first spread
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {readings.map((reading) => {
              const sorted = [...reading.cards].sort((a, b) => a.position - b.position);
              const when = new Date(reading.createdAt);
              return (
                <button
                  key={reading.id}
                  onClick={() => navigate('/result', { state: { results: sorted } })}
                  className="w-full text-left border border-gold/10 rounded-lg bg-surface/30 backdrop-blur-sm hover:bg-surface/50 transition-colors p-4 md:p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-gold font-display text-lg">Reading</div>
                      <div className="text-gold/50 text-xs uppercase tracking-widest">
                        {when.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sorted.map((r) => {
                        const card = getCardDetails(r.cardId);
                        return (
                          <div key={`${reading.id}-${r.position}`} className="w-10 h-[70px] md:w-12 md:h-[84px]">
                            <TarotCard
                              width="100%"
                              height="100%"
                              image={card?.image}
                              isFlipped={true}
                              isReversed={r.isReversed}
                              className="shadow-[0_0_20px_rgba(212,175,55,0.08)]"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                    {sorted.map((r) => {
                      const card = getCardDetails(r.cardId);
                      return (
                        <div
                          key={`${reading.id}-label-${r.position}`}
                          className="text-gold/70 text-sm font-serif border border-gold/10 rounded-md px-3 py-2 bg-background/20"
                        >
                          {card ? `${card.nameEn} / ${card.nameZh}` : r.cardId}
                          {r.isReversed ? ' (Reversed)' : ''}
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryScreen;
