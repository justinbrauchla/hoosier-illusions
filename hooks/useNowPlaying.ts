import { useState, useEffect } from 'react';
import { NowPlayingData, Mappings, MappingValue } from '../types';

export const useNowPlaying = (
    audioSrc: string | null,
    mappings: Mappings,
    setVideoSrc: (src: string | null) => void,
    setCurrentMapping: (mapping: MappingValue | null) => void,
    isInitialState: boolean = false
) => {
    const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
    const [albumArt, setAlbumArt] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if playing a radio stream
        if (!audioSrc || !audioSrc.includes('/radio.mp3')) {
            setNowPlaying(null);
            setAlbumArt(null);
            return;
        }

        const fetchNowPlaying = async () => {
            try {
                // Use local server proxy to avoid CORS issues and external dependencies
                const response = await fetch(`${window.location.origin}/api/nowplaying`);
                if (!response.ok) throw new Error('Network response was not ok');
                const nowPlayingData: NowPlayingData = await response.json();
                setNowPlaying(nowPlayingData);

                // Set album art
                if (nowPlayingData?.now_playing?.song?.art) {
                    setAlbumArt(nowPlayingData.now_playing.song.art);
                }

                // Only update video/mapping if NOT in initial state
                if (!isInitialState && nowPlayingData?.now_playing?.song?.title) {
                    const songTitle = nowPlayingData.now_playing.song.title.trim().toLowerCase();
                    const songMapping = mappings[songTitle];
                    if (songMapping) {
                        // Update current mapping so fullscreen setting applies
                        setCurrentMapping(songMapping);
                        if (songMapping.videoUrl) {
                            setVideoSrc(songMapping.videoUrl);
                        }
                        // If no video URL, album art will be used as fallback
                    } else {
                        // No mapping for this song, clear current mapping
                        setCurrentMapping(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Now Playing data:", error);
                setNowPlaying(null);
                setAlbumArt(null);
            }
        };

        fetchNowPlaying();
        const intervalId = setInterval(fetchNowPlaying, 15000);

        return () => {
            clearInterval(intervalId);
            setNowPlaying(null);
            setAlbumArt(null);
        };
    }, [audioSrc, mappings, setVideoSrc, setCurrentMapping, isInitialState]);

    return { nowPlaying, albumArt };
};
