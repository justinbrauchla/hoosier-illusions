
import React, { useState } from 'react';
import { GameConfig, HotspotData, ContentItem } from '../types';
import { X, Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight, ImageIcon, Film, Check } from 'lucide-react';

interface AdminPanelProps {
  config: GameConfig;
  onSave: (newConfig: GameConfig) => void;
  onClose: () => void;
  onReset: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onSave, onClose, onReset }) => {
  const [formData, setFormData] = useState<GameConfig>(config);
  const [expandedHotspot, setExpandedHotspot] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleChange = (field: keyof GameConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Hotspot Management
  const updateHotspot = (index: number, field: keyof HotspotData, value: any) => {
    const newHotspots = [...formData.hotspots];
    newHotspots[index] = { ...newHotspots[index], [field]: value };
    setFormData(prev => ({ ...prev, hotspots: newHotspots }));
  };

  // Content Card Management
  const updateContent = (hotspotIndex: number, contentIndex: number, field: keyof ContentItem, value: any) => {
    const newHotspots = [...formData.hotspots];
    const newContents = [...newHotspots[hotspotIndex].contents];
    newContents[contentIndex] = { ...newContents[contentIndex], [field]: value };
    newHotspots[hotspotIndex].contents = newContents;
    setFormData(prev => ({ ...prev, hotspots: newHotspots }));
  };

  const addContent = (hotspotIndex: number) => {
    const newHotspots = [...formData.hotspots];
    newHotspots[hotspotIndex].contents.push({
      title: 'New Item',
      description: 'Description here...',
      imagePlaceholder: 'Placeholder Text',
      linkUrl: ''
    });
    setFormData(prev => ({ ...prev, hotspots: newHotspots }));
  };

  const removeContent = (hotspotIndex: number, contentIndex: number) => {
    const newHotspots = [...formData.hotspots];
    newHotspots[hotspotIndex].contents = newHotspots[hotspotIndex].contents.filter((_, i) => i !== contentIndex);
    setFormData(prev => ({ ...prev, hotspots: newHotspots }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-900/50 rounded-lg">
      {/* Header */}
      <div className="bg-black/50 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-gold-500 font-serif text-lg uppercase tracking-widest flex items-center gap-2">
          <SettingsIcon size={20} /> Hotspot Config
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset to default settings? All changes will be lost.')) {
                onReset();
              }
            }}
            className="px-3 py-1.5 bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 rounded flex items-center gap-2 transition-colors text-xs"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={async () => {
              setSaveStatus('saving');
              onSave(formData);
              setSaveStatus('saved');
              setTimeout(() => setSaveStatus('idle'), 2000);
            }}
            disabled={saveStatus === 'saving'}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all text-xs font-bold ${saveStatus === 'saved'
              ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              : 'bg-gold-600 text-black hover:bg-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              } ${saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saveStatus === 'saved' ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> {saveStatus === 'saving' ? 'Saving...' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* General Settings */}
          <section className="bg-black/50 border border-gold-600/30 rounded-lg p-6">
            <h2 className="text-lg font-serif text-gold-100 mb-4 border-b border-gold-600/20 pb-2 flex items-center gap-2">
              <ImageIcon size={18} /> Global Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-gray-500">Hotspot Icon URL</label>
                <input
                  type="text"
                  value={formData.hotspotIconUrl}
                  onChange={(e) => handleChange('hotspotIconUrl', e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-gray-300 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Hotspots Editor */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-serif text-gold-100 border-b border-gold-600/20 pb-2">Interactive Hotspots</h2>
              <span className="text-xs text-gray-500 italic">Structure Locked</span>
            </div>

            <div className="space-y-4">
              {formData.hotspots.map((hotspot, hIndex) => (
                <div key={hotspot.id} className="bg-black/50 border border-gray-800 rounded-lg overflow-hidden">
                  {/* Hotspot Header */}
                  <div
                    className="p-4 bg-gray-900/50 flex justify-between items-center cursor-pointer hover:bg-gray-900 transition-colors"
                    onClick={() => setExpandedHotspot(expandedHotspot === hotspot.id ? null : hotspot.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedHotspot === hotspot.id ? <ChevronDown size={16} className="text-gold-500" /> : <ChevronRight size={16} className="text-gray-500" />}
                      <span className="font-bold text-gray-200">{hotspot.label || 'Unnamed Hotspot'}</span>
                      <span className="text-xs text-gray-600 mono">({hotspot.top}%, {hotspot.left}%)</span>
                    </div>
                  </div>

                  {/* Hotspot Body */}
                  {expandedHotspot === hotspot.id && (
                    <div className="p-6 border-t border-gray-800 space-y-6 animate-fade-in">
                      {/* Position & Label */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-xs uppercase text-gray-500 block mb-1">Label</label>
                          <input type="text" value={hotspot.label} onChange={(e) => updateHotspot(hIndex, 'label', e.target.value)} className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                        <div>
                          <label className="text-xs uppercase text-gray-500 block mb-1">Top %</label>
                          <input type="number" value={hotspot.top} onChange={(e) => updateHotspot(hIndex, 'top', Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                        <div>
                          <label className="text-xs uppercase text-gray-500 block mb-1">Left %</label>
                          <input type="number" value={hotspot.left} onChange={(e) => updateHotspot(hIndex, 'left', Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                        <div>
                          <label className="text-xs uppercase text-gray-500 block mb-1">Width %</label>
                          <input type="number" value={hotspot.width} onChange={(e) => updateHotspot(hIndex, 'width', Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                      </div>

                      {/* Poster Overlay URL for Album Posters */}
                      {hotspot.id === 'posters-left' && (
                        <div className="bg-black/40 rounded border border-gray-800 p-4 mb-4">
                          <label className="text-xs uppercase text-gray-500 block mb-2">Poster Cutout Overlay URL</label>
                          <input
                            type="text"
                            placeholder="Static poster frame/cutout image URL"
                            value={hotspot.posterOverlayUrl || ''}
                            onChange={(e) => updateHotspot(hIndex, 'posterOverlayUrl', e.target.value)}
                            className="w-full bg-transparent border-b border-gray-700 text-sm text-gold-100 focus:border-gold-500 focus:outline-none py-2"
                          />
                          <p className="text-xs text-gray-600 mt-2 italic">This image stays static while the content URLs rotate behind it.</p>
                        </div>
                      )}

                      {/* Contents List */}
                      <div className="bg-black/40 rounded border border-gray-800 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-bold text-gray-400 uppercase">Content Cards</h4>
                          <button onClick={() => addContent(hIndex)} className="text-xs text-gold-500 hover:text-gold-300 flex items-center gap-1">
                            <Plus size={12} /> Add Card
                          </button>
                        </div>

                        <div className="space-y-4">
                          {hotspot.id === 'posters-left' ? (
                            // Simplified UI for Album Posters
                            <div className="space-y-3">
                              <p className="text-xs text-gray-500 italic">Add multiple image/video URLs that will play behind the poster cutout.</p>
                              {hotspot.contents.map((content, cIndex) => (
                                <div key={cIndex} className="flex items-center gap-3 bg-gray-900/30 p-2 rounded border border-gray-800">
                                  <span className="text-gray-500 text-xs font-mono w-6 text-right">{cIndex + 1}.</span>
                                  <input
                                    type="text"
                                    placeholder="Background Image/Video URL"
                                    value={content.imagePlaceholder}
                                    onChange={(e) => updateContent(hIndex, cIndex, 'imagePlaceholder', e.target.value)}
                                    className="flex-1 bg-transparent border-b border-gray-700 text-sm text-gold-100 focus:border-gold-500 focus:outline-none py-1"
                                  />
                                  <div className="flex items-center gap-2 w-24 border-l border-gray-800 pl-2">
                                    <span className="text-[10px] text-gray-500 uppercase">Scale</span>
                                    <input
                                      type="number"
                                      step="0.05"
                                      min="0.1"
                                      max="2.0"
                                      value={content.scale || 1}
                                      onChange={(e) => updateContent(hIndex, cIndex, 'scale', parseFloat(e.target.value))}
                                      className="w-full bg-transparent border-b border-gray-700 text-sm text-gold-100 focus:border-gold-500 focus:outline-none py-1 text-center"
                                    />
                                  </div>
                                  <button onClick={() => removeContent(hIndex, cIndex)} className="text-gray-600 hover:text-red-500 p-1 hover:bg-red-900/20 rounded">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Standard UI for other hotspots
                            hotspot.contents.map((content, cIndex) => (
                              <div key={cIndex} className="grid grid-cols-12 gap-4 items-start border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                                <div className="col-span-11 space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Title"
                                    value={content.title}
                                    onChange={(e) => updateContent(hIndex, cIndex, 'title', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-700 text-gold-100 font-serif focus:border-gold-500 focus:outline-none"
                                  />
                                  <textarea
                                    placeholder="Description"
                                    value={content.description}
                                    onChange={(e) => updateContent(hIndex, cIndex, 'description', e.target.value)}
                                    className="w-full bg-transparent border border-gray-700 rounded p-2 text-sm text-gray-400 focus:border-gold-500 focus:outline-none h-20"
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Image Placeholder / Poster URL"
                                      value={content.imagePlaceholder}
                                      onChange={(e) => updateContent(hIndex, cIndex, 'imagePlaceholder', e.target.value)}
                                      className="w-full bg-transparent border-b border-gray-700 text-xs text-gray-500 focus:border-gray-500 focus:outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Image Link URL (Optional)"
                                      value={content.linkUrl || ''}
                                      onChange={(e) => updateContent(hIndex, cIndex, 'linkUrl', e.target.value)}
                                      className="w-full bg-transparent border-b border-gray-700 text-xs text-blue-400 focus:border-blue-500 focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="col-span-1 text-right">
                                  <button onClick={() => removeContent(hIndex, cIndex)} className="text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const SettingsIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
