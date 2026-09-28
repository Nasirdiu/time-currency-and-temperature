export function formatTimeInZone(
  date: Date,
  timezone: string,
  format: '12h' | '24h' = '12h',
  showSeconds: boolean = true
): {
  timeStr: string;
  ampm: string;
  dayPeriod: 'night' | 'morning' | 'afternoon' | 'evening';
  hours24: number;
  minutes: number;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: format === '12h',
    });

    const hour24Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === 'hour')?.value || '00';
    const minPart = parts.find((p) => p.type === 'minute')?.value || '00';
    const secPart = parts.find((p) => p.type === 'second')?.value;
    const dayPeriodPart = parts.find((p) => p.type === 'dayPeriod')?.value || '';

    const h24Parts = hour24Formatter.formatToParts(date);
    const h24Val = parseInt(h24Parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minVal = parseInt(h24Parts.find((p) => p.type === 'minute')?.value || '0', 10);

    let dayPeriod: 'night' | 'morning' | 'afternoon' | 'evening' = 'morning';
    if (h24Val >= 22 || h24Val < 5) dayPeriod = 'night';
    else if (h24Val >= 5 && h24Val < 12) dayPeriod = 'morning';
    else if (h24Val >= 12 && h24Val < 17) dayPeriod = 'afternoon';
    else dayPeriod = 'evening';

    let timeStr = `${hourPart}:${minPart}`;
    if (showSeconds && secPart) {
      timeStr += `:${secPart}`;
    }

    return {
      timeStr,
      ampm: dayPeriodPart.toUpperCase(),
      dayPeriod,
      hours24: h24Val,
      minutes: minVal,
    };
  } catch (e) {
    return {
      timeStr: '--:--',
      ampm: '',
      dayPeriod: 'morning',
      hours24: 12,
      minutes: 0,
    };
  }
}

export function formatDateInZone(date: Date, timezone: string, lang: 'en' | 'bn' = 'en'): string {
  try {
    const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export function getTimeDifferenceText(
  targetTimezone: string,
  baseTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  lang: 'en' | 'bn' = 'en'
): string {
  try {
    const now = new Date();
    const targetOffset = getZoneOffsetMinutes(now, targetTimezone);
    const baseOffset = getZoneOffsetMinutes(now, baseTimezone);
    const diffMinutes = targetOffset - baseOffset;
    const diffHours = diffMinutes / 60;

    if (diffHours === 0) {
      return lang === 'bn' ? 'একই সময়' : 'Same time';
    }

    const absHours = Math.abs(diffHours);
    const isWhole = Number.isInteger(absHours);
    const formattedHours = isWhole ? absHours.toString() : absHours.toFixed(1);

    if (diffHours > 0) {
      return lang === 'bn'
        ? `+${formattedHours} ঘণ্টা এগিয়ে`
        : `+${formattedHours}h ahead`;
    } else {
      return lang === 'bn'
        ? `-${formattedHours} ঘণ্টা পিছিয়ে`
        : `-${formattedHours}h behind`;
    }
  } catch {
    return '';
  }
}

function getZoneOffsetMinutes(date: Date, timeZone: string): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
}

export function getHourAvailabilityCategory(hour24: number): 'work' | 'awake' | 'sleep' {
  if (hour24 >= 9 && hour24 <= 17) return 'work';
  if ((hour24 >= 7 && hour24 < 9) || (hour24 > 17 && hour24 <= 22)) return 'awake';
  return 'sleep';
}
