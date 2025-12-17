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
        // Check if playing any AzuraCast audio
        const isAzuraCastAudio = audioSrc && audioSrc.includes('stream.hoosierillusions.com');

        if (!isAzuraCastAudio) {
            setNowPlaying(null);
            setAlbumArt(null);
            return;
        }

        // Determine if it's the live stream or a direct track URL
        const isLiveStream = audioSrc.includes('/radio.mp3');

        const fetchNowPlaying = async () => {
            try {
                if (isLiveStream) {
                    // Fetch Now Playing for live stream
                    const response = await fetch(`${window.location.origin}/api/nowplaying`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const nowPlayingData: NowPlayingData = await response.json();
                    setNowPlaying(nowPlayingData);

                    // Set album art with fallback to station logo
                    const art = nowPlayingData?.now_playing?.song?.art ||
                        nowPlayingData?.station?.art ||
                        nowPlayingData?.station?.logo_url ||
                        null;
                    setAlbumArt(art);

                    // Update video/mapping based on currently playing song
                    if (nowPlayingData?.now_playing?.song?.title) {
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
                } else {
                    // Fetch metadata for direct track URL
                    const response = await fetch(`${window.location.origin}/api/track-metadata?url=${encodeURIComponent(audioSrc)}`);
                    if (!response.ok) throw new Error('Failed to fetch track metadata');
                    const data = await response.json();

                    setAlbumArt(data.albumArt || null);
                    // Don't update nowPlaying or mappings for direct tracks
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
