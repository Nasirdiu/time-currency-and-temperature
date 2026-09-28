import React from 'react';
import { ThemePalette } from '../types/theme';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: ThemePalette;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  theme = 'aurora',
  animated = false,
}) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-24 w-24',
  };

  const getThemePalette = () => {
    switch (theme) {
      case 'emerald':
        return {
          primary: '#10b981',
          secondary: '#14b8a6',
          accent: '#34d399',
          glow: '#059669',
        };
      case 'violet':
        return {
          primary: '#a855f7',
          secondary: '#6366f1',
          accent: '#c084fc',
          glow: '#8b5cf6',
        };
      case 'sunset':
        return {
          primary: '#f59e0b',
          secondary: '#f97316',
          accent: '#fbbf24',
          glow: '#ea580c',
        };
      case 'aurora':
      default:
        return {
          primary: '#06b6d4',
          secondary: '#3b82f6',
          accent: '#38bdf8',
          glow: '#0284c7',
        };
    }
  };

  const palette = getThemePalette();
  const gradId = `cs-grad-${theme}`;
  const ringId = `cs-ring-${theme}`;
  const coreGradId = `cs-core-${theme}`;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-lg ${animated ? 'animate-[spin_10s_linear_infinite]' : ''}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.accent} />
            <stop offset="50%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>

          <linearGradient id={ringId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity="1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.primary} stopOpacity="0.2" />
          </linearGradient>

          <radialGradient id={coreGradId} cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor={palette.accent} />
            <stop offset="100%" stopColor={palette.primary} />
          </radialGradient>

          <filter id={`cs-glow-${theme}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Chrono Shield */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="#060c18"
          stroke={`url(#${gradId})`}
          strokeWidth="1.8"
          strokeDasharray="4 2"
          strokeOpacity="0.6"
        />

        {/* Chronograph 12-hour Ticks */}
        <line x1="50" y1="7" x2="50" y2="12" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="88" x2="50" y2="93" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="50" x2="12" y2="50" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" />
        <line x1="88" y1="50" x2="93" y2="50" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />

        {/* Dynamic Celestial Orbit Ring 1 (Time & Global Weather Atmosphere) */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="17"
          transform="rotate(-30 50 50)"
          stroke={`url(#${ringId})`}
          strokeWidth="2.8"
          filter={`url(#cs-glow-${theme})`}
        />

        {/* Dynamic Orbital Ring 2 (Financial Currency Exchange Loop) */}
        <ellipse
          cx="50"
          cy="50"
          rx="17"
          ry="38"
          transform="rotate(60 50 50)"
          stroke={`url(#${gradId})`}
          strokeWidth="1.6"
          strokeDasharray="140"
          strokeDashoffset="20"
          strokeOpacity="0.75"
        />

        {/* Central Luminous Sun / Core Chrono Sphere */}
        <circle
          cx="50"
          cy="50"
          r="15"
          fill={`url(#${coreGradId})`}
          filter={`url(#cs-glow-${theme})`}
        />

        {/* Shining Star Flare at Top Orbit */}
        <circle cx="79" cy="33" r="3.2" fill="#ffffff" filter={`url(#cs-glow-${theme})`} />

        {/* Compass Pointer Arrow */}
        <path
          d="M50 38 L54 50 L50 47 L46 50 Z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
