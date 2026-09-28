export type ThemePalette = 'aurora' | 'emerald' | 'violet' | 'sunset';

export interface ThemeConfig {
  id: ThemePalette;
  name: string;
  bnName: string;
  dotColor: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  gradientFrom: string;
  buttonBg: string;
}

export const THEME_CONFIGS: Record<ThemePalette, ThemeConfig> = {
  aurora: {
    id: 'aurora',
    name: 'Ocean Cyan',
    bnName: 'অরোরা সায়ান',
    dotColor: 'bg-cyan-400',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-950/40',
    badgeText: 'text-cyan-300',
    gradientFrom: 'from-cyan-500/20 via-blue-600/10 to-slate-900',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    bnName: 'পান্না সবুজ',
    dotColor: 'bg-emerald-400',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-950/40',
    badgeText: 'text-emerald-300',
    gradientFrom: 'from-emerald-500/20 via-teal-600/10 to-slate-900',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950',
  },
  violet: {
    id: 'violet',
    name: 'Nebula Purple',
    bnName: 'রয়্যাল ভায়োলেট',
    dotColor: 'bg-purple-400',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-950/40',
    badgeText: 'text-purple-300',
    gradientFrom: 'from-purple-500/20 via-indigo-600/10 to-slate-900',
    buttonBg: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white',
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Solar',
    bnName: 'সানসেট গোল্ডেন',
    dotColor: 'bg-amber-400',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    badgeBg: 'bg-amber-950/40',
    badgeText: 'text-amber-300',
    gradientFrom: 'from-amber-500/20 via-orange-600/10 to-slate-900',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950',
  },
};
