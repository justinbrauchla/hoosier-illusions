
import React from 'react';
import { HotspotData } from '../types';

interface HotspotLayerProps {
  hotspots: HotspotData[];
  iconUrl: string;
  onHotspotClick: (hotspot: HotspotData) => void;
}

export const HotspotLayer: React.FC<HotspotLayerProps> = ({ hotspots, iconUrl, onHotspotClick }) => {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          onClick={(e) => {
            e.stopPropagation();
            onHotspotClick(hotspot);
          }}
          className="absolute group pointer-events-auto"
          style={{
            top: `${hotspot.top}%`,
            left: `${hotspot.left}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          aria-label={`View details for ${hotspot.label}`}
        >
          {/* 
            Visual Center: 
            We position this absolutely in the center of the clickable region.
            The region itself remains large for clickability, but the hover visual is small and circular.
          */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

            {/* Hover Circle - A bit larger than the icon */}
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500">

              {/* Hover Background/Border Effect */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gold-500/50 group-hover:bg-white/10 transition-all duration-300 transform group-hover:scale-110"></div>

              {/* Pulse Animation - Always subtle, gets stronger on hover */}
              <div className="absolute inset-0 bg-gold-500/30 rounded-full animate-ping opacity-0 group-hover:opacity-30"></div>

              {/* Icon Container */}
              <div className="relative z-10 bg-black/60 p-2 rounded-full border border-gold-500/50 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={iconUrl}
                  alt="Hotspot Icon"
                  className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-gold-500/30 text-gold-100 text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap font-serif transform translate-y-2 group-hover:translate-y-0 shadow-lg z-20">
              {hotspot.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
