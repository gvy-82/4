import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import CountryList from './components/CountryList';
import StationList from './components/StationList';
import Player from './components/Player';
import Equalizer from './components/Equalizer';
import { useAudioEngine } from './hooks/useAudioEngine';
import { RadioStation, Country } from './types';

const API_BASE = 'https://de1.api.radio-browser.info/json';

// Theme context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

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
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('radio-theme');
    return saved ? saved === 'dark' : true;
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioEngine = useAudioEngine();

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('radio-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

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
    }).catch(() => {
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
    setTimeout(() => {
      if (audioRef.current) {
        initAudio();
        audioEngine.resumeContext();
        audioRef.current.src = station.url_resolved || station.url;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
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
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950'
          : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
      }`}>
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {isDark ? (
            <>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
            </>
          ) : (
            <>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />
            </>
          )}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} crossOrigin="anonymous" preload="none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
              }`}>
                🎵 Online Radio
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Слушайте радио со всего мира • Эквалайзер • Запись
              </p>
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all hover:scale-110 ${
                isDark
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-purple-600 hover:bg-gray-100 border border-gray-200 shadow-md'
              }`}
              title={isDark ? 'Светлая тема' : 'Тёмная тема'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
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
          <footer className={`text-center mt-6 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <p>Радиостанции предоставлены Radio Browser API • Записи сохраняются в формате WebM</p>
          </footer>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
