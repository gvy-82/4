import { useState, useRef, useCallback, useEffect } from 'react';
import type { RadioStation } from './types';

type Group = 'all' | 'record' | 'montecarlo' | 'dfm' | 'other';

const ALL_STATIONS: RadioStation[] = [
  // ===== RADIO RECORD (86) =====
  { id: 1, name: 'Radio Record', url: 'https://radiorecord.hostingradio.ru/rr_main96.aacp', tags: 'dance, electronic', group: 'record' },
  { id: 2, name: 'Record — Russian Mix', url: 'https://radiorecord.hostingradio.ru/rus96.aacp', tags: 'russian, pop', group: 'record' },
  { id: 3, name: 'Record — Супердискотека 90-х', url: 'https://radiorecord.hostingradio.ru/sd9096.aacp', tags: '90s, retro, dance', group: 'record' },
  { id: 4, name: 'Record — Chill-Out', url: 'https://radiorecord.hostingradio.ru/chil96.aacp', tags: 'chillout, lounge', group: 'record' },
  { id: 5, name: 'Record — Deep', url: 'https://radiorecord.hostingradio.ru/deep96.aacp', tags: 'deep house', group: 'record' },
  { id: 6, name: 'Record — Megamix', url: 'https://radiorecord.hostingradio.ru/mix96.aacp', tags: 'megamix, dance', group: 'record' },
  { id: 7, name: 'Record — Rock', url: 'https://radiorecord.hostingradio.ru/rock96.aacp', tags: 'rock', group: 'record' },
  { id: 8, name: 'Record — Remix', url: 'https://radiorecord.hostingradio.ru/rmx96.aacp', tags: 'remix, dance', group: 'record' },
  { id: 9, name: 'Record — Pirate Station', url: 'https://radiorecord.hostingradio.ru/ps96.aacp', tags: 'drum and bass, dnb', group: 'record' },
  { id: 10, name: 'Record — Trancemission', url: 'https://radiorecord.hostingradio.ru/tm96.aacp', tags: 'trance', group: 'record' },
  { id: 11, name: 'Record — Chill House', url: 'https://radiorecord.hostingradio.ru/chillhouse96.aacp', tags: 'chill, house', group: 'record' },
  { id: 12, name: 'Record — Big Hits', url: 'https://radiorecord.hostingradio.ru/bighits96.aacp', tags: 'hits, pop', group: 'record' },
  { id: 13, name: 'Record — Record 80-х', url: 'https://radiorecord.hostingradio.ru/198096.aacp', tags: '80s, retro', group: 'record' },
  { id: 14, name: 'Record — Рекорд 00-х', url: 'https://radiorecord.hostingradio.ru/200096.aacp', tags: '2000s, retro', group: 'record' },
  { id: 15, name: 'Record — Phonk', url: 'https://radiorecord.hostingradio.ru/phonk96.aacp', tags: 'phonk', group: 'record' },
  { id: 16, name: 'Record — Rap Hits', url: 'https://radiorecord.hostingradio.ru/rap96.aacp', tags: 'rap, hip-hop', group: 'record' },
  { id: 17, name: 'Record — Rap Classics', url: 'https://radiorecord.hostingradio.ru/rapclassics96.aacp', tags: 'rap, classics', group: 'record' },
  { id: 18, name: 'Record — Techno', url: 'https://radiorecord.hostingradio.ru/techno96.aacp', tags: 'techno', group: 'record' },
  { id: 19, name: 'Record — Trap', url: 'https://radiorecord.hostingradio.ru/trap96.aacp', tags: 'trap', group: 'record' },
  { id: 20, name: 'Record — Dubstep', url: 'https://radiorecord.hostingradio.ru/dub96.aacp', tags: 'dubstep', group: 'record' },
  { id: 21, name: 'Record — Hardstyle', url: 'https://radiorecord.hostingradio.ru/teo96.aacp', tags: 'hardstyle', group: 'record' },
  { id: 22, name: 'Record — EDM', url: 'https://radiorecord.hostingradio.ru/club96.aacp', tags: 'edm, club', group: 'record' },
  { id: 23, name: 'Record — House Hits', url: 'https://radiorecord.hostingradio.ru/househits96.aacp', tags: 'house', group: 'record' },
  { id: 24, name: 'Record — Tech House', url: 'https://radiorecord.hostingradio.ru/techouse96.aacp', tags: 'tech house', group: 'record' },
  { id: 25, name: 'Record — Lo-Fi', url: 'https://radiorecord.hostingradio.ru/lofi96.aacp', tags: 'lo-fi, chill', group: 'record' },
  { id: 26, name: 'Record — Synthwave', url: 'https://radiorecord.hostingradio.ru/synth96.aacp', tags: 'synthwave', group: 'record' },
  { id: 27, name: 'Record — Tropical', url: 'https://radiorecord.hostingradio.ru/trop96.aacp', tags: 'tropical', group: 'record' },
  { id: 28, name: 'Record — Eurodance', url: 'https://radiorecord.hostingradio.ru/eurodance96.aacp', tags: 'eurodance', group: 'record' },
  { id: 29, name: 'Record — GOA/PSY', url: 'https://radiorecord.hostingradio.ru/goa96.aacp', tags: 'goa, psytrance', group: 'record' },
  { id: 30, name: 'Record — DnB Classics', url: 'https://radiorecord.hostingradio.ru/drumhits96.aacp', tags: 'dnb', group: 'record' },
  { id: 31, name: 'Record — Armin van Buuren', url: 'https://radiorecord.hostingradio.ru/armin96.aacp', tags: 'trance', group: 'record' },
  { id: 32, name: 'Record — Tiesto', url: 'https://radiorecord.hostingradio.ru/tiesto96.aacp', tags: 'trance', group: 'record' },
  { id: 33, name: 'Record — David Guetta', url: 'https://radiorecord.hostingradio.ru/guetta96.aacp', tags: 'edm', group: 'record' },
  { id: 34, name: 'Record — Martin Garrix', url: 'https://radiorecord.hostingradio.ru/martingarrix64.aacp', tags: 'edm', group: 'record' },
  { id: 35, name: 'Record — A State of Trance', url: 'https://radiorecord.hostingradio.ru/asot64.aacp', tags: 'trance', group: 'record' },
  { id: 36, name: 'Record — Uplifting', url: 'https://radiorecord.hostingradio.ru/uplift96.aacp', tags: 'uplifting', group: 'record' },
  { id: 37, name: 'Record — Progressive', url: 'https://radiorecord.hostingradio.ru/progr96.aacp', tags: 'progressive', group: 'record' },
  { id: 38, name: 'Record — Ambient', url: 'https://radiorecord.hostingradio.ru/ambient96.aacp', tags: 'ambient', group: 'record' },
  { id: 39, name: 'Record — Neurofunk', url: 'https://radiorecord.hostingradio.ru/neurofunk96.aacp', tags: 'neurofunk', group: 'record' },
  { id: 40, name: 'Record — Liquid Funk', url: 'https://radiorecord.hostingradio.ru/liquidfunk96.aacp', tags: 'liquid funk', group: 'record' },
  { id: 41, name: 'Record — Future Bass', url: 'https://radiorecord.hostingradio.ru/fbass96.aacp', tags: 'future bass', group: 'record' },
  { id: 42, name: 'Record — Future House', url: 'https://radiorecord.hostingradio.ru/fut96.aacp', tags: 'future house', group: 'record' },
  { id: 43, name: 'Record — Bass House', url: 'https://radiorecord.hostingradio.ru/jackin96.aacp', tags: 'bass house', group: 'record' },
  { id: 44, name: 'Record — Breaks', url: 'https://radiorecord.hostingradio.ru/brks96.aacp', tags: 'breaks', group: 'record' },
  { id: 45, name: 'Record — Jungle', url: 'https://radiorecord.hostingradio.ru/jungle96.aacp', tags: 'jungle', group: 'record' },
  { id: 46, name: 'Record — Electro', url: 'https://radiorecord.hostingradio.ru/elect96.aacp', tags: 'electro', group: 'record' },
  { id: 47, name: 'Record — Rave FM', url: 'https://radiorecord.hostingradio.ru/rave96.aacp', tags: 'rave', group: 'record' },
  { id: 48, name: 'Record — Hard Bass', url: 'https://radiorecord.hostingradio.ru/hbass96.aacp', tags: 'hard bass', group: 'record' },
  { id: 49, name: 'Record — Russian Gold', url: 'https://radiorecord.hostingradio.ru/russiangold96.aacp', tags: 'russian', group: 'record' },
  { id: 50, name: 'Record — Руки Вверх!', url: 'https://radiorecord.hostingradio.ru/rv96.aacp', tags: 'russian, pop', group: 'record' },
  { id: 51, name: 'Record — Нафталин FM', url: 'https://radiorecord.hostingradio.ru/naft96.aacp', tags: 'retro', group: 'record' },
  { id: 52, name: 'Record — Медляк FM', url: 'https://radiorecord.hostingradio.ru/mdl96.aacp', tags: 'slow', group: 'record' },
  { id: 53, name: 'Record — Party 24/7', url: 'https://radiorecord.hostingradio.ru/party96.aacp', tags: 'party', group: 'record' },
  { id: 54, name: 'Record — Beach Party', url: 'https://radiorecord.hostingradio.ru/beach64.aacp', tags: 'beach', group: 'record' },
  { id: 55, name: 'Record — На шашлыки!', url: 'https://radiorecord.hostingradio.ru/nashashlyki96.aacp', tags: 'russian', group: 'record' },
  { id: 56, name: 'Record — Black Rap', url: 'https://radiorecord.hostingradio.ru/yo96.aacp', tags: 'rap', group: 'record' },
  { id: 57, name: 'Record — Technopop', url: 'https://radiorecord.hostingradio.ru/technopop96.aacp', tags: 'technopop', group: 'record' },
  { id: 58, name: 'Record — Dream Dance', url: 'https://radiorecord.hostingradio.ru/dream96.aacp', tags: 'dream', group: 'record' },
  { id: 59, name: 'Record — Disco/Funk', url: 'https://radiorecord.hostingradio.ru/discofunk96.aacp', tags: 'disco, funk', group: 'record' },
  { id: 60, name: 'Record — Afro House', url: 'https://radiorecord.hostingradio.ru/afro64.aacp', tags: 'afro', group: 'record' },
  { id: 61, name: 'Record — Organic', url: 'https://radiorecord.hostingradio.ru/organic96.aacp', tags: 'organic', group: 'record' },
  { id: 62, name: 'Record — VIP House', url: 'https://radiorecord.hostingradio.ru/vip96.aacp', tags: 'vip house', group: 'record' },
  { id: 63, name: 'Record — Workout', url: 'https://radiorecord.hostingradio.ru/workout96.aacp', tags: 'workout', group: 'record' },
  { id: 64, name: 'Record — Latina Dance', url: 'https://radiorecord.hostingradio.ru/latina96.aacp', tags: 'latina', group: 'record' },
  { id: 65, name: 'Record — Reggae', url: 'https://radiorecord.hostingradio.ru/reggae96.aacp', tags: 'reggae', group: 'record' },
  { id: 66, name: 'Record — Darkside', url: 'https://radiorecord.hostingradio.ru/darkside96.aacp', tags: 'dark', group: 'record' },
  { id: 67, name: 'Record — Future Rave', url: 'https://radiorecord.hostingradio.ru/futurerave96.aacp', tags: 'future rave', group: 'record' },
  { id: 68, name: 'Record — Minimal/Tech', url: 'https://radiorecord.hostingradio.ru/mini96.aacp', tags: 'minimal', group: 'record' },
  { id: 69, name: 'Record — Dream Pop', url: 'https://radiorecord.hostingradio.ru/dreampop96.aacp', tags: 'dream pop', group: 'record' },
  { id: 70, name: 'Record — Moombahton', url: 'https://radiorecord.hostingradio.ru/mmbt96.aacp', tags: 'moombahton', group: 'record' },
  { id: 71, name: 'Record — Midtempo', url: 'https://radiorecord.hostingradio.ru/mt96.aacp', tags: 'midtempo', group: 'record' },
  { id: 72, name: 'Record — Trance Classics', url: 'https://radiorecord.hostingradio.ru/trancehits96.aacp', tags: 'trance', group: 'record' },
  { id: 73, name: 'Record — Trancehouse', url: 'https://radiorecord.hostingradio.ru/trancehouse96.aacp', tags: 'trancehouse', group: 'record' },
  { id: 74, name: 'Record — House Classics', url: 'https://radiorecord.hostingradio.ru/houseclss96.aacp', tags: 'house', group: 'record' },
  { id: 75, name: 'Record — EDM Classics', url: 'https://radiorecord.hostingradio.ru/edmhits96.aacp', tags: 'edm', group: 'record' },
  { id: 76, name: 'Record — Lo-Fi House', url: 'https://radiorecord.hostingradio.ru/lofihouse64.aacp', tags: 'lo-fi house', group: 'record' },
  { id: 77, name: 'Record — Summer Lounge', url: 'https://radiorecord.hostingradio.ru/summerlounge64.aacp', tags: 'lounge', group: 'record' },
  { id: 78, name: 'Record — На Хайпе', url: 'https://radiorecord.hostingradio.ru/hype96.aacp', tags: 'hype', group: 'record' },
  { id: 79, name: 'Record — Колбасный Цех', url: 'https://radiorecord.hostingradio.ru/pump96.aacp', tags: 'hard', group: 'record' },
  { id: 80, name: 'Record — Tecktonik', url: 'https://radiorecord.hostingradio.ru/tecktonik96.aacp', tags: 'tecktonik', group: 'record' },
  { id: 81, name: 'Record — Симфония FM', url: 'https://radiorecord.hostingradio.ru/symph96.aacp', tags: 'symphonic', group: 'record' },
  { id: 82, name: 'Record — TOP 100 EDM', url: 'https://radiorecord.hostingradio.ru/top100edm96.aacp', tags: 'top edm', group: 'record' },
  { id: 83, name: 'Record — Gold', url: 'https://radiorecord.hostingradio.ru/gold96.aacp', tags: 'gold', group: 'record' },
  { id: 84, name: 'Record — Ibiza', url: 'https://radiorecord.hostingradio.ru/ibiza96.aacp', tags: 'ibiza', group: 'record' },
  { id: 85, name: 'Record — 10s Dance', url: 'https://radiorecord.hostingradio.ru/201096.aacp', tags: '2010s', group: 'record' },
  { id: 86, name: 'Record — 70s Dance', url: 'https://radiorecord.hostingradio.ru/197096.aacp', tags: '70s', group: 'record' },
  // ===== MONTE CARLO (2) =====
  { id: 100, name: 'Monte Carlo', url: 'https://montecarlo.hostingradio.ru/montecarlo128.mp3', tags: 'lounge, chillout, jazz', group: 'montecarlo' },
  { id: 101, name: 'Monte Carlo — Jazz', url: 'https://montecarlo.hostingradio.ru/mcjazz96.aacp', tags: 'jazz, smooth', group: 'montecarlo' },
  // ===== DFM (1) =====
  { id: 110, name: 'DFM', url: 'https://dfm.hostingradio.ru/dfm128.mp3', tags: 'dance, pop, hits', group: 'dfm' },
  // ===== ДРУГИЕ (14) =====
  { id: 200, name: 'Русское Радио', url: 'https://rusradio.hostingradio.ru/rusradio128.mp3', tags: 'pop, russian', group: 'other' },
  { id: 201, name: 'Европа Плюс', url: 'https://ep256.hostingradio.ru:8052/europaplus256.mp3', tags: 'pop, hit', group: 'other' },
  { id: 202, name: 'Ретро ФМ', url: 'https://retroserver.streamr.ru:8043/retro256.mp3', tags: 'retro, 70s, 80s', group: 'other' },
  { id: 203, name: 'Наше Радио', url: 'https://nashe1.hostingradio.ru/nashe-256', tags: 'rock, russian', group: 'other' },
  { id: 204, name: 'Авторадио', url: 'https://cast.fmprod.ru:8443/avto_256', tags: 'pop, russian', group: 'other' },
  { id: 205, name: 'Love Radio', url: 'https://microitv1.hostingradio.ru:8016/loveradio', tags: 'pop, love', group: 'other' },
  { id: 206, name: 'Хит FM', url: 'https://hitfm.hostingradio.ru/hitfm128.mp3', tags: 'pop, hit', group: 'other' },
  { id: 207, name: 'Радиоmaximum', url: 'https://maximum.hostingradio.ru/maximum128.mp3', tags: 'rock', group: 'other' },
  { id: 208, name: 'Радио Шансон', url: 'https://chanson.hostingradio.ru:8041/shanson128.mp3', tags: 'chanson', group: 'other' },
  { id: 209, name: 'Comedy Radio', url: 'https://comedy.hostingradio.ru/comedy128.mp3', tags: 'pop, humor', group: 'other' },
  { id: 210, name: 'Rock FM', url: 'https://rockfm.hostingradio.ru/rockfm128.mp3', tags: 'rock', group: 'other' },
  { id: 211, name: 'Radio ENERGY', url: 'https://energy.hostingradio.ru/energy128.mp3', tags: 'dance, pop', group: 'other' },
  { id: 212, name: 'Радио Дача', url: 'https://cast.fmprod.ru:8443/radiodacha_256', tags: 'pop, russian', group: 'other' },
  { id: 213, name: 'Новое Радио', url: 'https://cast.fmprod.ru:8443/novoeradio_256', tags: 'pop, russian', group: 'other' },
];

