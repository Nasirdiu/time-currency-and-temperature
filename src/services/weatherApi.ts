import { FullWeatherForecast, WeatherCurrent, WeatherDaily, WeatherHourly } from '../types';

export function getWeatherConditionInfo(code: number, isDay: boolean = true): {
  text: string;
  bnText: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning';
  bgColor: string;
} {
  switch (code) {
    case 0: // Clear sky
      return isDay
        ? { text: 'Clear Sky', bnText: 'পরিষ্কার আকাশ', iconName: 'sun', bgColor: 'from-amber-500/20 to-orange-500/10' }
        : { text: 'Clear Night', bnText: 'পরিষ্কার রাত', iconName: 'moon', bgColor: 'from-indigo-900/30 to-slate-900/40' };
    case 1:
    case 2: // Mainly clear, partly cloudy
      return isDay
        ? { text: 'Partly Cloudy', bnText: 'আংশিক মেঘলা', iconName: 'cloud-sun', bgColor: 'from-sky-500/20 to-blue-500/10' }
        : { text: 'Partly Cloudy', bnText: 'আংশিক মেঘলা রাত', iconName: 'cloud-moon', bgColor: 'from-slate-800/40 to-indigo-950/40' };
    case 3: // Overcast
      return { text: 'Overcast', bnText: 'মেঘাচ্ছন্ন', iconName: 'cloud', bgColor: 'from-slate-700/30 to-slate-800/20' };
    case 45:
    case 48: // Fog
      return { text: 'Foggy / Hazy', bnText: 'কুয়াশাচ্ছন্ন', iconName: 'cloud-fog', bgColor: 'from-slate-600/30 to-zinc-700/20' };
    case 51:
    case 53:
    case 55: // Drizzle
      return { text: 'Light Drizzle', bnText: 'ঝিরিঝিরি বৃষ্টি', iconName: 'cloud-drizzle', bgColor: 'from-cyan-700/20 to-blue-800/20' };
    case 61:
    case 63:
    case 65: // Rain
      return { text: 'Rain Shower', bnText: 'বৃষ্টিপাত', iconName: 'cloud-rain', bgColor: 'from-blue-600/25 to-sky-900/25' };
    case 71:
    case 73:
    case 75:
    case 77: // Snow
      return { text: 'Snow', bnText: 'তুষারপাত', iconName: 'cloud-snow', bgColor: 'from-indigo-500/20 to-slate-600/20' };
    case 80:
    case 81:
    case 82: // Rain showers
      return { text: 'Heavy Showers', bnText: 'ভারী বৃষ্টি', iconName: 'cloud-rain', bgColor: 'from-blue-700/30 to-slate-900/40' };
    case 95:
    case 96:
    case 99: // Thunderstorm
      return { text: 'Thunderstorm', bnText: 'বজ্রবৃষ্টি', iconName: 'cloud-lightning', bgColor: 'from-purple-900/30 to-amber-950/30' };
    default:
      return { text: 'Fair Weather', bnText: 'স্বাভাবিক আবহাওয়া', iconName: isDay ? 'sun' : 'moon', bgColor: 'from-slate-800/30 to-slate-900/30' };
  }
}

