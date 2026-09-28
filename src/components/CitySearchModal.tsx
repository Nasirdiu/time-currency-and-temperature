import React, { useState, useEffect } from 'react';
import { CityData, Language } from '../types';
import { WORLD_CITIES } from '../data/cities';
import { searchGlobalLocations } from '../services/weatherApi';
import { Search, X, MapPin, Globe, Check, Loader2 } from 'lucide-react';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityData) => void;
  onPinCity: (city: CityData) => void;
  pinnedCityIds: string[];
  lang: Language;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onPinCity,
  pinnedCityIds,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteResults, setRemoteResults] = useState<CityData[]>([]);
  const [isSearchingRemote, setIsSearchingRemote] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live geocoding for cities not in local catalog
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 3) {
      setRemoteResults([]);
      setIsSearchingRemote(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingRemote(true);
      try {
        const locations = await searchGlobalLocations(searchTerm.trim());
        const mapped: CityData[] = locations.map((loc, idx) => ({
          id: `custom-${loc.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
          name: loc.name,
          bnName: loc.name,
          country: loc.country,
          bnCountry: loc.country,
          timezone: loc.timezone,
          lat: loc.lat,
          lng: loc.lng,
          currency: 'USD',
          currencySymbol: '$',
          flag: '🌐',
        }));
        setRemoteResults(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearchingRemote(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  // Filter local catalog
  const filteredLocal = WORLD_CITIES.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.country.toLowerCase().includes(term) ||
      c.bnName.includes(term) ||
      c.bnCountry.includes(term)
    );
  });

  const handlePickCity = (city: CityData) => {
    onSelectCity(city);
    onPinCity(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1527] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search header input */}
        <div className="flex items-center gap-3 border-b border-slate-800 p-4">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'শহর বা দেশের নাম লিখুন (যেমন: ঢাকা, London, Tokyo)...'
                : 'Search any world city or country (e.g. Dhaka, Tokyo, Paris)...'
            }
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 ml-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results scroll list */}
        <div className="overflow-y-auto p-3 divide-y divide-slate-800/60 space-y-1">
          {/* Local match results */}
          {filteredLocal.map((city) => {
            const isPinned = pinnedCityIds.includes(city.id);
            return (
              <div
                key={city.id}
                onClick={() => handlePickCity(city)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {lang === 'bn' ? city.bnName : city.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lang === 'bn' ? city.bnCountry : city.country} ·{' '}
                      <span className="font-mono text-[11px] text-slate-500">{city.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPinned ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      <Check className="h-3 w-3" />
                      {lang === 'bn' ? 'সংরক্ষিত' : 'Pinned'}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang === 'bn' ? 'নির্বাচন করুন' : 'Select'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Remote geocoding results */}
          {remoteResults.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {lang === 'bn' ? 'গ্লোবাল সার্চ ফলাফল' : 'Global Geocoding Matches'}
              </div>
              {remoteResults.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handlePickCity(city)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-cyan-400">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {city.country} · <span className="font-mono text-[11px]">{city.timezone}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === 'bn' ? 'যুক্ত করুন' : 'Add City'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isSearchingRemote && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>{lang === 'bn' ? 'বিশ্বজুড়ে শহর অনুসন্ধান হচ্ছে...' : 'Searching global database...'}</span>
            </div>
          )}

          {filteredLocal.length === 0 && remoteResults.length === 0 && !isSearchingRemote && (
            <div className="py-8 text-center text-xs text-slate-500">
              {lang === 'bn' ? 'কোনো শহর খুঁজে পাওয়া যায়নি' : 'No matching cities found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
