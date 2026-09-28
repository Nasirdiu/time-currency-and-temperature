import React, { useState, useEffect } from 'react';
import { CityData, FullWeatherForecast, Language, TempUnit } from '../types';
import { fetchWeatherForecast } from '../services/weatherApi';
import {
  CloudSun,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Umbrella,
  Compass,
  Search,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface WeatherViewProps {
  cities: CityData[];
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onOpenSearch: () => void;
  lang: Language;
  tempUnit: TempUnit;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onOpenSearch,
  lang,
  tempUnit,
}) => {
  const [forecast, setForecast] = useState<FullWeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadWeather = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchWeatherForecast(selectedCity.lat, selectedCity.lng, selectedCity.timezone);
      setForecast(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [selectedCity.id]);

  const convertTemp = (celsius: number): number => {
    if (tempUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const renderWeatherIcon = (code: number, isDay: boolean, className: string = 'h-6 w-6') => {
    if (code === 0) {
      return isDay ? <Sun className={`${className} text-amber-400`} /> : <Moon className={`${className} text-indigo-300`} />;
    }
    if (code === 1 || code === 2) {
      return isDay ? <CloudSun className={`${className} text-sky-400`} /> : <Cloud className={`${className} text-indigo-300`} />;
    }
    if (code === 3) return <Cloud className={`${className} text-slate-300`} />;
    if (code === 45 || code === 48) return <CloudFog className={`${className} text-slate-400`} />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-cyan-400`} />;
    if (code >= 61 && code <= 82) return <CloudRain className={`${className} text-blue-400`} />;
    if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-sky-200`} />;
    if (code >= 95) return <CloudLightning className={`${className} text-amber-300`} />;
    return <CloudSun className={`${className} text-slate-300`} />;
  };

  // Weather recommendation advisor
  const getTravelInsight = (f: FullWeatherForecast) => {
    const isRainy = f.current.weatherCode >= 51 || f.daily[0]?.precipitationProb > 40;
    const isCold = f.current.temp < 15;
    const isHot = f.current.temp > 32;

    if (lang === 'bn') {
      if (isRainy) return 'আজ বৃষ্টিপাতের সম্ভাবনা রয়েছে, বাইরে বের হওয়ার সময় ছাতা সাথে রাখা জরুরি।';
      if (isCold) return 'বাতাসে শীতের পরশ রয়েছে, সন্ধ্যা বা রাতের জন্য আরামদায়ক পোশাক সঙ্গে রাখুন।';
      if (isHot) return 'বেশ গরম আবহাওয়া বিরাজ করছে, পর্যাপ্ত পানি পান করুন এবং রোদ থেকে সতর্ক থাকুন।';
      return 'আবহাওয়া খুবই চমৎকার ও মনোরম! ভ্রমণ বা বাইরের যেকোনো কাজের জন্য উপযুক্ত দিন।';
    } else {
      if (isRainy) return 'Precipitation expected today. Carrying an umbrella is strongly advised.';
      if (isCold) return 'Brisk temperatures expected. Pack light layers for evening comfort.';
      if (isHot) return 'High temperatures today. Stay hydrated and seek shade during peak sun hours.';
      return 'Ideal weather conditions ahead with pleasant temperatures for outdoor activities.';
    }
  };

  return (
    <div className="space-y-8">
      {/* City Navigation & Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* City Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {cities.slice(0, 7).map((city) => (
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

        {/* Search & Refresh Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadWeather(true)}
            disabled={refreshing}
            title="Refresh weather"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{lang === 'bn' ? 'বিশ্বের শহর খুঁজুন' : 'Search Any City'}</span>
          </button>
        </div>
      </div>

      {loading && !forecast ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-7 w-7 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আবহাওয়া তথ্য লোড হচ্ছে...' : 'Fetching live meteorological data...'}
            </p>
          </div>
        </div>
      ) : forecast ? (
        <div className="space-y-6">
          {/* Main Weather Hero Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c162d] p-6 sm:p-8 shadow-xl">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Column: City & Temperature */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCity.flag}</span>
                  <span className="text-sm font-semibold text-slate-400">
                    {lang === 'bn' ? selectedCity.bnCountry : selectedCity.country}
                  </span>
                </div>
                <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white">
                  {lang === 'bn' ? selectedCity.bnName : selectedCity.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-4">
                  <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {convertTemp(forecast.current.temp)}°{tempUnit}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-lg font-semibold text-cyan-400">
                      {lang === 'bn' ? forecast.current.conditionBnText : forecast.current.conditionText}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lang === 'bn' ? 'অনুভূত হচ্ছে:' : 'Feels like:'}{' '}
                      <span className="font-mono text-slate-200">
                        {convertTemp(forecast.current.feelsLike)}°{tempUnit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Practical recommendation banner */}
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-2.5 text-xs text-cyan-200">
                  <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>{getTravelInsight(forecast)}</span>
                </div>
              </div>

              {/* Right Column: 4 Key Atmospheric Parameters */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-96">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-white tabular-nums">
                    {forecast.current.humidity}%
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Wind className="h-4 w-4 text-teal-400" />
                    <span>{lang === 'bn' ? 'বাতাসের গতি' : 'Wind Speed'}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-white tabular-nums">
                    {forecast.current.windSpeed} km/h
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Gauge className="h-4 w-4 text-indigo-400" />
                    <span>{lang === 'bn' ? 'বায়ুচাপ' : 'Pressure'}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-white tabular-nums">
                    {forecast.current.pressure} hPa
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Umbrella className="h-4 w-4 text-sky-400" />
                    <span>{lang === 'bn' ? 'বৃষ্টির সম্ভাবনা' : 'Rain Chance'}</span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-white tabular-nums">
                    {forecast.daily[0]?.precipitationProb ?? 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Hourly Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4">
              {lang === 'bn' ? 'আগামী ২৪ ঘণ্টার আবহাওয়ার পূর্বাভাস' : '24-Hour Hourly Forecast'}
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {forecast.hourly.map((h, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 min-w-[76px] shrink-0 text-center hover:border-slate-700 transition-colors"
                >
                  <span className="text-xs font-mono text-slate-400">
                    {idx === 0 ? (lang === 'bn' ? 'এখন' : 'Now') : `${h.hour}:00`}
                  </span>
                  <div>{renderWeatherIcon(h.weatherCode, h.isDay, 'h-5 w-5')}</div>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {convertTemp(h.temp)}°
                  </span>
                  {h.precipitationProb > 0 ? (
                    <span className="text-[10px] font-mono text-cyan-400">
                      {h.precipitationProb}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">-</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Extended Forecast */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4">
              {lang === 'bn' ? '৭ দিনের আবহাওয়া চিত্র' : '7-Day Extended Forecast'}
            </h2>

            <div className="divide-y divide-slate-800/80">
              {forecast.daily.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3.5 text-xs sm:text-sm hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                >
                  {/* Day name */}
                  <div className="w-24 font-medium text-white">
                    {lang === 'bn' ? day.bnDayName : day.dayName}
                  </div>

                  {/* Weather Icon and Rain prob */}
                  <div className="flex items-center gap-2 w-28">
                    {renderWeatherIcon(day.weatherCode, true, 'h-4 w-4')}
                    {day.precipitationProb > 20 && (
                      <span className="text-[11px] font-mono text-cyan-400">
                        {day.precipitationProb}%
                      </span>
                    )}
                  </div>

                  {/* Sunrise & Sunset */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Sunrise className="h-3.5 w-3.5 text-amber-400" />
                      {day.sunrise}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Sunset className="h-3.5 w-3.5 text-orange-400" />
                      {day.sunset}
                    </span>
                  </div>

                  {/* High and Low Temps */}
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-mono text-slate-400 tabular-nums">
                      {convertTemp(day.minTemp)}°
                    </span>
                    <div className="h-1.5 w-16 sm:w-24 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"
                        style={{ width: '85%' }}
                      />
                    </div>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {convertTemp(day.maxTemp)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
