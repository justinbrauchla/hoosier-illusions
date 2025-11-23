import React, { useState, useEffect } from 'react';
import { Mappings, MappingValue, GameConfig } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { AdminPanel as HotspotAdmin } from './HotspotAdmin';

interface TheaterConfig {
  backgroundUrl: string;
  maskUrl: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: Mappings;
  onAddMapping: (trigger: string, videoUrl: string, audioUrl: string, panoUrl: string, showInDropdown: boolean, muteVideo: boolean, playFullscreen: boolean) => Promise<void>;
  onDeleteMapping: (trigger: string) => void;
  onUpdateMapping: (trigger: string, videoUrl: string, audioUrl: string, panoUrl: string, showInDropdown: boolean, muteVideo: boolean, playFullscreen: boolean) => Promise<void>;
  theaterConfig: TheaterConfig;
  onUpdateTheaterConfig: (config: TheaterConfig) => void;
  videoPosition: { top: string; left: string; width: string; height: string };
  onUpdateVideoPosition: (position: { top: string; left: string; width: string; height: string }) => void;
  onSaveVideoPosition: (position: { top: string; left: string; width: string; height: string }) => void;
  gameConfig: GameConfig;
  onUpdateGameConfig: (config: GameConfig) => void;
  onResetGameConfig: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  mappings,
  onAddMapping,
  onDeleteMapping,
  onUpdateMapping,
  theaterConfig,
  onUpdateTheaterConfig,
  videoPosition,
  onUpdateVideoPosition,
  onSaveVideoPosition,
  gameConfig,
  onUpdateGameConfig,
  onResetGameConfig
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'mappings' | 'theater' | 'alignment' | 'hotspots'>('mappings');

