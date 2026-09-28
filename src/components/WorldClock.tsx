import React, { useState, useEffect } from 'react';
import { CityData, Language, TimeFormat } from '../types';
import { formatTimeInZone, formatDateInZone, getTimeDifferenceText, getHourAvailabilityCategory } from '../utils/time';
import { Plus, Trash2, Sun, Moon, Sunrise, Sunset, Clock as ClockIcon, Users, Sliders, Sparkles } from 'lucide-react';

interface WorldClockProps {
  pinnedCities: CityData[];
  onAddCityClick: () => void;
  onRemoveCity: (cityId: string) => void;
  lang: Language;
  timeFormat: TimeFormat;
}

export const WorldClock: React.FC<WorldClockProps> = ({
  pinnedCities,
  onAddCityClick,
  onRemoveCity,
  lang,
  timeFormat,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [sliderHourOffset, setSliderHourOffset] = useState<number>(0);
  const [isMeetingPlannerOpen, setIsMeetingPlannerOpen] = useState<boolean>(true);

  // Tick every second for live accurate time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localFormatted = formatTimeInZone(currentTime, localTimezone, timeFormat, true);
  const localDateStr = formatDateInZone(currentTime, localTimezone, lang);

  // Time shifted by slider for meeting planner
  const plannerTime = new Date(currentTime.getTime() + sliderHourOffset * 3600000);

  return (
    <div className="space-y-8">
      {/* Local Time Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0d1527] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>{lang === 'bn' ? 'আপনার বর্তমান স্থানীয় সময়' : 'Your Local Timezone'}</span>
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              {localFormatted.timeStr}
              {timeFormat === '12h' && (
                <span className="ml-2 text-xl sm:text-2xl font-semibold text-slate-400">
                  {localFormatted.ampm}
                </span>
              )}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {localDateStr} · <span className="font-mono text-xs text-slate-300">{localTimezone}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMeetingPlannerOpen(!isMeetingPlannerOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isMeetingPlannerOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{lang === 'bn' ? 'মিটিং ওভারল্যাপ প্ল্যানার' : 'Meeting Planner'}</span>
            </button>

            <button
              onClick={onAddCityClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{lang === 'bn' ? 'শহর যোগ করুন' : 'Add City'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Planner / Time Scrubber */}
      {isMeetingPlannerOpen && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400">
                <Users className="h-3.5 w-3.5" />
                <span>{lang === 'bn' ? 'ইন্টারেক্টিভ টাইমজোন মিটিং প্ল্যানার' : '24-Hour Time Slider & Overlap Finder'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn'
                  ? 'স্লাইডার সরিয়ে দেখুন কোন সময়ে সব শহরের দলগুলো একসাথে মিটিং করতে পারবে।'
                  : 'Drag the slider to find ideal overlapping working hours across multiple global teams.'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {lang === 'bn' ? 'কাজের সময় (9AM-5PM)' : 'Work (9am-5pm)'}
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                {lang === 'bn' ? 'জাগ্রত সময়' : 'Awake'}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                {lang === 'bn' ? 'ঘুমের সময়' : 'Sleep'}
              </span>
            </div>
          </div>

          {/* Slider control */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>{lang === 'bn' ? 'টাইম শিফট:' : 'Time Offset:'}</span>
              <span className="text-cyan-400 font-bold">
                {sliderHourOffset === 0
                  ? lang === 'bn' ? 'বর্তমান সময় (০ ঘণ্টা)' : 'Live Current Time (+0h)'
                  : sliderHourOffset > 0
                  ? `+${sliderHourOffset}h forward`
                  : `${sliderHourOffset}h backward`}
              </span>
              <button
                onClick={() => setSliderHourOffset(0)}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-2"
              >
                {lang === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            </div>

            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={sliderHourOffset}
              onChange={(e) => setSliderHourOffset(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-12h</span>
              <span>-6h</span>
              <span>Now</span>
              <span>+6h</span>
              <span>+12h</span>
            </div>
          </div>

          {/* Planner City Timeline Rows */}
          <div className="divide-y divide-slate-800/80 border-t border-slate-800/80 pt-2 space-y-3">
            {pinnedCities.map((city) => {
              const shiftedInfo = formatTimeInZone(plannerTime, city.timezone, timeFormat, false);
              const avail = getHourAvailabilityCategory(shiftedInfo.hours24);
              const availColor =
                avail === 'work'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : avail === 'awake'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700';

              const availLabel =
                avail === 'work'
                  ? lang === 'bn' ? 'অফিস সময়' : 'Working hours'
                  : avail === 'awake'
                  ? lang === 'bn' ? 'সকাল/সন্ধ্যা' : 'Awake'
                  : lang === 'bn' ? 'ঘুমাচ্ছে' : 'Sleeping';

              return (
                <div key={city.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{city.flag}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {lang === 'bn' ? city.bnName : city.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {getTimeDifferenceText(city.timezone, localTimezone, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${availColor}`}>
                      {availLabel}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                        {shiftedInfo.timeStr}
                        {timeFormat === '12h' && (
                          <span className="ml-1 text-xs text-slate-400">{shiftedInfo.ampm}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDateInZone(plannerTime, city.timezone, lang)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pinned Cities Clock Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {lang === 'bn' ? 'সংরক্ষিত বৈশ্বিক ঘড়ি সমূহ' : 'Pinned Global Cities'}
          </h2>
          <span className="text-xs text-slate-400">
            {pinnedCities.length} {lang === 'bn' ? 'টি শহর সক্রিয়' : 'cities tracking'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pinnedCities.map((city) => {
            const timeInfo = formatTimeInZone(currentTime, city.timezone, timeFormat, true);
            const dateStr = formatDateInZone(currentTime, city.timezone, lang);
            const diffText = getTimeDifferenceText(city.timezone, localTimezone, lang);
            const isNight = timeInfo.dayPeriod === 'night';
            const isWorkHour = timeInfo.hours24 >= 9 && timeInfo.hours24 <= 17;

            return (
              <div
                key={city.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                {/* Header of card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">{city.flag}</span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {lang === 'bn' ? city.bnName : city.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {lang === 'bn' ? city.bnCountry : city.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Day / Night indicator */}
                    <div
                      title={isNight ? 'Night' : 'Day'}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        isNight
                          ? 'border-indigo-900/50 bg-indigo-950/30 text-indigo-400'
                          : 'border-amber-900/50 bg-amber-950/30 text-amber-400'
                      }`}
                    >
                      {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </div>

                    {/* Delete button (prevent deleting if only 1 left) */}
                    {pinnedCities.length > 1 && (
                      <button
                        onClick={() => onRemoveCity(city.id)}
                        title="Remove city"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Big Digital Clock Display */}
                <div className="my-5 flex items-baseline justify-between">
                  <div className="font-mono text-3xl font-extrabold tracking-tight text-white tabular-nums">
                    {timeInfo.timeStr}
                    {timeFormat === '12h' && (
                      <span className="ml-2 text-sm font-semibold text-slate-400">
                        {timeInfo.ampm}
                      </span>
                    )}
                  </div>

                  {/* Work hours indicator */}
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      isWorkHour
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                        : 'bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    {isWorkHour
                      ? lang === 'bn' ? 'অফিস খোলা' : 'Office Open'
                      : lang === 'bn' ? 'অফিস বন্ধ' : 'Off-hours'}
                  </span>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                  <span>{dateStr}</span>
                  <span className="font-mono text-cyan-400/90">{diffText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
