import React, { useState, useEffect } from 'react';
import { CurrencyItem, ExchangeRatesData, Language } from '../types';
import { CURRENCY_LIST } from '../data/currencies';
import { getExchangeRates, convertCurrency } from '../services/currencyApi';
import {
  ArrowRightLeft,
  TrendingUp,
  RefreshCw,
  Calculator,
  Coins,
  Check,
  ChevronDown,
} from 'lucide-react';

interface CurrencyConverterProps {
  lang: Language;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ lang }) => {
  const [ratesData, setRatesData] = useState<ExchangeRatesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('BDT');
  const [amount, setAmount] = useState<number>(100);

  // Load rates
  const loadRates = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getExchangeRates();
      setRatesData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleSwap = () => {
    const prevFrom = fromCode;
    const prevTo = toCode;
    setFromCode(prevTo);
    setToCode(prevFrom);
  };

  const fromCurrency = CURRENCY_LIST.find((c) => c.code === fromCode) || CURRENCY_LIST[0];
  const toCurrency = CURRENCY_LIST.find((c) => c.code === toCode) || CURRENCY_LIST[1];

  const conversion = ratesData
    ? convertCurrency(amount, fromCode, toCode, ratesData.rates)
    : { result: amount * 122.5, rate: 122.5, inverseRate: 0.00816 };

  // Comparison currencies (top 8)
  const comparisonCodes = ['BDT', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'INR', 'CAD', 'SGD', 'MYR'].filter(
    (c) => c !== fromCode
  );

  return (
    <div className="space-y-8">
      {/* Main Converter Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c1a2d] p-6 sm:p-8 shadow-xl">
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top metadata & refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400">
                <Coins className="h-3.5 w-3.5" />
                <span>{lang === 'bn' ? 'আন্তর্জাতিক রিয়েল-টাইম মুদ্রা বিনিময়' : 'Live Real-Time Currency Converter'}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'bn' ? 'মুদ্রা রূপান্তর ও বিনিময় হার' : 'Exchange Rate Calculator'}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>
                {lang === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last update:'}{' '}
                <span className="font-mono text-slate-300">
                  {ratesData?.date || new Date().toISOString().slice(0, 10)}
                </span>
              </span>
              <button
                onClick={() => loadRates(true)}
                disabled={refreshing}
                title="Refresh rates"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Conversion Panel */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 pt-2">
            {/* FROM BOX */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors focus-within:border-cyan-500/50">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                {lang === 'bn' ? 'আপনি রূপান্তর করবেন (Amount)' : 'You Convert'}
              </label>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent font-mono text-3xl font-extrabold text-white focus:outline-none tabular-nums"
                  placeholder="0"
                />

                <div className="relative shrink-0">
                  <select
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    className="flex appearance-none items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white focus:border-cyan-500 focus:outline-none pr-8 cursor-pointer"
                  >
                    {CURRENCY_LIST.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-400 truncate">
                {fromCurrency.flag} {lang === 'bn' ? fromCurrency.bnName : fromCurrency.name} ({fromCurrency.symbol})
              </div>
            </div>

            {/* SWAP BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                title="Swap currencies"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all duration-200 shadow-md"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            {/* TO BOX */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors focus-within:border-cyan-500/50">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                {lang === 'bn' ? 'ফলাফল (Converted Amount)' : 'Converted Total'}
              </label>

              <div className="flex items-center justify-between gap-3">
                <div className="w-full font-mono text-3xl font-extrabold text-cyan-400 tabular-nums truncate">
                  {conversion.result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </div>

                <div className="relative shrink-0">
                  <select
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    className="flex appearance-none items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white focus:border-cyan-500 focus:outline-none pr-8 cursor-pointer"
                  >
                    {CURRENCY_LIST.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-400 truncate">
                {toCurrency.flag} {lang === 'bn' ? toCurrency.bnName : toCurrency.name} ({toCurrency.symbol})
              </div>
            </div>
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-500">{lang === 'bn' ? 'দ্রুত পরিমাণ:' : 'Quick Amounts:'}</span>
            {[10, 50, 100, 500, 1000, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  amount === val
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {val.toLocaleString()} {fromCode}
              </button>
            ))}
          </div>

          {/* Exchange Rate Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>
                1 {fromCode} ={' '}
                <strong className="font-mono text-cyan-400">
                  {conversion.rate.toFixed(4)} {toCode}
                </strong>
              </span>
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              1 {toCode} = {conversion.inverseRate.toFixed(6)} {fromCode}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Currency Comparison Board */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'bn' ? 'অন্যান্য বিশ্ব মুদ্রার সাথে তুলনা' : 'Multi-Currency Comparison Board'}
            </h2>
            <p className="text-xs text-slate-400">
              {amount.toLocaleString()} {fromCode} {lang === 'bn' ? 'সমান অন্যান্য মুদ্রার মান:' : 'translates simultaneously into:'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {comparisonCodes.map((code) => {
            const curr = CURRENCY_LIST.find((c) => c.code === code);
            if (!curr || !ratesData) return null;
            const conv = convertCurrency(amount, fromCode, code, ratesData.rates);

            return (
              <div
                key={code}
                className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 p-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{curr.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{curr.code}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[100px]">
                      {lang === 'bn' ? curr.bnName : curr.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
                    {curr.symbol}{' '}
                    {conv.result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    1 {fromCode} = {conv.rate.toFixed(3)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
