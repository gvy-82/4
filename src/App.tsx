import { useState, useEffect, useRef, useCallback } from 'react';
import StationList from './components/StationList';
import Player from './components/Player';
import type { RadioStation } from './types';

const API_BASE = 'https://de1.api.radio-browser.info/json';

function App() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [stationSearch, setStationSearch] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const url = `${API_BASE}/stations/bycountryexact/Russia?hidebroken=true&order=clickcount&reverse=true&limit=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data: RadioStation[] = await res.json();
        setStations(data);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setStations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, []);

  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    (s.tags && s.tags.toLowerCase().includes(stationSearch.toLowerCase()))
  );

  const handlePlay = useCallback(() => {
    if (!currentStation || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentStation.url_resolved || currentStation.url;
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      audio.src = `https://corsproxy.io/?${encodeURIComponent(currentStation.url_resolved || currentStation.url)}`;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        alert('Не удалось воспроизвести эту станцию. Попробуйте другую.');
      });
    });
  }, [currentStation]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSelectStation = useCallback((station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.src = station.url_resolved || station.url;
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          audio.src = `https://corsproxy.io/?${encodeURIComponent(station.url_resolved || station.url)}`;
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            alert('Не удалось воспроизвести эту станцию.');
          });
        });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <audio ref={audioRef} preload="none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎵 Russian Radio
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Радиостанции России
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[600px]">
            <StationList
              stations={filteredStations}
              currentStation={currentStation}
              onSelectStation={handleSelectStation}
              isLoading={isLoading}
              searchQuery={stationSearch}
              onSearchChange={setStationSearch}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Player
              station={currentStation}
              isPlaying={isPlaying}
              volume={volume}
              onVolumeChange={setVolume}
              onPlay={handlePlay}
              onPause={handlePause}
              audioRef={audioRef}
            />
          </div>
        </div>

        <footer className="text-center mt-6 text-xs text-gray-600">
          <p>Радиостанции предоставлены Radio Browser API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