const cache: Map<string, { timestamp: number; data: FullWeatherForecast }> = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchWeatherForecast(lat: number, lng: number, timezone: string = 'auto'): Promise<FullWeatherForecast> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
    const data = await res.json();

    const curr = data.current;
    const condInfo = getWeatherConditionInfo(curr.weather_code, curr.is_day === 1);

    const current: WeatherCurrent = {
      temp: Math.round(curr.temperature_2m),
      feelsLike: Math.round(curr.apparent_temperature),
      humidity: curr.relative_humidity_2m,
      windSpeed: Math.round(curr.wind_speed_10m),
      windDirection: curr.wind_direction_10m,
      uvIndex: 5, // fallback if not in current
      precipitation: curr.precipitation || 0,
      weatherCode: curr.weather_code,
      isDay: curr.is_day === 1,
      pressure: Math.round(curr.surface_pressure),
      visibility: 10,
      conditionText: condInfo.text,
      conditionBnText: condInfo.bnText,
    };

    // Parse hourly (next 24 hours)
    const hourly: WeatherHourly[] = [];
    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];
    const hourlyCodes = data.hourly?.weather_code || [];
    const hourlyRain = data.hourly?.precipitation_probability || [];
    const hourlyIsDay = data.hourly?.is_day || [];

    // Find current hour index or start from now
    const nowIso = new Date().toISOString().slice(0, 13);
    let startIndex = hourlyTimes.findIndex((t: string) => t.startsWith(nowIso));
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
      const timeStr = hourlyTimes[i];
      const hour = new Date(timeStr).getHours();
      hourly.push({
        time: timeStr,
        hour,
        temp: Math.round(hourlyTemps[i] ?? current.temp),
        weatherCode: hourlyCodes[i] ?? 0,
        precipitationProb: hourlyRain[i] ?? 0,
        isDay: hourlyIsDay[i] === 1,
      });
    }

    // Parse daily (7 days)
    const daily: WeatherDaily[] = [];
    const dailyDates = data.daily?.time || [];
    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyRain = data.daily?.precipitation_probability_max || [];
    const dailySunrises = data.daily?.sunrise || [];
    const dailySunsets = data.daily?.sunset || [];

    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

    for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
      const d = new Date(dailyDates[i]);
      const dayIdx = d.getDay();
      daily.push({
        date: dailyDates[i],
        dayName: i === 0 ? 'Today' : dayNamesEn[dayIdx],
        bnDayName: i === 0 ? 'আজ' : dayNamesBn[dayIdx],
        maxTemp: Math.round(dailyMax[i] ?? current.temp),
        minTemp: Math.round(dailyMin[i] ?? current.temp - 5),
        weatherCode: dailyCodes[i] ?? 0,
        precipitationProb: dailyRain[i] ?? 0,
        sunrise: dailySunrises[i]?.slice(11, 16) || '06:00',
        sunset: dailySunsets[i]?.slice(11, 16) || '18:00',
      });
    }

    const result: FullWeatherForecast = {
      current,
      hourly,
      daily,
      updatedAt: new Date().toLocaleTimeString(),
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn('Weather fetch error, using synthetic fallback:', err);
    return getSyntheticForecast(lat, lng);
  }
}

function getSyntheticForecast(lat: number, lng: number): FullWeatherForecast {
  // Graceful offline fallback based on latitude
  const isTropical = Math.abs(lat) < 25;
  const baseTemp = isTropical ? 28 : Math.abs(lat) > 45 ? 12 : 20;

  const current: WeatherCurrent = {
    temp: baseTemp,
    feelsLike: baseTemp + 2,
    humidity: 65,
    windSpeed: 14,
    windDirection: 180,
    uvIndex: 6,
    precipitation: 0,
    weatherCode: 1,
    isDay: true,
    pressure: 1012,
    visibility: 10,
    conditionText: 'Partly Cloudy',
    conditionBnText: 'আংশিক মেঘলা',
  };

  const hourly: WeatherHourly[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const h = (now.getHours() + i) % 24;
    const tempDelta = Math.sin(((h - 6) / 24) * 2 * Math.PI) * 4;
    hourly.push({
      time: new Date(now.getTime() + i * 3600000).toISOString(),
      hour: h,
      temp: Math.round(baseTemp + tempDelta),
      weatherCode: 1,
      precipitationProb: (i * 7) % 30,
      isDay: h >= 6 && h <= 18,
    });
  }

  const daily: WeatherDaily[] = [];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const dayIdx = d.getDay();
    daily.push({
      date: d.toISOString().slice(0, 10),
      dayName: i === 0 ? 'Today' : dayNamesEn[dayIdx],
      bnDayName: i === 0 ? 'আজ' : dayNamesBn[dayIdx],
      maxTemp: baseTemp + 3 + (i % 3),
      minTemp: baseTemp - 4 - (i % 2),
      weatherCode: i % 2 === 0 ? 0 : 2,
      precipitationProb: (i * 12) % 40,
      sunrise: '05:54',
      sunset: '18:12',
    });
  }

  return {
    current,
    hourly,
    daily,
    updatedAt: new Date().toLocaleTimeString(),
  };
}

export async function searchGlobalLocations(query: string): Promise<Array<{
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}>> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      name: r.name,
      country: r.country || '',
      lat: r.latitude,
      lng: r.longitude,
      timezone: r.timezone || 'UTC',
    }));
  } catch (e) {
    console.error('Geocoding search failed:', e);
    return [];
  }
}
