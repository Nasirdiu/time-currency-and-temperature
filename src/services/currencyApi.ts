import { FALLBACK_EXCHANGE_RATES } from '../data/currencies';
import { ExchangeRatesData } from '../types';

const RATES_STORAGE_KEY = 'meridian_exchange_rates_v1';
const CACHE_HOURS = 4;

let inMemoryRates: ExchangeRatesData | null = null;

export async function getExchangeRates(): Promise<ExchangeRatesData> {
  if (inMemoryRates && Date.now() - inMemoryRates.lastUpdated < CACHE_HOURS * 3600 * 1000) {
    return inMemoryRates;
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(RATES_STORAGE_KEY);
    if (stored) {
      const parsed: ExchangeRatesData = JSON.parse(stored);
      if (Date.now() - parsed.lastUpdated < CACHE_HOURS * 3600 * 1000) {
        inMemoryRates = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Storage read failed:', e);
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error(`Currency API failed: ${res.status}`);
    const data = await res.json();

    if (data && data.rates) {
      const fetchedData: ExchangeRatesData = {
        base: data.base_code || 'USD',
        date: data.time_last_update_utc ? data.time_last_update_utc.slice(0, 16) : new Date().toISOString().slice(0, 10),
        rates: { ...FALLBACK_EXCHANGE_RATES, ...data.rates },
        lastUpdated: Date.now(),
      };
      inMemoryRates = fetchedData;
      try {
        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(fetchedData));
      } catch {}
      return fetchedData;
    }
  } catch (err) {
    console.warn('Live rates failed, using fallback benchmarks:', err);
  }

  const fallback: ExchangeRatesData = {
    base: 'USD',
    date: new Date().toISOString().slice(0, 10),
    rates: FALLBACK_EXCHANGE_RATES,
    lastUpdated: Date.now(),
  };
  inMemoryRates = fallback;
  return fallback;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): {
  result: number;
  rate: number;
  inverseRate: number;
} {
  const fromRate = rates[fromCurrency] ?? (FALLBACK_EXCHANGE_RATES[fromCurrency] || 1);
  const toRate = rates[toCurrency] ?? (FALLBACK_EXCHANGE_RATES[toCurrency] || 1);

  // Conversion: (amount / fromRate) * toRate
  const rate = toRate / fromRate;
  const inverseRate = 1 / rate;
  const result = amount * rate;

  return {
    result,
    rate,
    inverseRate,
  };
}
