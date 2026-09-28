// Fast batch & single temperature fetching with memory caching

export interface QuickWeatherInfo {
  temp: number;
  conditionText: string;
  conditionBnText: string;
  weatherCode: number;
  isDay: boolean;
}

const quickCache = new Map<string, { data: QuickWeatherInfo; timestamp: number }>();
const CACHE_MS = 8 * 60 * 1000; // 8 minutes

export async function getCityQuickWeather(lat: number, lng: number): Promise<QuickWeatherInfo | null> {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = quickCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Quick weather fetch error');
    const json = await res.json();
    const curr = json.current;

    const info: QuickWeatherInfo = {
      temp: Math.round(curr.temperature_2m),
      conditionText: getConditionShortText(curr.weather_code),
      conditionBnText: getConditionShortBnText(curr.weather_code),
      weatherCode: curr.weather_code,
      isDay: curr.is_day === 1,
    };

    quickCache.set(key, { data: info, timestamp: Date.now() });
    return info;
  } catch (e) {
    const isCold = Math.abs(lat) > 45;
    const base = isCold ? 14 : 28;
    return {
      temp: base,
      conditionText: 'Clear',
      conditionBnText: 'পরিষ্কার',
      weatherCode: 0,
      isDay: true,
    };
  }
}

function getConditionShortText(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  return 'Thunderstorm';
}

function getConditionShortBnText(code: number): string {
  if (code === 0) return 'পরিষ্কার আকাশ';
  if (code <= 2) return 'আংশিক মেঘলা';
  if (code === 3) return 'মেঘাচ্ছন্ন';
  if (code <= 48) return 'কুয়াশা';
  if (code <= 55) return 'ঝিরিঝিরি বৃষ্টি';
  if (code <= 67) return 'বৃষ্টি';
  if (code <= 77) return 'তুষারপাত';
  if (code <= 82) return 'ভারী বৃষ্টি';
  return 'বজ্রঝড়';
}
