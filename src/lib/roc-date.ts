/** 民國年與西元年轉換。純函式。民國元年 = 西元 1912 年。 */

export type RocFailure = 'empty' | 'format' | 'range' | 'date';

export interface RocResult {
  ok: boolean;
  failure?: RocFailure;
  /** 輸入判定為民國或西元 */
  from?: 'roc' | 'ad';
  adYear?: number;
  rocYear?: number;
  month?: number;
  day?: number;
  /** 民國前（西元 1911 年以前） */
  beforeRoc?: boolean;
}

const OFFSET = 1911;

export function rocYearLabel(adYear: number): string {
  return adYear > OFFSET ? `民國 ${adYear - OFFSET} 年` : `民國前 ${OFFSET + 1 - adYear} 年`;
}

function validDate(y: number, m: number, d: number): boolean {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function normalize(input: string): string {
  return input
    .replace(/[\s　]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

/**
 * 接受：
 *  - 只有年份：114、民國114年、2025、西元2025年
 *  - 完整日期：114/3/5、114-03-05、民國114年3月5日、1140305、2025/03/05、20250305
 * 年份 4 位數以上視為西元，3 位數以下視為民國；明確寫「民國／西元」者從其標示。
 */
export function convertRoc(input: string): RocResult {
  let s = normalize(input);
  if (s === '') return { ok: false, failure: 'empty' };

  let forced: 'roc' | 'ad' | undefined;
  if (/^民國前/.test(s)) {
    const m = s.match(/^民國前(\d{1,3})年?$/);
    if (!m) return { ok: false, failure: 'format' };
    const ad = OFFSET + 1 - Number(m[1]);
    if (ad < 1) return { ok: false, failure: 'range' };
    return { ok: true, from: 'roc', adYear: ad, rocYear: -Number(m[1]), beforeRoc: true };
  }
  if (s.startsWith('民國')) {
    forced = 'roc';
    s = s.slice(2);
  } else if (s.startsWith('西元')) {
    forced = 'ad';
    s = s.slice(2);
  }

  let y: number, mo: number | undefined, d: number | undefined;
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d{1,4})[年/.-](\d{1,2})[月/.-](\d{1,2})日?$/))) {
    [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  } else if ((m = s.match(/^(\d{1,4})年?$/))) {
    y = Number(m[1]);
  } else if ((m = s.match(/^(\d{3})(\d{2})(\d{2})$/)) || (m = s.match(/^(\d{4})(\d{2})(\d{2})$/))) {
    [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    forced ??= m[1]!.length === 4 ? 'ad' : 'roc';
  } else {
    return { ok: false, failure: 'format' };
  }

  const yearDigits = String(y).length;
  const from = forced ?? (yearDigits >= 4 ? 'ad' : 'roc');
  const adYear = from === 'roc' ? y + OFFSET : y;
  if (y < 1 || adYear < 1 || adYear > 9999) return { ok: false, failure: 'range' };
  if (mo !== undefined && d !== undefined && !validDate(adYear, mo, d)) return { ok: false, failure: 'date' };

  return { ok: true, from, adYear, rocYear: adYear - OFFSET, month: mo, day: d, beforeRoc: adYear <= OFFSET };
}

export const ROC_FAILURE: Record<RocFailure, string> = {
  empty: '請輸入年份或日期。',
  format: '看不懂這個格式。可以輸入 114、2025、114/3/5 或 2025-03-05。',
  range: '年份超出可轉換的範圍。',
  date: '這一天不存在，請檢查月份與日期。',
};
