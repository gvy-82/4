import React, { useState } from 'react';
import { EQBandConfig } from '../hooks/useAudioEngine';

interface EqualizerProps {
  bands: EQBandConfig[];
  analyserData: Uint8Array;
  onBandChange: (index: number, gain: number) => void;
  onReset: () => void;
}

const PRESETS: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Rock': [5, 4, 3, 1, -1, -1, 0, 2, 3, 4],
  'Pop': [-1, 1, 3, 4, 3, 0, -1, -1, 0, 1],
  'Jazz': [3, 2, 1, 2, -1, -1, 0, 1, 2, 3],
  'Classical': [4, 3, 2, 1, -1, -1, 0, 2, 3, 4],
  'Bass': [6, 5, 4, 2, 0, -1, -2, -2, -2, -2],
  'Vocal': [-2, -1, 0, 2, 4, 4, 3, 1, 0, -1],
  'Electronic': [4, 3, 1, 0, -2, 2, 1, 3, 4, 5],
};

const Equalizer: React.FC<EqualizerProps> = ({ bands, analyserData, onBandChange, onReset }) => {
  const [activePreset, setActivePreset] = useState('Flat');
  const getBarHeight = (index: number) => {
    if (!analyserData || analyserData.length === 0) return 0;
    const step = Math.floor(analyserData.length / bands.length);
    const start = index * step;
    const end = start + step;
    const slice = analyserData.slice(start, end);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    return (avg / 255) * 100;
  };

  const handlePreset = (name: string) => {
    setActivePreset(name);
    const values = PRESETS[name];
    if (values) {
      values.forEach((gain, i) => onBandChange(i, gain));
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2v0a2 2 0 01-2 2H4a2 2 0 01-2-2v0z" />
          </svg>
          Эквалайзер
        </h3>
        <button
          onClick={() => { onReset(); setActivePreset('Flat'); }}
          className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-full border border-gray-600 hover:border-purple-500 transition-all"
        >
          Сброс
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => handlePreset(name)}
            className={`px-2 py-1 text-[10px] rounded-full transition-all ${
              activePreset === name
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-16 mb-4">
        {bands.map((_, i) => {
          const height = getBarHeight(i);
          return (
            <div
              key={`viz-${i}`}
              className="flex-1 rounded-t transition-all duration-75"
              style={{
                height: `${Math.max(height, 4)}%`,
                background: `linear-gradient(to top, #7c3aed, #ec4899)`,
                opacity: 0.7,
              }}
            />
          );
        })}
      </div>

      {/* EQ Sliders */}
      <div className="flex items-end justify-between gap-1">
        {bands.map((band, index) => (
          <div key={band.frequency} className="flex flex-col items-center flex-1">
            <div className="relative h-32 flex items-center">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={band.gain}
                onChange={(e) => onBandChange(index, parseFloat(e.target.value))}
                className="eq-slider w-32 -rotate-90 absolute"
                style={{ accentColor: '#7c3aed' }}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-1">{band.label}</span>
            <span className="text-[10px] text-purple-400">
              {band.gain > 0 ? '+' : ''}{band.gain.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equalizer;
