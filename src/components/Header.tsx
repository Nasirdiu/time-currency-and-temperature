import React, { useState } from 'react';
import { ActiveTab, Language, TempUnit, TimeFormat } from '../types';
import { ThemePalette, THEME_CONFIGS } from '../types/theme';
import { Logo } from './Logo';
import { Clock, CloudSun, ArrowRightLeft, LayoutGrid, Palette, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  onTriggerLoading?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  timeFormat,
  setTimeFormat,
  tempUnit,
  setTempUnit,
  theme,
  setTheme,
  onTriggerLoading,
}) => {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const currentTheme = THEME_CONFIGS[theme] || THEME_CONFIGS.aurora;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070b14]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('clock')}>
          <Logo size="md" theme={theme} className="hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                ChronoSphere
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.accentBorder} shadow-sm font-mono`}>
                Global
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
              <span className={`h-1.5 w-1.5 rounded-full ${currentTheme.dotColor} animate-pulse`} />
              {lang === 'bn' ? 'বিশ্ব ঘড়ি · লাইভ আবহাওয়া · মুদ্রা রূপান্তরকারী' : 'World Clock · Live Weather · Currency Converter'}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950/60 border border-white/[0.08] rounded-xl shadow-inner backdrop-blur-md">
          <button
            onClick={() => setActiveTab('clock')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'clock'
                ? `${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.accentBorder} shadow-sm`
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'বিশ্ব সময়' : 'World Clock'}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'weather'
                ? `${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.accentBorder} shadow-sm`
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</span>
          </button>

          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'currency'
                ? `${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.accentBorder} shadow-sm`
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'মুদ্রা রূপান্তর' : 'Currency'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'hub'
                ? `${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.accentBorder} shadow-sm`
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'সিটি হাব' : 'City Hub'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Toggles */}
        <div className="flex items-center gap-2">
          {/* Theme Color Selector Menu */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              title="Change Theme Color Palette"
              className="flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-white/10 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-all"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${currentTheme.dotColor} shadow-sm`} />
              <Palette className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {lang === 'bn' ? 'থিম কালার নির্বাচন করুন' : 'Select Color Theme'}
                </div>
                {Object.values(THEME_CONFIGS).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      theme === t.id ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${t.dotColor}`} />
                      <span>{lang === 'bn' ? t.bnName : t.name}</span>
                    </div>
                    {theme === t.id && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 12h / 24h toggle */}
          <button
            onClick={() => setTimeFormat(timeFormat === '12h' ? '24h' : '12h')}
            title="Toggle Time Format"
            className="flex h-8 items-center px-2.5 rounded-lg border border-white/10 bg-slate-900/70 text-xs font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all"
          >
            {timeFormat.toUpperCase()}
          </button>

          {/* C / F toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            title="Toggle Temperature Unit"
            className="flex h-8 items-center px-2.5 rounded-lg border border-white/10 bg-slate-900/70 text-xs font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all"
          >
            °{tempUnit}
          </button>

          {/* Loading Animation Trigger Button */}
          {onTriggerLoading && (
            <button
              onClick={onTriggerLoading}
              title={lang === 'bn' ? 'লোডিং অ্যানিমেশন পুনরায় দেখুন' : 'Replay Loading Screen'}
              className="flex h-8 items-center gap-1 px-2 rounded-lg border border-white/10 bg-slate-900/70 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            title="Toggle Language"
            className={`flex h-8 items-center gap-1 px-2.5 rounded-lg border ${currentTheme.accentBorder} ${currentTheme.badgeBg} text-xs font-medium ${currentTheme.accentText} transition-all`}
          >
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="flex md:hidden border-t border-white/[0.06] px-2 py-1.5 overflow-x-auto gap-1 bg-[#060a12]/90">
        <button
          onClick={() => setActiveTab('clock')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'clock' ? `${currentTheme.badgeBg} ${currentTheme.accentText}` : 'text-slate-400'
          }`}
        >
          <Clock className="h-3 w-3" />
          <span>{lang === 'bn' ? 'বিশ্ব সময়' : 'Clock'}</span>
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'weather' ? `${currentTheme.badgeBg} ${currentTheme.accentText}` : 'text-slate-400'
          }`}
        >
          <CloudSun className="h-3 w-3" />
          <span>{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</span>
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'currency' ? `${currentTheme.badgeBg} ${currentTheme.accentText}` : 'text-slate-400'
          }`}
        >
          <ArrowRightLeft className="h-3 w-3" />
          <span>{lang === 'bn' ? 'মুদ্রা' : 'Currency'}</span>
        </button>
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'hub' ? `${currentTheme.badgeBg} ${currentTheme.accentText}` : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="h-3 w-3" />
          <span>{lang === 'bn' ? 'সিটি হাব' : 'Hub'}</span>
        </button>
      </div>
    </header>
  );
};
