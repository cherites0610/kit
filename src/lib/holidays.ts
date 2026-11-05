/**
 * 國定假日、補假、補班與農曆查詢。純函式。
 * 假日資料見 src/data/calendar.json：只記錄「與週末預設不同」或有名稱的日子，
 * 其餘平日為上班日、週六日為例假。實際放假以行政院人事行政總處公告為準。
 */
import calendar from '../data/calendar.json';

export type DayKind = 'holiday' | 'weekend' | 'workday' | 'makeup-workday';

export interface DayInfo {
  date: string; // YYYY-MM-DD
  kind: DayKind;
  name: string;
  weekday: string;
  lunar: string;
  /** 該年份是否有內建資料；無資料時只能依週末判斷 */
  hasData: boolean;
}

type Row = [string, number, string];
const DATA = calendar as unknown as Record<string, Row[]>;

export const YEARS: number[] = Object.keys(DATA).map(Number).sort((a, b) => a - b);

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const lunarFmt = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { month: 'long', day: 'numeric' });

const LUNAR_DAY = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

/** 農曆日期，例如「八月十五」。使用瀏覽器內建的農曆。 */
export function lunarOf(date: string): string {
  const parts = lunarFmt.formatToParts(new Date(`${date}T12:00:00Z`));
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? 0);
  return `${month}${LUNAR_DAY[day] ?? day}`;
}

function toYmd(d: string): string {
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

export function dayInfo(date: string): DayInfo | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const dt = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== date) return null;
  const dow = dt.getUTCDay();
  const year = Number(date.slice(0, 4));
  const rows = DATA[String(year)];
  const row = rows?.find((r) => toYmd(r[0]) === date);
  const weekend = dow === 0 || dow === 6;

  let kind: DayKind = weekend ? 'weekend' : 'workday';
  let name = '';
  if (row) {
    name = row[2];
    kind = row[1] ? 'holiday' : 'makeup-workday';
  }
  return { date, kind, name, weekday: WEEKDAYS[dow]!, lunar: lunarOf(date), hasData: !!rows };
}

export interface YearEntry {
  date: string;
  weekday: string;
  kind: 'holiday' | 'makeup-workday';
  name: string;
  lunar: string;
}

/** 某年所有「特別的日子」：國定假日、補假、調整放假與補班；不含單純的週末 */
export function yearEntries(year: number): YearEntry[] {
  const rows = DATA[String(year)] ?? [];
  return rows
    .filter((r) => r[1] === 0 || r[2] !== '')
    .map((r) => {
      const date = toYmd(r[0]);
      const dt = new Date(`${date}T12:00:00Z`);
      return {
        date,
        weekday: WEEKDAYS[dt.getUTCDay()]!,
        kind: r[1] ? ('holiday' as const) : ('makeup-workday' as const),
        name: r[2] || (r[1] ? '' : '補行上班'),
        lunar: lunarOf(date),
      };
    });
}

export const KIND_LABEL: Record<DayKind, string> = {
  holiday: '放假',
  weekend: '週末例假',
  workday: '上班日',
  'makeup-workday': '補行上班',
};
