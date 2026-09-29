import { useRef, useEffect } from 'react';
import type { RadioStation } from '../types';

interface PlayerProps {
  station: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onPlay: () => void;
  onPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const Player = ({
  station,
  isPlaying,
  volume,
  onVolumeChange,
  onPlay,
  onPause,
  audioRef,
}: PlayerProps) => {
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  if (!station) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>Выберите станцию</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '📻';
              }}
            />
          ) : (
            <span className="text-2xl">📻</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg truncate text-white">{station.name}</h2>
          <p className="text-sm truncate text-gray-400">
            {station.tags && station.tags.split(',').slice(0, 2).join(', ')}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isPlaying ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse' : 'bg-gray-600'
            }`}
            style={{ width: isPlaying ? '100%' : '0%' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {isPlaying ? '● LIVE' : '○ Пауза'}
          </span>
          {station.bitrate > 0 && (
            <span className="text-xs text-gray-500">{station.bitrate} kbps</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#7c3aed' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
