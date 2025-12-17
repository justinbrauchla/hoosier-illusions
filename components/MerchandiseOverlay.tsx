import React from 'react';
import { HotspotData } from '../types';
import { X } from 'lucide-react';

interface MerchandiseOverlayProps {
    merchandiseHotspots?: HotspotData[];
    onHotspotClick?: (hotspot: HotspotData) => void;
    merchandiseHotspotIconUrl?: string;
    onClose: () => void;
}

export const MerchandiseOverlay: React.FC<MerchandiseOverlayProps> = ({ merchandiseHotspots, onHotspotClick, merchandiseHotspotIconUrl, onClose }) => {
    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
                <img
                    src="https://storage.googleapis.com/hoosierillusionsimages/merchandisetables.png"
                    alt="Merchandise Tables"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                />

                {/* Close Hotspot */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 group pointer-events-auto"
                    aria-label="Close Merchandise"
                >
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500">
                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gold-500/50 group-hover:bg-white/10 transition-all duration-300 transform group-hover:scale-110"></div>
                        <div className="relative z-10 bg-black/60 p-2 rounded-full border border-gold-500/50 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <X className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-gold-500/30 text-gold-100 text-xs px-3 py-1 rounded opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap font-serif shadow-lg z-20">
                        Coming Soon
                    </div>
                </button>

                {/* Render Merchandise Hotspots */}
                {merchandiseHotspots?.map((hotspot) => (
                    <button
                        key={hotspot.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onHotspotClick) onHotspotClick(hotspot);
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500">
                                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-black/50 group-hover:bg-white/10 transition-all duration-300 transform group-hover:scale-110"></div>
                                <div className="absolute inset-0 bg-black/30 rounded-full animate-ping opacity-0 group-hover:opacity-30"></div>
                                <div className="relative z-10 bg-white/90 p-2 rounded-full border border-black backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    {merchandiseHotspotIconUrl && (
                                        <img
                                            src={merchandiseHotspotIconUrl}
                                            alt="Hotspot Icon"
                                            className="w-8 h-8 object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-gold-500/30 text-gold-100 text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap font-serif transform translate-y-2 group-hover:translate-y-0 shadow-lg z-20">
                                {hotspot.label}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
