
import React from 'react';
import { CREATURES } from '../constants';
import { GameState, CreatureType } from '../types';
import { Wand2, LogOut } from 'lucide-react';

interface ControlsProps {
  gameState: GameState;
  onGuess: (creature: CreatureType) => void;
  onStart: () => void;
  onQuit: () => void;
  score: number;
}

export const Controls: React.FC<ControlsProps> = ({ gameState, onGuess, onStart, onQuit, score }) => {
  const isPlaying = gameState === GameState.PLAYING;

  const getIcon = (type: CreatureType) => {
    switch(type) {
        case CreatureType.BIGFOOT: return <div className="text-2xl">👣</div>;
        case CreatureType.UNICORN: return <div className="text-2xl">🦄</div>;
        case CreatureType.MERMAID: return <div className="text-2xl">🧜‍♀️</div>;
        case CreatureType.YETI: return <div className="text-2xl">❄️</div>;
    }
  };

  // In IDLE state, show nothing. The game is started via the Hotspot now.
  if (gameState === GameState.IDLE) {
    return null;
  }

  if (gameState === GameState.WON || gameState === GameState.LOST) {
    return (
      <div className="absolute bottom-[12%] left-0 right-0 flex flex-col items-center z-20 gap-4 pointer-events-auto">
        <div className={`text-3xl font-serif font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${gameState === GameState.WON ? 'text-gold-500' : 'text-red-500'}`}>
            {gameState === GameState.WON ? "The Illusion is Revealed!" : "The Spirits deny your guess."}
        </div>
        
        <div className="flex gap-4">
            <button
              onClick={onQuit}
              className="px-6 py-3 bg-black/60 border border-gold-600/50 text-gold-500/80 font-serif text-sm tracking-widest uppercase transition-all hover:bg-deep-red/80 hover:text-gold-100 backdrop-blur-sm rounded-sm flex items-center gap-2"
            >
               <LogOut size={16} /> Leave
            </button>

            <button
              onClick={onStart}
              className="group relative px-8 py-3 bg-deep-red/90 border-2 border-gold-500 text-gold-500 font-serif text-xl tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_#d4af37] backdrop-blur-sm"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <Wand2 className="w-6 h-6" />
                    Cast Again
                </span>
                <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
        
        <div className="bg-black/60 px-6 py-2 rounded-full border border-gold-600/30 text-gold-500 font-serif backdrop-blur-md">
            Legacy Score: {score}
        </div>
      </div>
    );
  }

  if (gameState === GameState.LOADING) {
    return (
        <div className="absolute bottom-[20%] w-full text-center z-20">
            <p className="text-gold-500 font-serif text-xl animate-pulse-slow tracking-widest drop-shadow-md">
                Consulting the Oracle...
            </p>
        </div>
    );
  }

  return (
    <div className="absolute bottom-[18%] left-0 right-0 z-20 px-4 pointer-events-auto">
      <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {CREATURES.map((c) => (
          <button
            key={c.type}
            onClick={() => onGuess(c.type)}
            disabled={!isPlaying}
            className={`
              relative overflow-hidden rounded-lg border-2 border-gold-600/40 bg-black/80 backdrop-blur-sm
              p-3 transition-all duration-300 group
              ${isPlaying ? 'hover:border-gold-400 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
            `}
          >
            <div className="flex flex-col items-center gap-1 text-center relative z-10">
                {getIcon(c.type)}
              <span className="font-serif font-bold text-gold-100 text-sm md:text-base">{c.type}</span>
            </div>
            {/* Hover Effect Background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${c.color}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
