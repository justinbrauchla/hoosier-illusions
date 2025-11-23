import React from 'react';
import { GameState } from '../types';

interface RiddleCardProps {
  riddle: string | null;
  gameState: GameState;
}

export const RiddleCard: React.FC<RiddleCardProps> = ({ riddle, gameState }) => {
  if (!riddle || gameState === GameState.IDLE || gameState === GameState.LOADING) return null;

  return (
    <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-30 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-md border border-gold-500/50 p-6 rounded-xl shadow-2xl text-center animate-fade-in relative">
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500 rounded-tl-md" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500 rounded-tr-md" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500 rounded-bl-md" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500 rounded-br-md" />

        <h3 className="text-gold-600 font-serif text-sm uppercase tracking-[0.2em] mb-4 border-b border-gold-600/20 pb-2">
            The Oracle Speaks
        </h3>
        <p className="font-serif text-xl md:text-2xl text-gray-200 italic leading-relaxed drop-shadow-md">
          "{riddle}"
        </p>
      </div>
    </div>
  );
};