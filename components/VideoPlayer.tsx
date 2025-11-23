import React, { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  muted?: boolean;
  fallbackCover?: string | null;
}

// Cache bad URLs to prevent retry flickering
const badUrlCache = new Set<string>();

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, muted = true, fallbackCover }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (badUrlCache.has(src)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    console.warn(`Video load failed: ${src}. Falling back to cover art.`);
    badUrlCache.add(src);
    setHasError(true);
  };

  if (hasError && fallbackCover) {
    return (
      <div className="w-full h-full bg-black relative flex items-center justify-center animate-in fade-in duration-700">
        <img
          src={fallbackCover}
          alt="Now Playing Cover"
          className="w-full h-full object-contain opacity-90"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={muted}
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        onError={handleError}
      />
    </div>
  );
};

export default VideoPlayer;