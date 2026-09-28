import React, { useEffect, useState } from 'react';
import { ThemePalette } from '../types/theme';

interface TopLoadingBarProps {
  isLoading: boolean;
  theme: ThemePalette;
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading, theme }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setVisible(true);
      setProgress(20);
      timer = setTimeout(() => {
        setProgress(70);
        timer = setTimeout(() => {
          setProgress(90);
        }, 300);
      }, 200);
    } else {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  const getGradient = () => {
    switch (theme) {
      case 'emerald':
        return 'from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_12px_#10b981]';
      case 'violet':
        return 'from-purple-400 via-indigo-300 to-purple-500 shadow-[0_0_12px_#a855f7]';
      case 'sunset':
        return 'from-amber-400 via-orange-300 to-amber-500 shadow-[0_0_12px_#f59e0b]';
      case 'aurora':
      default:
        return 'from-cyan-400 via-sky-300 to-blue-500 shadow-[0_0_12px_#06b6d4]';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className={`h-full bg-gradient-to-r ${getGradient()} transition-all duration-300 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