const FILTERS: { key: Group; label: string; icon: string }[] = [
  { key: 'all', label: 'Все', icon: '🎵' },
  { key: 'record', label: 'Record', icon: '🟣' },
  { key: 'montecarlo', label: 'Monte Carlo', icon: '🔵' },
  { key: 'dfm', label: 'DFM', icon: '🟡' },
  { key: 'other', label: 'Другие', icon: '⚪' },
];

const GROUP_COLORS: Record<string, string> = {
  record: '#7c3aed',
  montecarlo: '#0ea5e9',
  dfm: '#f59e0b',
  other: '#6b7280',
};

const GROUP_ICONS: Record<string, string> = {
  record: '🟣',
  montecarlo: '🔵',
  dfm: '🟡',
  other: '📻',
};

function App() {
  const [currentFilter, setCurrentFilter] = useState<Group>('all');
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState<RadioStation | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const filtered = ALL_STATIONS.filter(s => {
    const matchFilter = currentFilter === 'all' || s.group === currentFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.tags.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const selectStation = useCallback((station: RadioStation) => {
    setCurrent(station);
    if (audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        // CORS proxy
        audioRef.current!.src = 'https://corsproxy.io/?' + encodeURIComponent(station.url);
        audioRef.current!.play().then(() => setPlaying(true)).catch(() => {
          alert('Не удалось воспроизвести: ' + station.name);
        });
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, current]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <audio ref={audioRef} preload="none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎵 Russian Radio
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Record ({ALL_STATIONS.filter(s => s.group === 'record').length}) • 
            Monte Carlo ({ALL_STATIONS.filter(s => s.group === 'montecarlo').length}) • 
            DFM ({ALL_STATIONS.filter(s => s.group === 'dfm').length}) • 
            Другие ({ALL_STATIONS.filter(s => s.group === 'other').length})
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Список станций */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold text-lg">📻 Станции</h3>
              <span className="text-gray-400 text-sm">{filtered.length} / {ALL_STATIONS.length}</span>
            </div>

            {/* Фильтры */}
            <div className="flex gap-2 flex-wrap mb-3">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setCurrentFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    currentFilter === f.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            {/* Поиск */}
            <input
              type="text"
              placeholder="🔍 Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-3"
            />

            {/* Список */}
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Ничего не найдено</div>
              ) : (
                filtered.map(station => (
                  <button
                    key={station.id}
                    onClick={() => selectStation(station)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-3 ${
                      current?.id === station.id
                        ? 'bg-purple-600/20 border border-purple-500/50'
                        : 'hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 text-lg">
                      {GROUP_ICONS[station.group]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{station.name}</div>
                      <div className="text-gray-400 text-xs truncate">{station.tags}</div>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{
                        background: GROUP_COLORS[station.group] + '30',
                        color: GROUP_COLORS[station.group],
                      }}
                    >
                      {station.group === 'record' ? 'RECORD' : station.group === 'montecarlo' ? 'MC' : station.group === 'dfm' ? 'DFM' : 'FM'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Плеер */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              {current ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${GROUP_COLORS[current.group]}, #ec4899)` }}
                    >
                      {GROUP_ICONS[current.group]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-lg truncate">{current.name}</h2>
                      <p className="text-gray-400 text-sm truncate">{current.tags}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${playing ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse w-full' : 'w-0'}`}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs ${playing ? 'text-green-400' : 'text-gray-500'}`}>
                        {playing ? '● LIVE' : '○ Пауза'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
                    >
                      {playing ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🔊</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: '#7c3aed' }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <div className="text-5xl mb-3">📻</div>
                  <p>Выберите станцию</p>
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-3">📊 Статистика</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{ALL_STATIONS.filter(s => s.group === 'record').length}</div>
                  <div className="text-gray-400 text-xs">Record</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{ALL_STATIONS.filter(s => s.group === 'montecarlo').length}</div>
                  <div className="text-gray-400 text-xs">Monte Carlo</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{ALL_STATIONS.filter(s => s.group === 'dfm').length}</div>
                  <div className="text-gray-400 text-xs">DFM</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-400">{ALL_STATIONS.filter(s => s.group === 'other').length}</div>
                  <div className="text-gray-400 text-xs">Другие</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 text-xs text-gray-600">
          <p>Всего станций: {ALL_STATIONS.length} • Radio Browser API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
