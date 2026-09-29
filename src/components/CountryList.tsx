import React from 'react';
import { Country } from '../types';

interface CountryListProps {
  countries: Country[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  'United States Of America': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Russia': '🇷🇺',
  'Japan': '🇯🇵',
  'Brazil': '🇧🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Netherlands': '🇳🇱',
  'Poland': '🇵🇱',
  'Ukraine': '🇺🇦',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'South Korea': '🇰🇷',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Turkey': '🇹🇷',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Finland': '🇫🇮',
  'Denmark': '🇩🇰',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Belgium': '🇧🇪',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴',
  'Hungary': '🇭🇺',
  'Ireland': '🇮🇪',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Indonesia': '🇮🇩',
  'Thailand': '🇹🇭',
  'Philippines': '🇵🇭',
};

const CountryList: React.FC<CountryListProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  searchQuery,
  onSearchChange,
}) => {
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 h-full flex flex-col">
      <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Страны
      </h3>

      <input
        type="text"
        placeholder="Поиск страны..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 mb-3"
      />

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <button
          onClick={() => onSelectCountry('')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
            selectedCountry === ''
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          🌍 Все страны
        </button>
        {filteredCountries.map((country) => (
          <button
            key={country.name}
            onClick={() => onSelectCountry(country.name)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
              selectedCountry === country.name
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <span>{COUNTRY_FLAGS[country.name] || '🏳️'}</span>
              <span className="truncate">{country.name}</span>
            </span>
            <span className="text-xs opacity-60 ml-2">{country.stationcount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryList;
