
import React, { useEffect, useRef } from 'react';
import { VideoConfig } from '../types';

interface VideoMaskProps {
  config: VideoConfig;
  videoUrl: string;
}

export const VideoMask: React.FC<VideoMaskProps> = ({ config, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [videoUrl]);

  return (
    <div
      className="absolute overflow-hidden bg-black"
      style={{
        top: `${config.top}%`,
        left: `${config.left}%`,
        width: `${config.width}%`,
        height: `${config.height}%`,
        // Note: No z-index here, handled by parent container to ensure it stays behind the image mask
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={videoUrl}
      >
      </video>
      
      {/* Overlay for atmosphere - adjusted to be subtle */}
      <div className="absolute inset-0 pointer-events-none bg-indigo-900/20 mix-blend-overlay" />
    </div>
  );
};
