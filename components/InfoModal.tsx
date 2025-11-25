
import React, { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { HotspotData } from '../types';

interface InfoModalProps {
    data: HotspotData | null;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ data, onClose }) => {
    const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

    if (!data) return null;

    // Check if this is Album Posters
    const isAlbumPosters = data.id === 'posters-left';

    // Get poster URLs from contents (filter for valid HTTP URLs)
    const posterUrls = isAlbumPosters
        ? data.contents.filter(c => c.imagePlaceholder?.startsWith('http'))
        : [];

    const currentPoster = posterUrls.length > 0 ? posterUrls[currentPosterIndex] : null;
    const hasPrevious = currentPosterIndex > 0;
    const hasNext = currentPosterIndex < posterUrls.length - 1;

    const goToPrevious = () => {
        if (hasPrevious) setCurrentPosterIndex(prev => prev - 1);
    };

    const goToNext = () => {
        if (hasNext) setCurrentPosterIndex(prev => prev + 1);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className={`relative bg-black border-2 border-gold-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transform transition-all scale-100 ${isAlbumPosters ? 'w-full max-w-xl max-h-[90vh]' : 'w-full max-w-xl max-h-[80vh]'
                    } `}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header (Fixed) */}
                <div className="bg-black p-4 flex justify-between items-center border-b border-gold-600/30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {isAlbumPosters && posterUrls.length > 1 && (
                            <>
                                <button

                                    onClick={goToPrevious}
                                    disabled={!hasPrevious}
                                    className={`p-1 rounded-full transition-colors ${hasPrevious
                                        ? 'text-white hover:bg-white/20'
                                        : 'text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={goToNext}
                                    disabled={!hasNext}
                                    className={`p-1 rounded-full transition-colors ${hasNext
                                        ? 'text-white hover:bg-white/20'
                                        : 'text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                        <h2 className="text-xl font-serif text-white tracking-wider uppercase">{data.label}</h2>
                        {isAlbumPosters && posterUrls.length > 1 && (
                            <span className="text-sm text-gray-400">
                                {currentPosterIndex + 1} / {posterUrls.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                {isAlbumPosters ? (
                    // Full image display for Album Posters with video player behind
                    <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 min-h-0">
                        {/* Wrapper that sizes to the overlay image */}
                        <div className="relative inline-block max-w-full max-h-full">
                            {/* Background poster container with 4:5 aspect ratio */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="relative"
                                    style={{
                                        aspectRatio: '4/5',
                                        width: `${currentPoster?.posterWidth || 85}%`
                                    }}
                                >
                                    {/* Background image/video behind the poster - this rotates */}
                                    {currentPoster?.imagePlaceholder?.startsWith('http') ? (
                                        currentPoster.imagePlaceholder.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video
                                                src={currentPoster.imagePlaceholder}
                                                autoPlay
                                                loop
                                                muted
                                                className="absolute inset-0 w-full h-full object-contain"
                                                style={{ transform: `scale(${currentPoster.scale || 1})` }}
                                            />
                                        ) : (
                                            <img
                                                src={currentPoster.imagePlaceholder}
                                                alt="Background"
                                                className="absolute inset-0 w-full h-full object-contain"
                                                style={{ transform: `scale(${currentPoster.scale || 1})` }}
                                            />
                                        )
                                    ) : (
                                        <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
                                            <p className="text-gray-500 text-sm">No background content configured</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Poster cutout overlay - this stays static and drives the size */}
                            {data.posterOverlayUrl ? (
                                <img
                                    src={data.posterOverlayUrl}
                                    alt={data.label}
                                    className="relative block w-auto h-auto max-w-full max-h-[calc(80vh-8rem)] object-contain z-10"
                                />
                            ) : (
                                <div className="w-64 h-80 flex items-center justify-center bg-black/50 border border-gold-500/30 relative z-10">
                                    <p className="text-gold-500 text-sm px-4 text-center">
                                        No poster overlay configured.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Scrollable Content Area for other hotspots
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {data.contents.map((content, index) => (
                            <div key={index} className="space-y-4 pb-6 border-b border-gold-600/10 last:border-0 last:pb-0">
                                <h3 className="text-lg font-serif text-white border-l-2 border-gold-500 pl-3">{content.title}</h3>

                                {/* Image Placeholder (Conditional Link) */}
                                {content.linkUrl ? (
                                    <a
                                        href={content.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full h-48 bg-gray-900 rounded border border-gold-600/20 relative overflow-hidden group cursor-pointer"
                                    >
                                        {content.imagePlaceholder?.startsWith('http') ? (
                                            <img
                                                src={content.imagePlaceholder}
                                                alt={content.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/60 font-serif text-lg group-hover:scale-105 transition-transform duration-700">
                                                [ {content.imagePlaceholder} ]
                                            </div>
                                        )}
                                        {/* Scanline effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent opacity-30 pointer-events-none" />

                                        {/* External Link Indicator */}
                                        <div className="absolute top-2 right-2 text-gold-500 opacity-50 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded">
                                            <ExternalLink size={16} />
                                        </div>
                                    </a>
                                ) : (
                                    <div className="w-full h-48 bg-gray-900 rounded border border-gold-600/20 flex items-center justify-center relative overflow-hidden group">
                                        {content.imagePlaceholder?.startsWith('http') ? (
                                            <img
                                                src={content.imagePlaceholder}
                                                alt={content.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/60 font-serif text-lg group-hover:scale-105 transition-transform duration-700">
                                                [ {content.imagePlaceholder} ]
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent opacity-30 pointer-events-none" />
                                    </div>
                                )}

                                {/* Description */}
                                <p className="font-serif text-white leading-relaxed text-base">
                                    {content.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer (Fixed) */}
                <div className="bg-black/90 p-3 text-center border-t border-gold-600/30 flex-shrink-0">
                    <span className="text-xs text-white/60 uppercase tracking-widest font-serif">Hoosier Illusions Studio</span>
                </div>
            </div>
        </div>
    );
};
