/** 阿拉伯數字金額轉中文大寫（支票、收據用）。純函式。 */

const DIGIT = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'] as const;
const SMALL = ['仟', '佰', '拾', ''] as const;
const BIG = ['', '萬', '億', '兆'] as const;

export type AmountFailure = 'empty' | 'format' | 'decimals' | 'too-big';

export interface AmountResult {
  ok: boolean;
  failure?: AmountFailure;
  /** 例：壹萬貳仟參佰肆拾伍元整 */
  text?: string;
  /** 例：新臺幣壹萬貳仟參佰肆拾伍元整 */
  withCurrency?: string;
}

function integerToZh(int: string): string {
  const padded = int.padStart(Math.ceil(int.length / 4) * 4, '0');
  const groups: string[] = [];
  for (let i = 0; i < padded.length; i += 4) groups.push(padded.slice(i, i + 4));

  let out = '';
  let skippedZeroGroup = false;
  groups.forEach((g, gi) => {
    const bigUnit = BIG[groups.length - 1 - gi]!;
    if (g === '0000') {
      if (out !== '') skippedZeroGroup = true;
      return;
    }
    let part = '';
    let pendingZero = false;
    [...g].forEach((ch, i) => {
      const d = Number(ch);
      if (d === 0) {
        if (part !== '') pendingZero = true;
        return;
      }
      if (pendingZero) part += DIGIT[0];
      pendingZero = false;
      part += DIGIT[d]! + SMALL[i]!;
    });
    // 與前面已輸出的較高位之間補「零」：前面有被略過的零組，或本組千位為 0
    if (out !== '' && (skippedZeroGroup || g[0] === '0')) out += DIGIT[0];
    skippedZeroGroup = false;
    out += part + bigUnit;
  });
  return out;
}

export function amountToZh(input: string): AmountResult {
  const s = input
    .replace(/[\s　,，]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/^NT\$?|^\$/i, '');
  if (s === '') return { ok: false, failure: 'empty' };
  if (!/^\d+(\.\d*)?$/.test(s)) return { ok: false, failure: 'format' };
  const [intRaw, decRaw = ''] = s.split('.');
  if (decRaw.length > 2) return { ok: false, failure: 'decimals' };
  const int = intRaw!.replace(/^0+(?=\d)/, '');
  if (int.length > 16) return { ok: false, failure: 'too-big' };

  const jiao = Number(decRaw[0] ?? 0);
  const fen = Number(decRaw[1] ?? 0);
  const hasDecimal = jiao > 0 || fen > 0;
  let text: string;
  if (int === '0' && hasDecimal) {
    text = ''; // 不足 1 元：只寫角分
  } else {
    text = (int === '0' ? DIGIT[0] : integerToZh(int)) + '元';
  }
  if (!hasDecimal) {
    text += '整';
  } else {
    if (jiao > 0) text += DIGIT[jiao] + '角';
    else if (int !== '0') text += DIGIT[0];
    if (fen > 0) text += DIGIT[fen] + '分';
    else text += '整';
  }
  return { ok: true, text, withCurrency: `新臺幣${text}` };
}

export const AMOUNT_FAILURE: Record<AmountFailure, string> = {
  empty: '請輸入金額。',
  format: '只能輸入數字，可以有千分位逗號與小數點。',
  decimals: '小數最多到第 2 位（角、分）。',
  'too-big': '金額太大，最多支援 16 位整數（兆）。',
};
