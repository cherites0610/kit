/**
 * 手機條碼（共通性載具）格式檢查。純函式。
 * 格式：「/」開頭，後接 7 碼，字元為大寫英文、數字與 + - .。
 * 這只檢查格式；是否真的已申請，只有財政部電子發票整合服務平台能確認。
 */

export type CarrierFailure = 'empty' | 'length' | 'prefix' | 'charset';

export interface CarrierResult {
  ok: boolean;
  normalized: string;
  failure?: CarrierFailure;
}

export function normalizeCarrier(input: string): string {
  return input
    .replace(/[\s　]/g, '')
    .replace(/[／]/g, '/')
    .replace(/[０-９Ａ-Ｚａ-ｚ＋－．]/g, (c) =>
      c === '＋' ? '+' : c === '－' ? '-' : c === '．' ? '.' : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .toUpperCase();
}

export function validateCarrier(input: string): CarrierResult {
  const normalized = normalizeCarrier(input);
  if (normalized === '') return { ok: false, normalized, failure: 'empty' };
  if (!normalized.startsWith('/')) return { ok: false, normalized, failure: 'prefix' };
  if (normalized.length !== 8) return { ok: false, normalized, failure: 'length' };
  if (!/^\/[0-9A-Z.+-]{7}$/.test(normalized)) return { ok: false, normalized, failure: 'charset' };
  return { ok: true, normalized };
}

export const CARRIER_FAILURE: Record<CarrierFailure, string> = {
  empty: '請輸入手機條碼。',
  prefix: '手機條碼必須以斜線「/」開頭。',
  length: '手機條碼必須是「/」加 7 碼，共 8 個字元。',
  charset: '只能使用大寫英文字母、數字與 + - . 這三個符號。',
};
