/** 統一編號（營利事業統一編號）檢查與生成。純函式，不碰 DOM。 */

const WEIGHTS = [1, 2, 1, 2, 1, 2, 4, 1] as const;

export type UbnFailure = 'empty' | 'non-digit' | 'length' | 'checksum';

export interface UbnStep {
  digit: number;
  weight: number;
  /** 該位數乘上權重後，各位數字相加 */
  value: number;
}

export interface UbnResult {
  ok: boolean;
  /** 已去除空白與全形轉換後的輸入 */
  normalized: string;
  failure?: UbnFailure;
  steps?: UbnStep[];
  sum?: number;
}

/** 去除空白、全形數字轉半形 */
export function normalizeUbn(input: string): string {
  return input
    .replace(/[\s\u3000]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

function digitSum(n: number): number {
  return Math.floor(n / 10) + (n % 10);
}

/** 自 2023 年起財政部檢查除數為 5;第 7 碼為 7 時，總和或總和加 1 能被整除即可。 */
export function validateUbn(input: string): UbnResult {
  const normalized = normalizeUbn(input);
  if (normalized === '') return { ok: false, normalized, failure: 'empty' };
  if (!/^\d+$/.test(normalized)) return { ok: false, normalized, failure: 'non-digit' };
  if (normalized.length !== 8) return { ok: false, normalized, failure: 'length' };

  const steps: UbnStep[] = [...normalized].map((ch, i) => {
    const digit = Number(ch);
    const weight = WEIGHTS[i]!;
    return { digit, weight, value: digitSum(digit * weight) };
  });
  const sum = steps.reduce((acc, s) => acc + s.value, 0);
  const seventhIsSeven = normalized[6] === '7';
  const ok = sum % 5 === 0 || (seventhIsSeven && (sum + 1) % 5 === 0);
  return ok
    ? { ok, normalized, steps, sum }
    : { ok, normalized, failure: 'checksum', steps, sum };
}

/** 產生通過檢查的統一編號（測試用）。random 可注入以利測試。 */
export function generateUbn(random: () => number = Math.random): string {
  for (;;) {
    const digits = Array.from({ length: 8 }, () => Math.floor(random() * 10)).join('');
    if (validateUbn(digits).ok) return digits;
  }
}

export function generateUbns(count: number, random: () => number = Math.random): string[] {
  const n = Math.min(Math.max(Math.floor(count) || 1, 1), 10);
  const out = new Set<string>();
  while (out.size < n) out.add(generateUbn(random));
  return [...out];
}

export const FAILURE_MESSAGE: Record<UbnFailure, string> = {
  empty: '請輸入 8 碼統一編號。',
  'non-digit': '統一編號只能是數字。',
  length: '統一編號必須剛好 8 碼。',
  checksum: '檢查碼不符，這不是有效的統一編號格式。',
};