  const [newTrigger, setNewTrigger] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newPanoUrl, setNewPanoUrl] = useState('');
  const [showInDropdown, setShowInDropdown] = useState(true);
  const [muteVideo, setMuteVideo] = useState(true);
  const [playFullscreen, setPlayFullscreen] = useState(false);

  const [editingTrigger, setEditingTrigger] = useState<string | null>(null);

  // Theater config local state
  const [backgroundUrl, setBackgroundUrl] = useState(theaterConfig.backgroundUrl);
  const [maskUrl, setMaskUrl] = useState(theaterConfig.maskUrl);

  useEffect(() => {
    setBackgroundUrl(theaterConfig.backgroundUrl);
    setMaskUrl(theaterConfig.maskUrl);
  }, [theaterConfig]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setPassword('');
      setIsAuthenticated(false);
      setError('');
      setNewTrigger('');
      setNewVideoUrl('');
      setNewAudioUrl('');
      setNewPanoUrl('');
      setShowInDropdown(true);
      setMuteVideo(true);
      setPlayFullscreen(false);
      setEditingTrigger(null);
      setActiveTab('mappings');
    }
  }, [isOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'boss') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (editingTrigger) {
        if (newVideoUrl.trim() || newAudioUrl.trim() || newPanoUrl.trim()) {
          await onUpdateMapping(editingTrigger, newVideoUrl, newAudioUrl, newPanoUrl, showInDropdown, muteVideo, playFullscreen);
        }
      } else {
        if (newTrigger.trim() && (newVideoUrl.trim() || newAudioUrl.trim() || newPanoUrl.trim())) {
          await onAddMapping(newTrigger, newVideoUrl, newAudioUrl, newPanoUrl, showInDropdown, muteVideo, playFullscreen);
        }
      }

      // Reset form only on success
      setNewTrigger('');
      setNewVideoUrl('');
      setNewAudioUrl('');
      setNewPanoUrl('');
      setShowInDropdown(true);
      setMuteVideo(true);
      setPlayFullscreen(false);
      setEditingTrigger(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save mapping');
    }
  }

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  const handleTriggerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trigger = e.target.value;
    setNewTrigger(trigger);

    // Only auto-fill if we are NOT editing an existing mapping
    if (!editingTrigger) {
      if (trigger.trim()) {
        const titleCaseTrigger = toTitleCase(trigger);

        // Video: Remove spaces from Title Case
        const videoTitle = titleCaseTrigger.replace(/\s+/g, '');
        const defaultVideoUrl = `https://storage.googleapis.com/hoosierillusionsvideos/${videoTitle}.mp4`;

        // Audio: Replace spaces with %20 in Title Case
        const audioTitle = titleCaseTrigger.replace(/\s+/g, '%20');
        const defaultAudioUrl = `https://storage.googleapis.com/hoosierillusionsaudio/${audioTitle}.mp3`;

        setNewVideoUrl(defaultVideoUrl);
        setNewAudioUrl(defaultAudioUrl);
      } else {
        setNewVideoUrl('');
        setNewAudioUrl('');
      }
    }
  };

  const handleStartEditing = (trigger: string) => {
    const mapping = mappings[trigger];
    if (mapping) {
      setEditingTrigger(trigger);
      setNewTrigger(trigger);
      setNewVideoUrl(mapping.videoUrl || '');
      setNewAudioUrl(mapping.audioUrl || '');
      setNewPanoUrl(mapping.panoUrl || '');
      setShowInDropdown(mapping.showInDropdown ?? true);
      setMuteVideo(mapping.muteVideo ?? true);
      setPlayFullscreen(mapping.playFullscreen ?? false);
    }
  };

  const handleCancelEditing = () => {
    setEditingTrigger(null);
    setNewTrigger('');
    setNewVideoUrl('');
    setNewAudioUrl('');
    setNewPanoUrl('');
    setShowInDropdown(true);
    setMuteVideo(true);
    setPlayFullscreen(false);
  };

  const handleSaveTheaterConfig = () => {
    onUpdateTheaterConfig({
      backgroundUrl,
      maskUrl
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">{isAuthenticated ? 'Admin Panel' : 'Admin Access'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 text-2xl">&times;</button>
        </header>

        {isAuthenticated && (
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('mappings')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${activeTab === 'mappings'
                ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              Station Mappings
            </button>
            <button
              onClick={() => setActiveTab('theater')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${activeTab === 'theater'
                ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              Theater Backgrounds
            </button>
            <button
              onClick={() => setActiveTab('alignment')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${activeTab === 'alignment'
                ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              Video Alignment
            </button>
            <button
              onClick={() => setActiveTab('hotspots')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${activeTab === 'hotspots'
                ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              Hotspots
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit}>
              <p className="text-gray-400 mb-4">Please enter the password to manage video triggers.</p>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>
          ) : activeTab === 'theater' ? (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Theater Background Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="background-url" className="block text-sm font-medium text-gray-400 mb-2">
                      Background Image URL
                    </label>
                    <input
                      id="background-url"
                      type="text"
                      value={backgroundUrl}
                      onChange={(e) => setBackgroundUrl(e.target.value)}
                      placeholder="https://storage.googleapis.com/..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The full theater image shown when no video is playing
                    </p>
                  </div>

                  <div>
                    <label htmlFor="mask-url" className="block text-sm font-medium text-gray-400 mb-2">
                      Theater Mask URL (Transparent Screen)
                    </label>
                    <input
                      id="mask-url"
                      type="text"
                      value={maskUrl}
                      onChange={(e) => setMaskUrl(e.target.value)}
                      placeholder="https://storage.googleapis.com/..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Theater frame overlay with transparent screen cutout
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Christmas Theme Presets</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBackgroundUrl('https://storage.googleapis.com/hoosierillusionsimages/christmas-front.png');
                          setMaskUrl('https://storage.googleapis.com/hoosierillusionsimages/christmas-front-transparent.png');
                        }}
                        className="bg-green-700 hover:bg-green-600 text-white text-sm py-2 px-3 rounded transition-colors"
                      >
                        🎄 Christmas Theme
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBackgroundUrl('https://storage.googleapis.com/hoosierillusionsimages/front.png');
                          setMaskUrl('https://storage.googleapis.com/hoosierillusionsimages/front-transparent.png');
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 px-3 rounded transition-colors"
                      >
                        🎭 Default Theme
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveTheaterConfig}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Save Theater Configuration
                </button>
              </div>
            </div>
          ) : activeTab === 'alignment' ? (
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Video Player Alignment</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Adjust the position and size of the video player to align with the theater mask cutout.
                  Values are in percentages relative to the container.
                </p>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Center Y ({parseFloat(videoPosition.top)}%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={parseFloat(videoPosition.top)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, top: `${e.target.value}%` })}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <input
                        type="number"
                        value={parseFloat(videoPosition.top)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, top: `${e.target.value}%` })}
                        className="w-20 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Center X ({parseFloat(videoPosition.left)}%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={parseFloat(videoPosition.left)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, left: `${e.target.value}%` })}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <input
                        type="number"
                        value={parseFloat(videoPosition.left)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, left: `${e.target.value}%` })}
                        className="w-20 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Width ({parseFloat(videoPosition.width)}%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={parseFloat(videoPosition.width)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, width: `${e.target.value}%` })}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <input
                        type="number"
                        value={parseFloat(videoPosition.width)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, width: `${e.target.value}%` })}
                        className="w-20 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Height ({parseFloat(videoPosition.height)}%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={parseFloat(videoPosition.height)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, height: `${e.target.value}%` })}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <input
                        type="number"
                        value={parseFloat(videoPosition.height)}
                        onChange={(e) => onUpdateVideoPosition({ ...videoPosition, height: `${e.target.value}%` })}
                        className="w-20 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSaveVideoPosition(videoPosition)}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Save Video Alignment
                </button>
              </div>
            </div>
          ) : activeTab === 'hotspots' ? (
            <div className="h-full">
              <HotspotAdmin
                config={gameConfig}
                onSave={onUpdateGameConfig}
                onClose={() => { }}
                onReset={onResetGameConfig}
              />
            </div>
          ) : (
            <div>
              <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{editingTrigger ? 'Edit Mapping' : 'Add New Mapping'}</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="trigger-word" className="block text-sm font-medium text-gray-400 mb-1">Trigger Word</label>
                    <input id="trigger-word" type="text" value={newTrigger} onChange={handleTriggerChange} placeholder="e.g., twister" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-800 disabled:text-gray-500" disabled={!!editingTrigger} />
                  </div>
                  <div>
                    <label htmlFor="video-url" className="block text-sm font-medium text-gray-400 mb-1">Video URL (Optional)</label>
                    <input id="video-url" type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4 (optional)" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="audio-url" className="block text-sm font-medium text-gray-400 mb-1">Audio URL (Optional)</label>
                    <input id="audio-url" type="url" value={newAudioUrl} onChange={(e) => setNewAudioUrl(e.target.value)} placeholder="https://example.com/audio.mp3" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="pano-url" className="block text-sm font-medium text-gray-400 mb-1">360 Pano URL (Optional)</label>
                    <input id="pano-url" type="url" value={newPanoUrl} onChange={(e) => setNewPanoUrl(e.target.value)} placeholder="https://example.com/pano" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="flex items-center pt-2">
                    <input
                      id="show-in-dropdown"
                      type="checkbox"
                      checked={showInDropdown}
                      onChange={(e) => setShowInDropdown(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="show-in-dropdown" className="ml-2 block text-sm text-gray-300">
                      Show in dropdown list
                    </label>
                  </div>
                  <div className="flex items-center pt-2">
                    <input
                      id="mute-video"
                      type="checkbox"
                      checked={muteVideo}
                      onChange={(e) => setMuteVideo(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="mute-video" className="ml-2 block text-sm text-gray-300">
                      Mute video (use audio URL instead)
                    </label>
                  </div>
                  <div className="flex items-center pt-2">
                    <input
                      id="play-fullscreen"
                      type="checkbox"
                      checked={playFullscreen}
                      onChange={(e) => setPlayFullscreen(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="play-fullscreen" className="ml-2 block text-sm text-gray-300">
                      Play fullscreen (no theater mask)
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    {editingTrigger ? 'Save Changes' : 'Add'}
                  </button>
                  {editingTrigger && (
                    <button type="button" onClick={handleCancelEditing} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div>
                <h3 className="text-lg font-semibold mb-3">Current Mappings</h3>
                {Object.keys(mappings).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No mappings yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(mappings).map(([trigger, value]: [string, MappingValue]) => {
                      const { videoUrl, audioUrl, showInDropdown, muteVideo } = value;
                      const isStream = audioUrl?.endsWith('/radio.mp3');
                      return (
                        <li key={trigger} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-md">
                          <div className="flex-1 overflow-hidden">
                            <p className="font-mono text-indigo-400 font-bold truncate flex items-center">
                              {trigger}
                              {isStream && (
                                <span className="ml-2 text-xs bg-cyan-500 text-white px-2 py-1 rounded-full font-sans font-bold">
                                  Stream
                                </span>
                              )}
                              {showInDropdown === false && (
                                <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded-full font-sans font-bold">
                                  Hidden
                                </span>
                              )}
                              {muteVideo === false && (
                                <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-sans font-bold">
                                  Video Audio
                                </span>
                              )}
                              {value.playFullscreen && (
                                <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-sans font-bold">
                                  Fullscreen
                                </span>
                              )}
                            </p>
                            <p className="text-gray-400 text-sm truncate" title={videoUrl}>Video: {videoUrl}</p>
                            {audioUrl && <p className="text-gray-500 text-xs truncate" title={audioUrl}>Audio: {audioUrl}</p>}
                            {value.panoUrl && <p className="text-indigo-400 text-xs truncate" title={value.panoUrl}>Pano: {value.panoUrl}</p>}
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <button onClick={() => handleStartEditing(trigger)} className="p-2 text-gray-400 hover:text-blue-400 rounded-full hover:bg-gray-600 transition-colors" aria-label={`Edit mapping for ${trigger}`}>
                              <EditIcon />
                            </button>
                            <button onClick={() => onDeleteMapping(trigger)} className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600 transition-colors" aria-label={`Delete mapping for ${trigger}`}>
                              <TrashIcon />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;