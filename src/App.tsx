import { useState, useEffect } from 'react';
import { ActiveTab, CityData, Language, TempUnit, TimeFormat } from './types';
import { WORLD_CITIES, DEFAULT_PINNED_CITY_IDS } from './data/cities';
import { Header } from './components/Header';
import { WorldClock } from './components/WorldClock';
import { WeatherView } from './components/WeatherView';
import { CurrencyConverter } from './components/CurrencyConverter';
import { CityHub } from './components/CityHub';
import { CitySearchModal } from './components/CitySearchModal';

const STORAGE_PINNED_KEY = 'meridian_pinned_cities_v1';
const STORAGE_LANG_KEY = 'meridian_lang_pref_v1';
const STORAGE_FORMAT_KEY = 'meridian_format_pref_v1';
const STORAGE_TEMP_KEY = 'meridian_temp_pref_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clock');
  const [lang, setLang] = useState<Language>('bn');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');

  const [pinnedCities, setPinnedCities] = useState<CityData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PINNED_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return WORLD_CITIES.filter((c) => DEFAULT_PINNED_CITY_IDS.includes(c.id));
  });

  const [selectedCity, setSelectedCity] = useState<CityData>(() => {
    return pinnedCities[0] || WORLD_CITIES[0];
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Load preferences
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Language;
      if (savedLang === 'en' || savedLang === 'bn') setLang(savedLang);

      const savedFormat = localStorage.getItem(STORAGE_FORMAT_KEY) as TimeFormat;
      if (savedFormat === '12h' || savedFormat === '24h') setTimeFormat(savedFormat);

      const savedTemp = localStorage.getItem(STORAGE_TEMP_KEY) as TempUnit;
      if (savedTemp === 'C' || savedTemp === 'F') setTempUnit(savedTemp);
    } catch {}
  }, []);

  // Save pinned cities
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PINNED_KEY, JSON.stringify(pinnedCities));
    } catch {}
  }, [pinnedCities]);

  const handleSetLang = (l: Language) => {
    setLang(l);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, l);
    } catch {}
  };

  const handleSetTimeFormat = (f: TimeFormat) => {
    setTimeFormat(f);
    try {
      localStorage.setItem(STORAGE_FORMAT_KEY, f);
    } catch {}
  };

  const handleSetTempUnit = (u: TempUnit) => {
    setTempUnit(u);
    try {
      localStorage.setItem(STORAGE_TEMP_KEY, u);
    } catch {}
  };

  const handleRemoveCity = (cityId: string) => {
    setPinnedCities((prev) => prev.filter((c) => c.id !== cityId));
  };

  const handlePinCity = (city: CityData) => {
    setPinnedCities((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      return [...prev, city];
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={handleSetLang}
        timeFormat={timeFormat}
        setTimeFormat={handleSetTimeFormat}
        tempUnit={tempUnit}
        setTempUnit={handleSetTempUnit}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'clock' && (
          <WorldClock
            pinnedCities={pinnedCities}
            onAddCityClick={() => setIsSearchOpen(true)}
            onRemoveCity={handleRemoveCity}
            lang={lang}
            timeFormat={timeFormat}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView
            cities={pinnedCities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onOpenSearch={() => setIsSearchOpen(true)}
            lang={lang}
            tempUnit={tempUnit}
          />
        )}

        {activeTab === 'currency' && (
          <CurrencyConverter lang={lang} />
        )}

        {activeTab === 'hub' && (
          <CityHub
            cities={pinnedCities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onOpenSearch={() => setIsSearchOpen(true)}
            lang={lang}
            timeFormat={timeFormat}
            tempUnit={tempUnit}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#070b12] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {lang === 'bn'
              ? 'মেরিডিয়ান · গ্লোবাল ওয়ার্ল্ড ক্লক, ওয়েদার ও কারেন্সি কনভার্টার স্যুট'
              : 'Meridian · Global World Clock, Weather & Currency Converter Suite'}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Open-Meteo Meteorological API</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Global Exchange Rates</span>
            <span aria-hidden="true">·</span>
            <span>IANA Timezone Sync</span>
          </div>
        </div>
      </footer>

      {/* Global City Search Modal */}
      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={(city) => {
          setSelectedCity(city);
          if (activeTab === 'clock') {
            handlePinCity(city);
          }
        }}
        onPinCity={handlePinCity}
        pinnedCityIds={pinnedCities.map((c) => c.id)}
        lang={lang}
      />
    </div>
  );
}
