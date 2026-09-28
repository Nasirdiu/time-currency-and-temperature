import { useState, useEffect } from 'react';
import { ActiveTab, CityData, Language, TempUnit, TimeFormat } from './types';
import { ThemePalette, THEME_CONFIGS } from './types/theme';
import { WORLD_CITIES, DEFAULT_PINNED_CITY_IDS } from './data/cities';
import { Header } from './components/Header';
import { WorldClock } from './components/WorldClock';
import { WeatherView } from './components/WeatherView';
import { CurrencyConverter } from './components/CurrencyConverter';
import { CityHub } from './components/CityHub';
import { CitySearchModal } from './components/CitySearchModal';
import { LoadingScreen } from './components/LoadingScreen';
import { TopLoadingBar } from './components/TopLoadingBar';
import { Logo } from './components/Logo';

const STORAGE_PINNED_KEY = 'chronosphere_pinned_cities_v1';
const STORAGE_LANG_KEY = 'chronosphere_lang_pref_v1';
const STORAGE_FORMAT_KEY = 'chronosphere_format_pref_v1';
const STORAGE_TEMP_KEY = 'chronosphere_temp_pref_v1';
const STORAGE_THEME_KEY = 'chronosphere_theme_pref_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clock');
  const [lang, setLang] = useState<Language>('bn');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<ThemePalette>('aurora');
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) as ThemePalette;
      if (savedTheme && THEME_CONFIGS[savedTheme]) setTheme(savedTheme);
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

  const handleSetTheme = (t: ThemePalette) => {
    setTheme(t);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, t);
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
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Top Page Progress Loading Bar */}
      <TopLoadingBar isLoading={isLoading} theme={theme} />

      {/* Initial App Launch Loading Screen */}
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Ambient background mesh glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] opacity-40 blur-[130px] rounded-full ${theme === 'aurora' ? 'bg-cyan-600/20' : theme === 'emerald' ? 'bg-emerald-600/20' : theme === 'violet' ? 'bg-purple-600/25' : 'bg-amber-600/20'}`} />
        <div className="absolute top-[450px] -left-48 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[800px] -right-48 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsLoading(true);
          setActiveTab(tab);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }}
        lang={lang}
        setLang={handleSetLang}
        timeFormat={timeFormat}
        setTimeFormat={handleSetTimeFormat}
        tempUnit={tempUnit}
        setTempUnit={handleSetTempUnit}
        theme={theme}
        setTheme={handleSetTheme}
        onTriggerLoading={() => setIsLoading(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'clock' && (
          <WorldClock
            pinnedCities={pinnedCities}
            onAddCityClick={() => setIsSearchOpen(true)}
            onRemoveCity={handleRemoveCity}
            lang={lang}
            timeFormat={timeFormat}
            tempUnit={tempUnit}
            onSelectCityForWeather={(city) => {
              setSelectedCity(city);
              setActiveTab('weather');
            }}
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
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#050811] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" theme={theme} />
            <span className="text-slate-400 font-medium">
              {lang === 'bn'
                ? 'ক্রোনোস্ফিয়ার গ্লোবাল (ChronoSphere) · বিশ্ব ঘড়ি, আবহাওয়া ও মুদ্রা রূপান্তরকারী'
                : 'ChronoSphere Global · World Clock, Weather & Currency Converter Suite'}
            </span>
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
