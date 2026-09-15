/**
 * NYSE/NASDAQ session detection in America/New_York wall-clock time.
 * Does NOT account for market holidays (Thanksgiving, Christmas, etc.) --
 * only weekday + time-of-day. Good enough to gate the after-hours agent
 * for the bounty demo; a real deployment would need a holiday calendar.
 */

export type MarketSession = 'pre-market' | 'regular' | 'after-hours' | 'closed';

const ET_TIME_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour12: false,
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function getEasternParts(date: Date): { weekday: string; minutesSinceMidnight: number } {
  const parts = ET_TIME_FORMAT.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekday = get('weekday');
  const hour = parseInt(get('hour'), 10);
  const minute = parseInt(get('minute'), 10);
  return { weekday, minutesSinceMidnight: hour * 60 + minute };
}

const PRE_MARKET_OPEN = 4 * 60; // 04:00 ET
const REGULAR_OPEN = 9 * 60 + 30; // 09:30 ET
const REGULAR_CLOSE = 16 * 60; // 16:00 ET
const AFTER_HOURS_CLOSE = 20 * 60; // 20:00 ET

export function getMarketSession(date: Date = new Date()): MarketSession {
  const { weekday, minutesSinceMidnight: t } = getEasternParts(date);

  if (weekday === 'Sat' || weekday === 'Sun') return 'closed';
  if (t >= PRE_MARKET_OPEN && t < REGULAR_OPEN) return 'pre-market';
  if (t >= REGULAR_OPEN && t < REGULAR_CLOSE) return 'regular';
  if (t >= REGULAR_CLOSE && t < AFTER_HOURS_CLOSE) return 'after-hours';
  return 'closed';
}

export function isAfterHours(date: Date = new Date()): boolean {
  return getMarketSession(date) === 'after-hours';
}
