import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import AdminModal from './components/AdminModal';
import { MappingValue, Mappings } from './types';
import { DEFAULT_VIDEO_SRC, DEFAULT_THEATER_CONFIG, DEFAULT_HOTSPOT_CONFIG } from './constants';
import { useNowPlaying } from './hooks/useNowPlaying';
import { useMediaController } from './hooks/useMediaController';
import PanoViewer from './components/PanoViewer';
import { HotspotLayer } from './components/HotspotLayer';
import { InfoModal } from './components/InfoModal';
import { MerchandiseOverlay } from './components/MerchandiseOverlay';
import { GameConfig, HotspotData } from './types';
import { Play, Maximize, Minimize } from 'lucide-react';
// ...
// Fetch mappings from API
const fetchMappingsFromAPI = async (): Promise<Mappings> => {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch mappings');
    }
    const data = await response.json();

    // Ensure all mappings have required fields
    Object.keys(data).forEach(key => {
      if (typeof data[key].showInDropdown !== 'boolean') {
        data[key].showInDropdown = true;
      }
      if (typeof data[key].muteVideo !== 'boolean') {
        data[key].muteVideo = true;
      }
    });

    return data;
  } catch (e) {
    console.error("Failed to fetch mappings from API", e);
    return {};
  }
};

const App: React.FC = () => {
  const [mappings, setMappings] = useState<Mappings>({});
  // ...
  // Set initial video and audio to Hoosier Illusions stream
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [panoSrc, setPanoSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isMerchandiseActive, setIsMerchandiseActive] = useState(false);
  const [showInput, setShowInput] = useState(false); // Hide input initially
  const [currentMapping, setCurrentMapping] = useState<MappingValue | null>(null);
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const [isInitialState, setIsInitialState] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hotspot State
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_HOTSPOT_CONFIG);
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);

  // Theater configuration state with default theater theme
  const [theaterConfig, setTheaterConfig] = useState(DEFAULT_THEATER_CONFIG);

  // Video position state - Even smaller size
  const [videoPosition, setVideoPosition] = useState({
    top: '45.5%',
    left: '43%',
    width: '8%',
    height: '5%'
  });

  // Helper to calculate centered position style
  const getVideoStyle = () => {
    const top = parseFloat(videoPosition.top) || 0;
    const left = parseFloat(videoPosition.left) || 0;
    const width = parseFloat(videoPosition.width) || 0;
    const height = parseFloat(videoPosition.height) || 0;

    return {
      top: `${top - height / 2}% `,
      left: `${left - width / 2}% `,
      width: `${width}% `,
      height: `${height}% `
    };
  };

  const [mobilePlayEnabled, setMobilePlayEnabled] = useState(false);

  // Custom hooks - Autoplay muted to allow browser autoplay
  const { audioRef, isMuted, setIsMuted, play, setIsPlaying, isPlaying } = useMediaController(audioSrc, true, isMobile ? mobilePlayEnabled : true);
  const { nowPlaying, albumArt } = useNowPlaying(audioSrc, mappings, setVideoSrc, setImageSrc, setCurrentMapping, isInitialState);

  // Handle Input Window State
  const [isInputWindowOpen, setIsInputWindowOpen] = useState(false);

  const handleOpenInput = () => {
    setShowInput(true);
    setIsMuted(true);
  };

  // Handle Escape key to exit expanded view
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCloseInput = () => {
    setShowInput(false);
    setIsInitialState(false);
    // Unmute and play when closing input (user interaction)
    setIsMuted(false);
    play();
  };

  const handleTriggerSuccess = () => {
    // Just close the input, which will unmute and exit initial state
    handleCloseInput();
  };

  const handleHotspotClick = (hotspot: HotspotData) => {
    console.log('Clicked hotspot:', hotspot);
    // Check for 'merchandise' ID or 'merch' in label (case insensitive)
    if (hotspot.id === 'merchandise' || hotspot.label.toLowerCase().includes('merch')) {
      console.log('Activating Merchandise Overlay');
      setIsMerchandiseActive(true);
    } else {
      console.log('Setting active hotspot:', hotspot);
      setActiveHotspot(hotspot);
    }
  };

  // Fix mobile viewport height on mount and resize
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Track browser fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const saveMappings = async (updatedMappings: Mappings) => {
    setMappings(updatedMappings);
    try {
      const response = await fetch('/api/custom-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMappings),
      });

      if (!response.ok) {
        throw new Error('Failed to save mappings');
      }

      console.log('Mappings saved successfully to cloud storage');
    } catch (error) {
      console.error('Error saving mappings:', error);
      alert('Failed to save mappings. Please try again.');
    }
  };

  // Load mappings from API on mount
  useEffect(() => {
    fetchMappingsFromAPI().then(fetchedMappings => {
      setMappings(fetchedMappings);

      // Set default audio to 'hoosier illusions' stream
      const defaultMapping = fetchedMappings['hoosier illusions'];
      if (defaultMapping) {
        if (defaultMapping.audioUrl) {
          setAudioSrc(defaultMapping.audioUrl);
        }
        // Note: We intentionally do NOT set videoSrc here to show the front image initially
        setCurrentMapping(defaultMapping);
      }
    });

    // Load theater config
    fetch('/api/theater-config')
      .then(res => res.json())
      .then(config => setTheaterConfig(config))
      .catch(err => console.error('Failed to load theater config:', err));

    // Load video position
    fetch('/api/video-position')
      .then(res => res.json())
      .then(position => {
        if (position) {
          setVideoPosition(position);
        }
      })
      .catch(err => console.error('Failed to load video position:', err));

    // Load hotspot config
    fetch('/api/hotspot-config')
      .then(res => res.json())
      .then(config => setGameConfig({
        ...DEFAULT_HOTSPOT_CONFIG,
        ...config,
        merchandiseHotspots: config.merchandiseHotspots || []
      }))
      .catch(err => console.error('Failed to load hotspot config:', err));
  }, []);

  // Save theater config
  const saveTheaterConfig = async (config: typeof theaterConfig) => {
    setTheaterConfig(config);
    try {
      const response = await fetch('/api/theater-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to save theater config');
      console.log('Theater config saved successfully');
    } catch (error) {
      console.error('Error saving theater config:', error);
      alert('Failed to save theater configuration. Please try again.');
    }
  };

  // Update video position state (live preview)
  const handleUpdateVideoPosition = (position: typeof videoPosition) => {
    setVideoPosition(position);
  };

  // Save video position to cloud
  const saveVideoPosition = async (position: typeof videoPosition) => {
    // Ensure state is updated too
    setVideoPosition(position);
    try {
      const response = await fetch('/api/video-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
      });
      if (!response.ok) throw new Error('Failed to save video position');
      console.log('Video position saved successfully');
      alert('Video position saved successfully!');
    } catch (error) {
      console.error('Error saving video position:', error);
      alert('Failed to save video position. Please try again.');
    }
  };

  const saveGameConfig = async (newConfig: GameConfig) => {
    setGameConfig(newConfig);
    try {
      const response = await fetch('/api/hotspot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (!response.ok) throw new Error('Failed to save hotspot config');
      console.log('Hotspot config saved successfully');
    } catch (error) {
      console.error('Error saving hotspot config:', error);
      alert('Failed to save hotspot configuration. Please try again.');
    }
  };

  const resetGameConfig = async () => {
    try {
      const response = await fetch('/api/hotspot-config');
      const defaultConfig = await response.json();
      setGameConfig(defaultConfig);
      // Save the default config back to ensure it's persisted
      await saveGameConfig(defaultConfig);
    } catch (error) {
      console.error('Error resetting hotspot config:', error);
      setGameConfig(DEFAULT_HOTSPOT_CONFIG);
    }
  };

  // Check if URL is /admin and open admin modal
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const playTrigger = async (key: string) => {
    const triggerKey = key.trim().toLowerCase();
    const mapping = mappings[triggerKey];
    if (mapping) {
      setCurrentMapping(mapping);
      setIsInitialState(false);
      setIsMuted(false);
      setVideoSrc(mapping.videoUrl || null);
      setImageSrc(mapping.imageUrl || null);

      let newAudioUrl = mapping.audioUrl;

      console.log('🎵 Audio URL from mapping:', mapping.audioUrl);
      console.log('🎵 Trigger key:', key);
      console.log('🎵 Mapping title:', mapping.title);

      if (!newAudioUrl) {
        // Auto-construct on-demand URL by querying AzuraCast API
        const trackName = mapping.title || key.trim();
        console.log('🎵 Searching for track:', trackName);

        try {
          const response = await fetch('https://stream.hoosierillusions.com/api/station/hoosier-illusions/ondemand');
          const tracks = await response.json();

          // Find track by title (case-insensitive)
          const track = tracks.find((t: any) =>
            t.media?.title?.toLowerCase() === trackName.toLowerCase()
          );

          if (track && track.download_url) {
            newAudioUrl = `/api/proxy-audio?url=https://stream.hoosierillusions.com${track.download_url}`;
            console.log('🎵 Found track, download URL:', newAudioUrl);
          } else {
            console.log('🎵 Track not found in on-demand library');
            setError(`Track "${trackName}" not found in on-demand library`);
            return;
          }
        } catch (error) {
          console.error('🎵 Error fetching on-demand tracks:', error);
          setError('Failed to fetch track from on-demand library');
          return;
        }
      }

      // Add timestamp to stream URL to prevent caching and ensure live edge playback
      if (newAudioUrl && newAudioUrl.includes('radio.mp3')) {
        const separator = newAudioUrl.includes('?') ? '&' : '?';
        newAudioUrl = `${newAudioUrl}${separator}t=${Date.now()}`;
      }

      console.log('🎵 Final audio URL:', newAudioUrl);
      setAudioSrc(newAudioUrl);
      setVideoSrc(mapping.videoUrl || null);
      setImageSrc(mapping.imageUrl || null);
      setPanoSrc(mapping.panoUrl || null);
      setError(null);

      // Clear playlist when playing a single trigger
      setPlaylist([]);
      setCurrentTrackIndex(-1);

      // Update Now Playing state
      setCurrentMapping({
        ...mapping,
        audioUrl: newAudioUrl || '',
        videoUrl: mapping.videoUrl || '',
        imageUrl: mapping.imageUrl || '',
        album: mapping.album,
        artist: mapping.artist
      });

    } else {
      console.warn(`❌ No mapping found for "${key}"`);
      setCurrentMapping(null);
      setVideoSrc(null);
      setImageSrc(null);
      setAudioSrc(null);
      setPanoSrc(null);
      setError(`'${key}' is not a valid trigger word.`);
    }
  };

  const handleTriggerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDropdownOpen(false);

    if (!trigger.trim()) return;

    setIsLoadingChat(true);
    setChatResponse(null);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trigger,
          mappings
        }),
      });

      const data = await response.json();

      if (data.type === 'trigger') {
        // It's a trigger - play the media
        playTrigger(trigger);
        handleTriggerSuccess();
      } else if (data.type === 'chat') {
        // It's a chat response - show the AI response
        setChatResponse(data.response);
        // Keep input visible for continued conversation
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to direct trigger matching
      playTrigger(trigger);
      handleTriggerSuccess();
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleDropdownItemClick = (key: string) => {
    setTrigger(key);
    playTrigger(key);
    setIsDropdownOpen(false);
    handleCloseInput();
  };

  const addMapping = async (trigger: string, videoUrl: string, audioUrl: string, panoUrl: string, imageUrl: string, showInDropdown: boolean, muteVideo: boolean, playFullscreen: boolean) => {
    try {
      const response = await fetch('/api/save-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger, videoUrl, audioUrl, panoUrl, imageUrl, showInDropdown, muteVideo, playFullscreen
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save mapping');
      }

      // Update local state only on success
      const newMapping: MappingValue = {
        videoUrl: videoUrl.trim(),
        audioUrl: audioUrl.trim(),
        panoUrl: panoUrl.trim(),
        imageUrl: imageUrl.trim(),
        showInDropdown, muteVideo, playFullscreen
      };

      setMappings(prev => ({
        ...prev,
        [trigger.trim().toLowerCase()]: newMapping
      }));

      console.log('Mapping saved successfully');
    } catch (error) {
      console.error('Error saving mapping:', error);
      throw error; // Re-throw for UI to handle
    }
  };

  const updateMapping = async (trigger: string, videoUrl: string, audioUrl: string, panoUrl: string, imageUrl: string, showInDropdown: boolean, muteVideo: boolean, playFullscreen: boolean) => {
    // Reuse addMapping logic since the API handles both upsert
    return addMapping(trigger, videoUrl, audioUrl, panoUrl, imageUrl, showInDropdown, muteVideo, playFullscreen);
  };

  const deleteMapping = (trigger: string) => {
    const newMappings = { ...mappings };
    delete newMappings[trigger.trim().toLowerCase()];
    saveMappings(newMappings);
  };

  const filteredMappings = Object.keys(mappings).filter(key =>
    mappings[key].showInDropdown && key.toLowerCase().includes(trigger.toLowerCase())
  );

  // FINAL — THIS ONE WORKS
  const effectiveImageSrc =
    imageSrc ||
    (albumArt
      ? `/api/album-art?url=${encodeURIComponent(albumArt)}`
      : 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png'
    );
  const displayContent = !isInitialState && (panoSrc || videoSrc || effectiveImageSrc);



  // Playlist State
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleTrackEnded = () => {
    if (playlist.length > 0) {
      let nextIndex = currentTrackIndex + 1;

      // Loop playlist if at the end
      if (nextIndex >= playlist.length) {
        nextIndex = 0;
      }

      setCurrentTrackIndex(nextIndex);
      const nextTrack = playlist[nextIndex];

      console.log('⏭️ Playing next track:', nextTrack.media.title);

      // Play next track
      // Play next track
      const audioUrl = `https://storage.googleapis.com/hoosierillusionsaudio/${encodeURIComponent(nextTrack.media.title)}.mp3`;
      const videoUrl = mappings[nextTrack.media.title.toLowerCase()]?.videoUrl;
      const imageUrl = mappings[nextTrack.media.title.toLowerCase()]?.imageUrl || nextTrack.media.art;

      setAudioSrc(audioUrl);
      setVideoSrc(videoUrl || null);
      setImageSrc(imageUrl || null);

      // Update metadata
      setCurrentMapping({
        audioUrl,
        videoUrl: videoUrl || '',
        imageUrl: imageUrl || '',
        showInDropdown: true,
        muteVideo: true,
        title: nextTrack.media.title,
        album: nextTrack.media.album,
        artist: nextTrack.media.artist
      });
    } else {
      console.log('🏁 Playlist ended');
    }
  };

  const handlePosterClick = async (posterTitle: string) => {
    console.log('🖼️ Poster clicked:', posterTitle);

    try {
      // 1. Fetch all on-demand tracks
      const response = await fetch('https://stream.hoosierillusions.com/api/station/hoosier-illusions/ondemand');
      if (!response.ok) throw new Error('Failed to fetch on-demand tracks');

      const tracks = await response.json();
      console.log(`📀 Total on-demand tracks available: ${tracks.length}`);

      // Log first track structure for debugging
      if (tracks.length > 0) {
        console.log('📋 Sample track structure:', {
          title: tracks[0].media?.title,
          album: tracks[0].media?.album,
          playlists: tracks[0].media?.playlists,
          artist: tracks[0].media?.artist
        });
      }

      // 2. Filter tracks matching the poster title
      const searchTitle = posterTitle.toLowerCase().trim();
      console.log(`🔍 Searching for: "${searchTitle}"`);

      const matchingTracks = tracks.filter((t: any) => {
        // Check Album
        const album = t.media?.album?.toLowerCase() || '';
        if (album && (album.includes(searchTitle) || searchTitle.includes(album))) {
          console.log(`✓ Album match: "${t.media.title}" (album: "${album}")`);
          return true;
        }

        // Check Playlists - handle both array of strings and array of objects
        if (t.media?.playlists && Array.isArray(t.media.playlists)) {
          const playlistMatch = t.media.playlists.some((p: any) => {
            const playlistName = typeof p === 'string' ? p : p.name;
            return playlistName && playlistName.toLowerCase().includes(searchTitle);
          });
          if (playlistMatch) {
            console.log(`✓ Playlist match: "${t.media.title}"`);
            return true;
          }
        }

        return false;
      });

      console.log(`📊 Matching tracks found: ${matchingTracks.length}`);

      // Fallback: if no album/playlist match, look for exact title match
      if (matchingTracks.length === 0) {
        console.log('⚠️ No album/playlist matches, trying exact title match...');
        const exactTrack = tracks.find((t: any) => t.media?.title?.toLowerCase() === searchTitle);
        if (exactTrack) {
          console.log(`✓ Found exact title match: "${exactTrack.media.title}"`);
          matchingTracks.push(exactTrack);
        }
      }

      if (matchingTracks.length > 0) {
        console.log(`✅ Playing ${matchingTracks.length} tracks for "${posterTitle}"`);

        // Sort tracks by title for consistency
        matchingTracks.sort((a: any, b: any) => a.media.title.localeCompare(b.media.title));

        // Set Playlist
        setPlaylist(matchingTracks);
        setCurrentTrackIndex(0);

        // 3. Play the first track
        const firstTrack = matchingTracks[0];

        // Construct GCS URL from title
        const trackTitle = firstTrack.media.title;
        const gcsUrl = `https://storage.googleapis.com/hoosierillusionsaudio/${encodeURIComponent(trackTitle)}.mp3`;

        console.log(`▶️ Playing: "${trackTitle}" from GCS: ${gcsUrl}`);

        // Check for existing custom mapping for the first track
        const trackKey = trackTitle.toLowerCase();
        const existingMapping = mappings[trackKey];

        let videoUrl = null;
        let imageUrl = firstTrack.media.art || null;

        if (existingMapping) {
          if (existingMapping.videoUrl) videoUrl = existingMapping.videoUrl;
          if (existingMapping.imageUrl) imageUrl = existingMapping.imageUrl;
        }

        // Update state to play
        setAudioSrc(gcsUrl);
        setVideoSrc(videoUrl);
        setImageSrc(imageUrl);

        // Set current mapping
        setCurrentMapping({
          audioUrl: gcsUrl,
          videoUrl: videoUrl || '',
          imageUrl: imageUrl || '',
          showInDropdown: true,
          muteVideo: true,
          title: firstTrack.media.title,
          album: firstTrack.media.album,
          artist: firstTrack.media.artist
        });
        setIsInitialState(false);
        setIsMuted(false);

        // 4. Add ALL matching tracks to shortcuts, preserving existing mappings
        const newMappings = { ...mappings };
        let addedCount = 0;

        matchingTracks.forEach((track: any) => {
          if (track.media?.title) {
            const key = track.media.title.toLowerCase();
            const trackGcsUrl = `https://storage.googleapis.com/hoosierillusionsaudio/${encodeURIComponent(track.media.title)}.mp3`;

            if (newMappings[key]) {
              // Preserve existing mapping but ensure it shows in dropdown
              newMappings[key] = {
                ...newMappings[key],
                showInDropdown: true
              };
            } else {
              // Create new mapping
              newMappings[key] = {
                audioUrl: trackGcsUrl,
                videoUrl: '',
                imageUrl: track.media.art || '',
                showInDropdown: true,
                muteVideo: true,
                title: track.media.title
              };
              addedCount++;
            }
          }
        });

        setMappings(newMappings);
        console.log(`➕ Added/Updated shortcuts (added ${addedCount} new)`);
        console.log('📝 Shortcuts added:', matchingTracks.map(t => t.media.title));

        // Close the modal
        setActiveHotspot(null);

      } else {
        console.error(`❌ No tracks found for poster: "${posterTitle}"`);
        console.log('💡 Available albums:', [...new Set(tracks.map((t: any) => t.media?.album).filter(Boolean))]);
        console.log('💡 Available playlists:', [...new Set(tracks.flatMap((t: any) => t.media?.playlists || []).map((p: any) => typeof p === 'string' ? p : p.name))]);
      }

    } catch (error) {
      console.error('Error handling poster click:', error);
    }
  };

  if (isMobile) {
    const toggleMobilePlay = () => {
      if (isPlaying) {
        setAudioSrc(null);
        setIsPlaying(false);
        setMobilePlayEnabled(false);
      } else {
        setMobilePlayEnabled(true);
        setAudioSrc('https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3');
        setIsMuted(false);
      }
    };

    const showPlayingState = isPlaying;

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-start pt-32 p-8 text-center z-[9999]">
        <audio ref={audioRef} onEnded={handleTrackEnded} />
        <div
          className="relative mb-8 w-64 h-64 rounded-full border-4 border-gold-500/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] cursor-pointer group overflow-hidden flex-shrink-0"
          onClick={toggleMobilePlay}
        >
          <img
            src="https://storage.googleapis.com/hoosierillusionsimages/manlogo.jpeg"
            alt="Hoosier Illusions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            {!showPlayingState && (
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transition-transform group-hover:scale-110">
                <Play size={32} fill="black" className="text-black ml-1" />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-serif text-gold-500 mb-4 flex-shrink-0">Hoosier Illusions</h1>

        <div className="w-full max-w-xs mx-auto">
          {isPlaying ? (
            <div className="w-full text-left bg-black/40 p-4 rounded-lg backdrop-blur-sm">
              {nowPlaying ? (
                <>
                  <p className="text-xs text-cyan-400 font-bold tracking-wider mb-1">LIVE STREAM</p>
                  <h3 className="text-lg font-bold text-white truncate">{nowPlaying.now_playing.song.title}</h3>
                  <p className="text-xs text-gray-400 truncate mb-3">
                    {nowPlaying.now_playing.song.artist} - {nowPlaying.now_playing.song.album}
                  </p>
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-xs text-gray-500 font-bold tracking-wider mb-1">UP NEXT</p>
                    <p className="text-sm text-gray-400 truncate">{nowPlaying.playing_next.song.title}</p>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400 text-sm">Loading stream details...</p>
              )}
            </div>
          ) : (
            <p className="text-white/60 font-serif text-sm max-w-md mx-auto">
              Visit us on a larger screen or download our mobile app for more<br />Hoosier Illusions!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} loop={false} onEnded={handleTrackEnded} />
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="w-full h-full flex items-center justify-center">
          <main className="w-full h-full">
            <div className={
              isFullscreen
                ? "w-full h-full bg-black flex items-center justify-center"
                : "w-full aspect-square bg-black/50 rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-white/10"
            }>
              <div
                className={(isFullscreen ? "w-auto h-full max-w-full aspect-square" : "w-full h-full") + " relative bg-black"}
              >
                {displayContent ? (
                  <>
                    {panoSrc ? (
                      <div
                        className="w-full h-full bg-black relative cursor-pointer z-50"
                        onClick={handleOpenInput}
                      >
                        <PanoViewer imageUrl={panoSrc} />
                      </div>
                    ) : videoSrc ? (
                      <div className="relative w-full h-full">
                        {/* Conditionally position video based on playFullscreen setting */}
                        {currentMapping?.playFullscreen ? (
                          // Fullscreen mode - video fills entire container
                          <div
                            className={isExpanded ? "fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer" : "w-full h-full cursor-pointer relative z-50"}
                            onClick={isExpanded ? () => setIsExpanded(false) : handleOpenInput}
                          >
                            <VideoPlayer
                              key={videoSrc}
                              src={videoSrc}
                              muted={isMuted || (currentMapping?.muteVideo ?? false)}
                              fallbackCover={albumArt}
                            />
                          </div>
                        ) : (
                          <>
                            {/* Theater mode - video positioned within theater screen */}
                            <div className={isExpanded ? "fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer" : "absolute cursor-pointer z-0"}
                              style={isExpanded ? {} : getVideoStyle()}
                              onClick={isExpanded ? () => setIsExpanded(false) : handleOpenInput}
                            >
                              <VideoPlayer
                                key={videoSrc}
                                src={videoSrc}
                                muted={isMuted || (currentMapping?.muteVideo ?? false)}
                                fallbackCover={albumArt}
                              />
                            </div>
                            {/* Theater Mask Overlay */}
                            <img
                              src={theaterConfig.maskUrl}
                              alt="Theater Frame"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                            />
                          </>
                        )}
                      </div>
                    ) : effectiveImageSrc ? (
                      <div className="relative w-full h-full">
                        {currentMapping?.playFullscreen ? (
                          <div
                            className={isExpanded ? "fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer" : "w-full h-full cursor-pointer relative z-50 bg-black flex items-center justify-center"}
                            onClick={isExpanded ? () => setIsExpanded(false) : handleOpenInput}
                          >
                            <img
                              src={effectiveImageSrc}
                              alt="Cover"
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png';
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <div className={isExpanded ? "fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer" : "absolute cursor-pointer z-0"}
                              style={isExpanded ? {} : getVideoStyle()}
                              onClick={isExpanded ? () => setIsExpanded(false) : handleOpenInput}
                            >
                              <img
                                src={effectiveImageSrc}
                                alt="Cover"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png';
                                }}
                              />
                            </div>
                            <img
                              src={theaterConfig.maskUrl}
                              alt="Theater Frame"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                            />
                          </>
                        )}
                      </div>
                    ) : null}

                    {/* Expand Button (Only visible when not expanded) */}
                    {!panoSrc && !isExpanded && (
                      <button
                        className="absolute bottom-4 right-4 z-[101] p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(true);
                        }}
                      >
                        <Maximize size={24} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={theaterConfig.backgroundUrl}
                      alt="Theater Background"
                      className="w-full h-full object-cover"
                    />
                    {/* Play Button positioned at Video Coordinates - Matching Hotspot Style */}
                    <div
                      className="absolute cursor-pointer z-0 group"
                      style={getVideoStyle()}
                      onClick={handleOpenInput}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500">
                          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gold-500/50 group-hover:bg-white/10 transition-all duration-300 transform group-hover:scale-110"></div>
                          <div className="absolute inset-0 bg-gold-500/30 rounded-full animate-ping opacity-0 group-hover:opacity-30"></div>
                          <div className="relative z-10 bg-black/60 p-2 rounded-full border border-gold-500/50 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <img
                              src={gameConfig.hotspotIconUrl}
                              alt="Play"
                              className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                            />
                          </div>
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-gold-500/30 text-gold-100 text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap font-serif transform translate-y-2 group-hover:translate-y-0 shadow-lg z-20">
                          Stream
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Merchandise Overlay - Persistent until page refresh or player expanded */}
                {isMerchandiseActive && !isBrowserFullscreen && (
                  <MerchandiseOverlay
                    merchandiseHotspots={gameConfig.merchandiseHotspots}
                    onHotspotClick={setActiveHotspot}
                    merchandiseHotspotIconUrl={gameConfig.merchandiseHotspotIconUrl || gameConfig.hotspotIconUrl}
                    onClose={() => setIsMerchandiseActive(false)}
                  />
                )}

                {/* Hotspot Layer */}
                {!isBrowserFullscreen && (
                  <HotspotLayer
                    hotspots={gameConfig.hotspots.filter(h =>
                      !(isMerchandiseActive && (h.id === 'merchandise' || h.label.toLowerCase() === 'merchandise'))
                    )}
                    iconUrl={gameConfig.hotspotIconUrl}
                    onHotspotClick={handleHotspotClick}
                  />
                )}

                {/* Info Modal (Modals only) */}
                <InfoModal
                  data={activeHotspot}
                  onClose={() => setActiveHotspot(null)}
                  onPosterClick={handlePosterClick}
                />

                {/* Centered Input Overlay */}
                {showInput && (
                  <div
                    className="absolute inset-0 flex items-start justify-center pt-4 sm:pt-16 bg-black/60 backdrop-blur-sm z-[110]"
                    onClick={handleCloseInput}
                  >
                    <div
                      className="w-full max-w-md px-4 sm:px-8"
                      onClick={(e) => {
                        console.log('Form container clicked, stopping propagation');
                        e.stopPropagation();
                      }}
                    >
                      <div className="flex justify-center mb-3 sm:mb-6">
                        <img
                          src="https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png"
                          alt="Hoosier Illusions Logo"
                          className="w-16 h-16 sm:w-32 sm:h-32 object-contain"
                        />
                      </div>
                      <form onSubmit={handleTriggerSubmit}>
                        <div className="relative">
                          <input
                            type="text"
                            name="trigger"
                            value={trigger}
                            onChange={(e) => setTrigger(e.target.value)}
                            onFocus={() => {
                              setTrigger('');
                              setIsDropdownOpen(true);
                            }}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                            placeholder="Type a trigger word or ask me anything..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                            aria-label="Trigger Word"
                            autoComplete="off"
                            autoFocus
                          />
                          {isDropdownOpen && (
                            <>
                              <p className="absolute left-2 -bottom-5 sm:-bottom-6 text-xs text-gray-400 italic pointer-events-none">
                                shortcuts
                              </p>
                              <ul className="absolute z-10 w-full bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg top-full mt-6 sm:mt-8 max-h-48 sm:max-h-60 overflow-y-auto shadow-lg">
                                {filteredMappings.length > 0 ? (
                                  filteredMappings.map((key) => (
                                    <li
                                      key={key}
                                      onMouseDown={() => {
                                        handleDropdownItemClick(key);
                                        handleTriggerSuccess();
                                      }}
                                      className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-white hover:bg-indigo-600 cursor-pointer"
                                    >
                                      {key}
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-500 cursor-default">
                                    {Object.keys(mappings).length > 0 ? 'No matches found.' : 'No mappings configured.'}
                                  </li>
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </form>

                      {isLoadingChat && (
                        <div className="text-center mt-4">
                          <p className="text-gray-400 text-sm">Thinking...</p>
                        </div>
                      )}

                      {chatResponse && (
                        <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
                          <p className="text-sm text-gray-200">{chatResponse}</p>
                        </div>
                      )}

                      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                    </div>
                  </div>
                )}

                {/* Now Playing Info - Hide if Merchandise Overlay is active */}
                {!isInitialState && !isMerchandiseActive && (!activeHotspot || (activeHotspot.id !== 'merchandise' && activeHotspot.label.toLowerCase() !== 'merchandise')) && (
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10 pointer-events-none">
                    <div className="w-full p-4">
                      {audioSrc && audioSrc.includes('/radio.mp3') ? (
                        // Live Stream UI
                        nowPlaying ? (
                          <div className="overflow-hidden drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                            <p className="text-xs text-cyan-400 font-bold tracking-wider">LIVE STREAM</p>
                            <h3 className="text-lg font-bold text-white truncate">{nowPlaying.now_playing.song.title}</h3>
                            <p className="text-xs text-gray-400 truncate">{nowPlaying.now_playing.song.artist} - {nowPlaying.now_playing.song.album}</p>
                            <div className="mt-2 pt-2">
                              <p className="text-xs text-gray-500 font-bold tracking-wider">UP NEXT</p>
                              <p className="text-sm text-gray-400 truncate">{nowPlaying.playing_next.song.title}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                            <p>Loading stream details...</p>
                          </div>
                        )
                      ) : currentMapping ? (
                        // On-Demand UI
                        <div className="overflow-hidden drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                          <p className="text-xs text-gold-500 font-bold tracking-wider">NOW PLAYING</p>
                          <h3 className="text-lg font-bold text-white truncate">{currentMapping.title || 'Unknown Title'}</h3>
                          <p className="text-xs text-gray-400 truncate">
                            {currentMapping.artist ? `${currentMapping.artist} - ` : ''}
                            {currentMapping.album || ''}
                          </p>
                          {/* Up Next for Playlist */}
                          {playlist.length > 0 && currentTrackIndex < playlist.length - 1 && (
                            <div className="mt-2 pt-2">
                              <p className="text-xs text-gray-500 font-bold tracking-wider">UP NEXT</p>
                              <p className="text-sm text-gray-400 truncate">{playlist[currentTrackIndex + 1].media.title}</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc || ''}
        loop={playlist.length === 0 && audioSrc && !audioSrc.includes('/radio.mp3')}
        onEnded={handleTrackEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio error:', e)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        mappings={mappings}
        onAddMapping={addMapping}
        onDeleteMapping={deleteMapping}
        onUpdateMapping={updateMapping}
        theaterConfig={theaterConfig}
        onUpdateTheaterConfig={saveTheaterConfig}
        videoPosition={videoPosition}
        onUpdateVideoPosition={handleUpdateVideoPosition}
        onSaveVideoPosition={saveVideoPosition}
        gameConfig={gameConfig}
        onUpdateGameConfig={saveGameConfig}
        onResetGameConfig={resetGameConfig}
      />
    </>
  );
};

export default App;