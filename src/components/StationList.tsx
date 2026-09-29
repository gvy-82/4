import { RadioStation } from '../types';
import { useTheme } from '../App';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  onSelectStation: (station: RadioStation) => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const StationList = ({
  stations,
  currentStation,
  onSelectStation,
  isLoading,
  searchQuery,
  onSearchChange,
}: StationListProps) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-2xl p-4 border h-full flex flex-col transition-colors duration-300 ${
      isDark
        ? 'bg-gray-900/80 backdrop-blur-sm border-gray-700/50'
        : 'bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg'
    }`}>
      <h3 className={`font-semibold text-lg mb-3 flex items-center gap-2 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
        Станции ({stations.length})
      </h3>

      <input
        type="text"
        placeholder="Поиск станции..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-3 transition-colors ${
          isDark
            ? 'bg-gray-800 border-gray-600 text-white'
            : 'bg-gray-50 border-gray-300 text-gray-800'
        }`}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка станций...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {stations.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Станции не найдены</p>
            </div>
          ) : (
            stations.map((station) => (
              <button
                key={station.stationuuid}
                onClick={() => onSelectStation(station)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  currentStation?.stationuuid === station.stationuuid
                    ? isDark
                      ? 'bg-purple-600/30 border border-purple-500/50'
                      : 'bg-purple-100 border border-purple-300'
                    : isDark
                      ? 'hover:bg-gray-800 border border-transparent'
                      : 'hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
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
                    <span className="text-lg">📻</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{station.name}</p>
                  <p className={`text-xs truncate ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {station.tags ? station.tags.split(',').slice(0, 2).join(', ') : station.country}
                    {station.bitrate > 0 && ` • ${station.bitrate}kbps`}
                  </p>
                </div>
                {currentStation?.stationuuid === station.stationuuid && (
                  <div className="flex gap-0.5 items-end h-4">
                    <div className="w-1 bg-purple-400 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                    <div className="w-1 bg-purple-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                    <div className="w-1 bg-purple-400 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StationList;
