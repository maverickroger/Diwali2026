import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar } from 'lucide-react';
import { SiteSettings, Language } from '../types';

interface FestiveBannerProps {
  settings: SiteSettings;
  language: Language;
  onOpenAdmin?: () => void;
}

export const FestiveBanner: React.FC<FestiveBannerProps> = ({ settings, language }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(settings.diwaliDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [settings.diwaliDate]);

  const isHi = language === 'hi';

  return (
    <div
      id="festive-countdown-banner"
      className="relative overflow-hidden bg-amber-50 border-b border-amber-200/60 text-amber-900 py-2.5 px-4 text-xs sm:text-sm font-medium z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-base">🪔</span>
          <span className="font-semibold text-amber-800 tracking-wide uppercase text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {isHi ? 'दीपावली महोत्सव 2026' : 'Diwali Mahotsav 2026'}
          </span>
          <span className="hidden md:inline text-amber-800/40">•</span>
          <span className="hidden md:inline text-amber-950/80">
            {isHi
              ? '100% असली ग्रीन पटाखे • नो-वेटिंग व्हाट्सएप पिकअप उपलब्ध'
              : '100% Genuine Green PESO Crackers • Express WhatsApp Stall Pickup'}
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3 bg-white/90 border border-amber-200/60 px-3 py-1 rounded-full text-xs font-mono text-amber-900">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span className="text-amber-950 font-bold">{timeLeft.days}</span>
            <span className="text-amber-700 text-[10px]">{isHi ? 'दिन' : 'days'}</span>
          </div>
          <span className="text-amber-400">:</span>
          <div className="flex items-center gap-0.5">
            <span className="text-amber-950 font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-amber-700 text-[10px]">{isHi ? 'घं' : 'h'}</span>
          </div>
          <span className="text-amber-400">:</span>
          <div className="flex items-center gap-0.5">
            <span className="text-amber-950 font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-amber-700 text-[10px]">{isHi ? 'मि' : 'm'}</span>
          </div>
          <span className="text-amber-400">:</span>
          <div className="flex items-center gap-0.5">
            <span className="text-amber-950 font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-amber-700 text-[10px]">{isHi ? 'से' : 's'}</span>
          </div>
          <span className="text-amber-800 text-[11px] font-sans ml-1">
            {isHi ? 'दिवाली में शेष' : 'to Diwali'}
          </span>
        </div>
      </div>
    </div>
  );
};
