import React, { useState, useEffect, useRef, useCallback } from 'react';
import CountryList from './components/CountryList';
import StationList from './components/StationList';
import Player from './components/Player';
import Equalizer from './components/Equalizer';
import { useAudioEngine } from './hooks/useAudioEngine';
import { RadioStation, Country } from './types';

const API_BASE = 'https://de1.api.radio-browser.info/json';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [countrySearch, setCountrySearch] = useState('');
  const [stationSearch, setStationSearch] = useState('');
  const [audioInitialized, setAudioInitialized] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioEngine = useAudioEngine();

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${API_BASE}/countries?order=stationcount&reverse=true&hidebroken=true`);
        const data: Country[] = await res.json();
        setCountries(data.filter((c) => c.stationcount > 10).slice(0, 100));
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch stations when country changes
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        let url: string;
        if (selectedCountry) {
          url = `${API_BASE}/stations/bycountry/${encodeURIComponent(selectedCountry)}?hidebroken=true&order=clickcount&reverse=true&limit=100`;
        } else {
          url = `${API_BASE}/stations/topclick/100?hidebroken=true`;
        }
        const res = await fetch(url);
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
  }, [selectedCountry]);

  // Filter stations by search
  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.tags.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const initAudio = useCallback(() => {
    if (audioRef.current && !audioInitialized) {
      audioEngine.initAudioContext(audioRef.current);
      setAudioInitialized(true);
    }
  }, [audioEngine, audioInitialized]);

  const handlePlay = useCallback(() => {
    if (!currentStation || !audioRef.current) return;

    initAudio();
    audioEngine.resumeContext();

    audioRef.current.src = currentStation.url_resolved || currentStation.url;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.error('Playback failed:', err);
      // Try with CORS proxy
      audioRef.current!.src = `https://corsproxy.io/?${encodeURIComponent(currentStation.url_resolved || currentStation.url)}`;
      audioRef.current!.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        alert('Не удалось воспроизвести эту станцию. Попробуйте другую.');
      });
    });
  }, [currentStation, audioEngine, initAudio]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSelectStation = useCallback((station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(false);
    // Auto-play on selection
    setTimeout(() => {
      if (audioRef.current) {
        initAudio();
        audioEngine.resumeContext();
        audioRef.current.src = station.url_resolved || station.url;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Try CORS proxy
          audioRef.current!.src = `https://corsproxy.io/?${encodeURIComponent(station.url_resolved || station.url)}`;
          audioRef.current!.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            alert('Не удалось воспроизвести эту станцию.');
          });
        });
      }
    }, 100);
  }, [audioEngine, initAudio]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎵 Online Radio
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Слушайте радио со всего мира • Эквалайзер • Запись</p>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar - Countries */}
          <div className="lg:col-span-3 h-[500px] lg:h-[700px]">
            <CountryList
              countries={countries}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              searchQuery={countrySearch}
              onSearchChange={setCountrySearch}
            />
          </div>

          {/* Center - Stations */}
          <div className="lg:col-span-5 h-[500px] lg:h-[700px]">
            <StationList
              stations={filteredStations}
              currentStation={currentStation}
              onSelectStation={handleSelectStation}
              isLoading={isLoading}
              searchQuery={stationSearch}
              onSearchChange={setStationSearch}
            />
          </div>

          {/* Right sidebar - Player & EQ */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Player
              station={currentStation}
              isPlaying={isPlaying}
              isRecording={audioEngine.isRecording}
              recordingTime={audioEngine.recordingTime}
              onPlay={handlePlay}
              onPause={handlePause}
              onRecord={audioEngine.startRecording}
              onStopRecord={audioEngine.stopRecording}
              volume={volume}
              onVolumeChange={setVolume}
              audioRef={audioRef as React.RefObject<HTMLAudioElement>}
            />
            <Equalizer
              bands={audioEngine.bands}
              analyserData={audioEngine.analyserData}
              onBandChange={audioEngine.setBandGain}
              onReset={audioEngine.resetEQ}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6 text-gray-600 text-xs">
          <p>Радиостанции предоставлены Radio Browser API • Записи сохраняются в формате WebM</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
