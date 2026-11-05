/** 身分證字號／新式居留證號檢查與生成（測試用）。純函式。 */

/** 英文字母對應的數值（內政部規則） */
const LETTER_VALUE: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18, K: 19, L: 20, M: 21,
  N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
};

/** 英文字母代表的發證地（歷史縣市亦保留，因為舊證仍有效） */
export const LETTER_PLACE: Record<string, string> = {
  A: '臺北市', B: '臺中市', C: '基隆市', D: '臺南市', E: '高雄市', F: '新北市', G: '宜蘭縣',
  H: '桃園市', I: '嘉義市', J: '新竹縣', K: '苗栗縣', L: '臺中縣', M: '南投縣', N: '彰化縣',
  O: '新竹市', P: '雲林縣', Q: '嘉義縣', R: '臺南縣', S: '高雄縣', T: '屏東縣', U: '花蓮縣',
  V: '臺東縣', W: '金門縣', X: '澎湖縣', Y: '陽明山', Z: '連江縣',
};

export type NationalIdFailure = 'empty' | 'length' | 'format' | 'checksum';
export type NationalIdKind = 'citizen' | 'resident';

export interface NationalIdResult {
  ok: boolean;
  normalized: string;
  failure?: NationalIdFailure;
  kind?: NationalIdKind;
  /** 國民身分證：1 男、2 女；新式居留證：8 男、9 女 */
  gender?: '男' | '女';
  place?: string;
}

export function normalizeNationalId(input: string): string {
  return input
    .replace(/[\s　]/g, '')
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .toUpperCase();
}

function checksumOk(id: string): boolean {
  const v = LETTER_VALUE[id[0]!]!;
  let sum = Math.floor(v / 10) + (v % 10) * 9;
  for (let i = 1; i <= 8; i++) sum += Number(id[i]) * (9 - i);
  sum += Number(id[9]);
  return sum % 10 === 0;
}

export function validateNationalId(input: string): NationalIdResult {
  const normalized = normalizeNationalId(input);
  if (normalized === '') return { ok: false, normalized, failure: 'empty' };
  if (normalized.length !== 10) return { ok: false, normalized, failure: 'length' };
  if (!/^[A-Z][1289]\d{8}$/.test(normalized)) return { ok: false, normalized, failure: 'format' };
  const second = normalized[1]!;
  const kind: NationalIdKind = second === '1' || second === '2' ? 'citizen' : 'resident';
  const gender = second === '1' || second === '8' ? '男' : '女';
  const base = { normalized, kind, gender, place: LETTER_PLACE[normalized[0]!] } as const;
  return checksumOk(normalized) ? { ok: true, ...base } : { ok: false, failure: 'checksum', ...base };
}

export interface GenerateOptions {
  letter?: string;
  gender?: '男' | '女';
}

/** 產生通過檢查的測試用號碼 */
export function generateNationalId(opts: GenerateOptions = {}, random: () => number = Math.random): string {
  const letters = Object.keys(LETTER_VALUE);
  const letter = opts.letter && LETTER_VALUE[opts.letter] ? opts.letter : letters[Math.floor(random() * letters.length)]!;
  const gender = opts.gender ?? (random() < 0.5 ? '男' : '女');
  const head = letter + (gender === '男' ? '1' : '2');
  const body = Array.from({ length: 7 }, () => Math.floor(random() * 10)).join('');
  for (let d = 0; d <= 9; d++) {
    const id = `${head}${body}${d}`;
    if (checksumOk(id)) return id;
  }
  throw new Error('unreachable');
}

export const NATIONAL_ID_FAILURE: Record<NationalIdFailure, string> = {
  empty: '請輸入身分證字號。',
  length: '必須剛好 10 碼：1 個英文字母加 9 個數字。',
  format: '格式不符：第 1 碼為英文字母，第 2 碼為 1、2（身分證）或 8、9（新式居留證），其餘為數字。',
  checksum: '檢查碼不符，這不是有效的號碼格式。',
};
