import { useState, useEffect, useRef } from 'react';

export const useMediaController = (audioSrc: string | null, initialMuted: boolean = false) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(initialMuted);

    useEffect(() => {
        if (audioSrc) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [audioSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audioSrc && audio.src !== audioSrc) {
            audio.src = audioSrc;
        } else if (!audioSrc) {
            audio.src = '';
        }

        audio.volume = volume;
        audio.muted = isMuted;

        if (isPlaying && audioSrc) {
            audio.play().catch(e => {
                console.error("Audio play failed", e);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [audioSrc, isPlaying, volume, isMuted]);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return {
        audioRef,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        toggleMute
    };
};
