export interface CityData {
  id: string;
  name: string;
  bnName: string;
  country: string;
  bnCountry: string;
  timezone: string;
  lat: number;
  lng: number;
  currency: string;
  currencySymbol: string;
  flag: string;
  popular?: boolean;
}

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  pressure: number;
  visibility: number;
  conditionText: string;
  conditionBnText: string;
}

export interface WeatherHourly {
  time: string;
  hour: number;
  temp: number;
  weatherCode: number;
  precipitationProb: number;
  isDay: boolean;
}

export interface WeatherDaily {
  date: string;
  dayName: string;
  bnDayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationProb: number;
  sunrise: string;
  sunset: string;
}

export interface FullWeatherForecast {
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
  updatedAt: string;
}

export interface CurrencyItem {
  code: string;
  name: string;
  bnName: string;
  symbol: string;
  country: string;
  flag: string;
}

export interface ExchangeRatesData {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastUpdated: number;
}

export type ActiveTab = 'clock' | 'weather' | 'currency' | 'hub';
export type TempUnit = 'C' | 'F';
export type TimeFormat = '12h' | '24h';
export type Language = 'en' | 'bn';
