import React from 'react';
import { ActiveTab, Language, TempUnit, TimeFormat } from '../types';
import { Globe, Clock, CloudSun, ArrowRightLeft, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
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
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 text-cyan-400">
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Meridian
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('clock')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'clock'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'বিশ্ব সময়' : 'World Clock'}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'weather'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</span>
          </button>

          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'currency'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'মুদ্রা রূপান্তর' : 'Currency'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'hub'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'সিটি হাব (অল-ইন-ওয়ান)' : 'City Hub (All-in-One)'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 12h / 24h toggle */}
          <button
            onClick={() => setTimeFormat(timeFormat === '12h' ? '24h' : '12h')}
            title="Toggle Time Format"
            className="flex h-8 items-center px-2.5 rounded-md border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {timeFormat.toUpperCase()}
          </button>

          {/* C / F toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            title="Toggle Temperature Unit"
            className="flex h-8 items-center px-2.5 rounded-md border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            °{tempUnit}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            title="Toggle Language"
            className="flex h-8 items-center gap-1 px-2.5 rounded-md border border-cyan-500/30 bg-cyan-950/20 text-xs font-medium text-cyan-300 hover:bg-cyan-900/30 transition-colors"
          >
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('clock')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'clock' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Clock className="h-3 w-3" />
          <span>{lang === 'bn' ? 'সময়' : 'Clock'}</span>
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'weather' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
          }`}
        >
          <CloudSun className="h-3 w-3" />
          <span>{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</span>
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'currency' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
          }`}
        >
          <ArrowRightLeft className="h-3 w-3" />
          <span>{lang === 'bn' ? 'মুদ্রা' : 'Currency'}</span>
        </button>
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'hub' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="h-3 w-3" />
          <span>{lang === 'bn' ? 'সিটি হাব' : 'Hub'}</span>
        </button>
      </div>
    </header>
  );
};
