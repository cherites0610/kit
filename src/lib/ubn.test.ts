import { describe, expect, it } from 'vitest';
import { generateUbn, generateUbns, normalizeUbn, validateUbn } from './ubn';

describe('validateUbn', () => {
  it.each(['22555003', '22099131'])('%s 通過', (n) => {
    expect(validateUbn(n).ok).toBe(true);
  });
  it('第 7 碼為 7 的特例', () => {
    // 10458574:加權總和 29,29 不能被 5 整除,但第 7 碼為 7 且 29+1 可以
    expect(validateUbn('10458574').ok).toBe(true);
    expect(validateUbn('10458573').ok).toBe(false);
  });
  it('檢查碼錯誤', () => {
    const r = validateUbn('22555004');
    expect(r.ok).toBe(false);
    expect(r.failure).toBe('checksum');
  });
  it('位數與字元', () => {
    expect(validateUbn('').failure).toBe('empty');
    expect(validateUbn('2255500').failure).toBe('length');
    expect(validateUbn('2255500a').failure).toBe('non-digit');
  });
  it('全形與空白會被整理', () => {
    expect(normalizeUbn(' ２２５５ 5003 ')).toBe('22555003');
    expect(validateUbn('２２５５５００３').ok).toBe(true);
  });
});

describe('generate', () => {
  it('產生的統編都通過', () => {
    for (let i = 0; i < 200; i++) expect(validateUbn(generateUbn()).ok).toBe(true);
  });
  it('數量限制在 1 到 10 且不重複', () => {
    expect(generateUbns(0)).toHaveLength(1);
    expect(generateUbns(99)).toHaveLength(10);
    expect(new Set(generateUbns(10)).size).toBe(10);
  });
});
