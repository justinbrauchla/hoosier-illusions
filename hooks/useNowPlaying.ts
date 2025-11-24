import { useState, useEffect } from 'react';
import { NowPlayingData, Mappings, MappingValue } from '../types';

export const useNowPlaying = (
    audioSrc: string | null,
    mappings: Mappings,
    setVideoSrc: (src: string | null) => void,
    setImageSrc: (src: string | null) => void,
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

                // Set album art with fallback to station logo
                const art = nowPlayingData?.now_playing?.song?.art ||
                    nowPlayingData?.station?.logo_url ||
                    null;
                setAlbumArt(art);

                // Only update video/mapping if NOT in initial state
                if (!isInitialState && nowPlayingData?.now_playing?.song?.title) {
                    const songTitle = nowPlayingData.now_playing.song.title.trim().toLowerCase();
                    const songMapping = mappings[songTitle];
                    if (songMapping) {
                        // Update current mapping so fullscreen setting applies
                        setCurrentMapping(songMapping);
                        if (songMapping.videoUrl) {
                            setVideoSrc(songMapping.videoUrl);
                            setImageSrc(null);
                        } else if (songMapping.imageUrl) {
                            setVideoSrc(null);
                            setImageSrc(songMapping.imageUrl);
                        } else {
                            setVideoSrc(null); // Clear video so album art shows
                            setImageSrc(null);
                        }
                    } else {
                        // No mapping for this song, clear current mapping and video
                        setCurrentMapping(null);
                        setVideoSrc(null);
                        setImageSrc(null);
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
    }, [audioSrc, mappings, setVideoSrc, setImageSrc, setCurrentMapping, isInitialState]);

    return { nowPlaying, albumArt };
};
