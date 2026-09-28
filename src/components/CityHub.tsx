import React, { useState, useEffect } from 'react';
import { CityData, FullWeatherForecast, Language, TempUnit, TimeFormat } from '../types';
import { formatTimeInZone, formatDateInZone, getTimeDifferenceText } from '../utils/time';
import { fetchWeatherForecast } from '../services/weatherApi';
import { getExchangeRates, convertCurrency } from '../services/currencyApi';
import { CURRENCY_LIST } from '../data/currencies';
import {
  Clock,
  CloudSun,
  ArrowRightLeft,
  Sun,
  Moon,
  Wind,
  Droplets,
  Calendar,
  Building2,
  ChevronRight,
  Search,
} from 'lucide-react';

interface CityHubProps {
  cities: CityData[];
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onOpenSearch: () => void;
  lang: Language;
  timeFormat: TimeFormat;
  tempUnit: TempUnit;
}

export const CityHub: React.FC<CityHubProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onOpenSearch,
  lang,
  timeFormat,
  tempUnit,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [forecast, setForecast] = useState<FullWeatherForecast | null>(null);
  const [ratesData, setRatesData] = useState<any>(null);
  const [quickAmount, setQuickAmount] = useState<number>(100);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchWeatherForecast(selectedCity.lat, selectedCity.lng, selectedCity.timezone).then((data) => {
      if (isMounted) setForecast(data);
    });
    getExchangeRates().then((rates) => {
      if (isMounted) setRatesData(rates);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCity.id]);

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeInfo = formatTimeInZone(currentTime, selectedCity.timezone, timeFormat, true);
  const dateStr = formatDateInZone(currentTime, selectedCity.timezone, lang);
  const diffStr = getTimeDifferenceText(selectedCity.timezone, localTimezone, lang);

  const isNight = timeInfo.dayPeriod === 'night';
  const isWorkHour = timeInfo.hours24 >= 9 && timeInfo.hours24 <= 17;

  const convertTemp = (c: number) => (tempUnit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c));

  // Local currency info
  const cityCurrency = CURRENCY_LIST.find((c) => c.code === selectedCity.currency) || {
    code: selectedCity.currency,
    name: selectedCity.currency,
    bnName: selectedCity.currency,
    symbol: selectedCity.currencySymbol,
    country: selectedCity.country,
    flag: selectedCity.flag,
  };

  const toUSD = ratesData
    ? convertCurrency(quickAmount, selectedCity.currency, 'USD', ratesData.rates)
    : { result: quickAmount * 0.00816, rate: 0.00816 };
  const toBDT = ratesData
    ? convertCurrency(quickAmount, selectedCity.currency, 'BDT', ratesData.rates)
    : { result: quickAmount * 1.0, rate: 1.0 };

  return (
    <div className="space-y-8">
      {/* City Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity.id === city.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{city.flag}</span>
              <span>{lang === 'bn' ? city.bnName : city.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{lang === 'bn' ? 'অন্য শহর খুঁজুন' : 'Search City'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-4xl filter drop-shadow">{selectedCity.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'bn' ? selectedCity.bnName : selectedCity.name}
              </h1>
              <span className="text-xs text-slate-400">
                · {lang === 'bn' ? selectedCity.bnCountry : selectedCity.country}
              </span>
            </div>
            <p className="text-xs text-cyan-400 mt-1 font-mono">
              {selectedCity.timezone} · {diffStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-3 py-1 rounded-lg border font-medium ${
              isWorkHour
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            {isWorkHour
              ? lang === 'bn' ? 'অফিস কার্যক্রম চলছে (Open)' : 'Business Hours Active'
              : lang === 'bn' ? 'অফিস বন্ধ (Closed)' : 'After Business Hours'}
          </span>
        </div>
      </div>

      {/* 3 Unified Pillar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PILLAR 1: LIVE TIME */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Clock className="h-4 w-4" />
                <span>{lang === 'bn' ? 'স্থানীয় সময়' : 'Local Time'}</span>
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isNight
                    ? 'border-indigo-900/50 bg-indigo-950/30 text-indigo-400'
                    : 'border-amber-900/50 bg-amber-950/30 text-amber-400'
                }`}
              >
                {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
            </div>

            <div className="my-3">
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                {timeInfo.timeStr}
                {timeFormat === '12h' && (
                  <span className="ml-2 text-lg font-semibold text-slate-400">{timeInfo.ampm}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{dateStr}</p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'আপনার সাথে পার্থক্য:' : 'Offset from you:'}</span>
              <span className="font-mono text-cyan-400">{diffStr}</span>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'আইএএনএ টাইমজোন:' : 'IANA Identifier:'}</span>
              <span className="font-mono text-slate-300">{selectedCity.timezone.split('/')[1] || selectedCity.timezone}</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: LIVE WEATHER */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <CloudSun className="h-4 w-4" />
                <span>{lang === 'bn' ? 'লাইভ আবহাওয়া' : 'Live Weather'}</span>
              </div>
              <span className="text-xs text-slate-400">
                {forecast?.current ? (lang === 'bn' ? forecast.current.conditionBnText : forecast.current.conditionText) : 'Loading...'}
              </span>
            </div>

            {forecast ? (
              <div className="my-3">
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                    {convertTemp(forecast.current.temp)}°{tempUnit}
                  </div>
                  <span className="text-xs text-slate-400">
                    {lang === 'bn' ? 'অনুভূতি:' : 'Feels:'} {convertTemp(forecast.current.feelsLike)}°{tempUnit}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    {forecast.current.humidity}%
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Wind className="h-3.5 w-3.5 text-teal-400" />
                    {forecast.current.windSpeed} km/h
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-20 flex items-center text-xs text-slate-500">Loading forecast...</div>
            )}
          </div>

          {/* 3-day glance */}
          {forecast && (
            <div className="border-t border-slate-800/80 pt-4 flex justify-between text-xs">
              {forecast.daily.slice(0, 3).map((d, i) => (
                <div key={i} className="text-center">
                  <div className="text-slate-400 text-[11px]">{lang === 'bn' ? d.bnDayName : d.dayName}</div>
                  <div className="font-mono text-white font-bold">{convertTemp(d.maxTemp)}°</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PILLAR 3: LOCAL CURRENCY */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <ArrowRightLeft className="h-4 w-4" />
                <span>{lang === 'bn' ? 'স্থানীয় মুদ্রা' : 'Local Currency'}</span>
              </div>
              <span className="text-xs font-bold text-slate-300">
                {cityCurrency.symbol} {cityCurrency.code}
              </span>
            </div>

            <div className="my-2 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-transparent font-mono text-xl font-bold text-white focus:outline-none tabular-nums"
                />
                <span className="text-xs font-mono text-slate-400 font-bold">{cityCurrency.code}</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>In US Dollar:</span>
                  <span className="font-mono font-bold text-cyan-400 tabular-nums">
                    ${toUSD.result.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>In Bangladeshi Taka:</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ৳{toBDT.result.toFixed(2)} BDT
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 font-mono flex justify-between">
            <span>1 {cityCurrency.code} = ${(toUSD.rate || 0).toFixed(4)} USD</span>
            <span>= ৳{(toBDT.rate || 0).toFixed(2)} BDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
