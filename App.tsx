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
  const [showInput, setShowInput] = useState(false); // Hide input initially
  const [currentMapping, setCurrentMapping] = useState<MappingValue | null>(null);
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const [isInitialState, setIsInitialState] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
      top: `${top - height / 2}%`,
      left: `${left - width / 2}%`,
      width: `${width}%`,
      height: `${height}%`
    };
  };

  // Custom hooks - Autoplay muted to allow browser autoplay
  const { audioRef, isMuted, setIsMuted, play } = useMediaController(audioSrc, true);
  const { nowPlaying, albumArt } = useNowPlaying(audioSrc, mappings, setVideoSrc, setImageSrc, setCurrentMapping, isInitialState);

  // Handle Input Window State
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
    setActiveHotspot(hotspot);
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
      .then(config => setGameConfig(config))
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

  const playTrigger = (key: string) => {
    const triggerKey = key.trim().toLowerCase();
    const mapping = mappings[triggerKey];
    if (mapping) {
      setCurrentMapping(mapping);
      setIsInitialState(false);
      setIsMuted(false);
      setVideoSrc(mapping.videoUrl || null);
      setImageSrc(mapping.imageUrl || null);

      let newAudioUrl = mapping.audioUrl || null;
      // Force reload of stream by appending timestamp to ensure live edge playback
      if (newAudioUrl && newAudioUrl.includes('radio.mp3')) {
        const separator = newAudioUrl.includes('?') ? '&' : '?';
        newAudioUrl = `${newAudioUrl}${separator}t=${Date.now()}`;
      }
      setAudioSrc(newAudioUrl);
      setPanoSrc(mapping.panoUrl || null);
      setError(null);
    } else {
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



  return (
    <>
      <audio ref={audioRef} loop />
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
                            className="w-full h-full cursor-pointer relative z-50"
                            onClick={handleOpenInput}
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
                            className="w-full h-full cursor-pointer relative z-50 bg-black flex items-center justify-center"
                            onClick={handleOpenInput}
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
                            <div className={isExpanded ? "fixed inset-0 z-[100] bg-black flex items-center justify-center" : "absolute cursor-pointer z-0"}
                              style={isExpanded ? {} : getVideoStyle()}
                              onClick={handleOpenInput}
                            >
                              <img
                                src={effectiveImageSrc}
                                alt="Cover"
                                className="w-full h-full object-contain"
                                crossOrigin="anonymous"
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
                          Albums
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hotspot Layer - Always visible except in browser fullscreen */}
                {!isBrowserFullscreen && (
                  <HotspotLayer
                    hotspots={gameConfig.hotspots}
                    iconUrl={gameConfig.hotspotIconUrl}
                    onHotspotClick={handleHotspotClick}
                  />
                )}



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


                {/* Only show Now Playing when not in initial state */}
                {!isInitialState && audioSrc && audioSrc.includes('/radio.mp3') && (
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10 pointer-events-none">
                    <div className="w-full p-4">
                      {nowPlaying ? (
                        <div className="overflow-hidden drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                          <p className="text-xs text-cyan-400 font-bold tracking-wider">NOW PLAYING</p>
                          <h3 className="text-lg font-bold text-white truncate">{nowPlaying.now_playing.song.title}</h3>
                          <p className="text-xs text-gray-400 truncate">{nowPlaying.now_playing.song.album}</p>
                          <div className="mt-2 pt-2">
                            <p className="text-xs text-gray-500 font-bold tracking-wider">UP NEXT</p>
                            <p className="text-sm text-gray-400 truncate">{nowPlaying.playing_next.song.title}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                          <p>Loading stream details...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

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
      <InfoModal
        data={activeHotspot}
        onClose={() => setActiveHotspot(null)}
      />
    </>
  );
};

export default App;