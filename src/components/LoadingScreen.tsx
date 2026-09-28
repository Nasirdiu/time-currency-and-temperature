import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemePalette, THEME_CONFIGS } from '../types/theme';
import { Language } from '../types';
import { Logo } from './Logo';

interface LoadingScreenProps {
  onComplete: () => void;
  lang: Language;
  theme: ThemePalette;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, lang, theme }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    lang === 'bn' ? 'গ্লোবাল নেটওয়ার্ক সিঙ্ক হচ্ছে...' : 'Initializing Global Network...'
  );
  const [isFadingOut, setIsFadingOut] = useState(false);

  const currentTheme = THEME_CONFIGS[theme] || THEME_CONFIGS.aurora;

  useEffect(() => {
    const steps = [
      { p: 20, bn: 'নিরাপদ স্যাটেলাইট নেটওয়ার্কে সংযুক্ত হচ্ছে...', en: 'Connecting to secure orbital network...' },
      { p: 45, bn: 'বিশ্বের সকল টাইমজোন সিঙ্ক হচ্ছে...', en: 'Syncing global IANA timezones...' },
      { p: 70, bn: 'লাইভ স্যাটেলাইট আবহাওয়া ও ক্লাউড ম্যাপ লোড হচ্ছে...', en: 'Fetching real-time meteorological radar...' },
      { p: 90, bn: 'আন্তর্জাতিক মুদ্রা বিনিময় হার আপডেট হচ্ছে...', en: 'Updating live international currency rates...' },
      { p: 100, bn: 'ক্রোনোস্ফিয়ার গ্লোবাল ড্যাশবোর্ড সম্পূর্ণ প্রস্তুত!', en: 'ChronoSphere Global Suite Ready!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(lang === 'bn' ? steps[currentStep].bn : steps[currentStep].en);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 450);
        }, 400);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [lang, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] px-4 transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] opacity-40 ${
          theme === 'aurora' ? 'bg-cyan-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'violet' ? 'bg-purple-600' : 'bg-amber-500'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Pulsing Animated Logo Emblem */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer glowing ripple ring */}
          <div className="absolute h-32 w-32 rounded-full border border-white/10 animate-ping opacity-25" />
          <div className="absolute h-28 w-28 rounded-full border border-white/15 animate-pulse" />

          {/* Central Logo Icon */}
          <div className="relative p-2.5 rounded-3xl bg-slate-900/80 border border-white/20 shadow-2xl shadow-black/90 backdrop-blur-xl">
            <Logo size="lg" theme={theme} animated={true} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
          <span>ChronoSphere</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.accentBorder}`}>
            Global
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
          {lang === 'bn' ? 'গ্লোবাল ওয়ার্ল্ড ক্লক · স্যাটেলাইট ওয়েদার · কারেন্সি কনভার্টার' : 'World Clock · Satellite Weather · Currency Converter'}
        </p>

        {/* Progress Bar */}
        <div className="w-full mt-8 space-y-2.5">
          <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r ${
                theme === 'aurora'
                  ? 'from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : theme === 'emerald'
                  ? 'from-emerald-500 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                  : theme === 'violet'
                  ? 'from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]'
                  : 'from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Progress text & percentage */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 truncate text-[11px]">
              <Sparkles className={`h-3 w-3 ${currentTheme.accentText} shrink-0 animate-pulse`} />
              {statusText}
            </span>
            <span className={`font-bold ${currentTheme.accentText} tabular-nums text-xs ml-2`}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Subtle bouncing indicators */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${currentTheme.dotColor} animate-bounce [animation-delay:-0.3s]`} />
          <span className={`h-2 w-2 rounded-full ${currentTheme.dotColor} animate-bounce [animation-delay:-0.15s]`} />
          <span className={`h-2 w-2 rounded-full ${currentTheme.dotColor} animate-bounce`} />
        </div>

        {/* Skip button for user convenience */}
        <button
          onClick={onComplete}
          className="mt-6 text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors"
        >
          {lang === 'bn' ? 'সরাসরি ড্যাশবোর্ডে যান' : 'Skip to Dashboard'}
        </button>
      </div>
    </div>
  );
};
