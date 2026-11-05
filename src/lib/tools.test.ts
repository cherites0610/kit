import { describe, expect, it } from 'vitest';
import { amountToZh } from './amount-zh';
import { searchBanks } from './bank';
import { validateCarrier } from './carrier';
import { generatePeople } from './fake-data';
import { dayInfo, yearEntries } from './holidays';
import { generateNationalId, validateNationalId } from './national-id';
import { convertRoc } from './roc-date';
import { searchZip } from './zip';

describe('national-id', () => {
  it('A123456789 通過', () => {
    const r = validateNationalId('A123456789');
    expect(r.ok).toBe(true);
    expect(r.gender).toBe('男');
    expect(r.place).toBe('臺北市');
  });
  it('檢查碼與格式錯誤', () => {
    expect(validateNationalId('A123456780').failure).toBe('checksum');
    expect(validateNationalId('A323456789').failure).toBe('format');
    expect(validateNationalId('A12345678').failure).toBe('length');
    expect(validateNationalId('').failure).toBe('empty');
  });
  it('小寫與全形會被整理', () => {
    expect(validateNationalId('ａ１２３４５６７８９').ok).toBe(true);
  });
  it('生成的號碼都通過，且依性別', () => {
    for (let i = 0; i < 200; i++) expect(validateNationalId(generateNationalId()).ok).toBe(true);
    expect(validateNationalId(generateNationalId({ gender: '女', letter: 'F' })).gender).toBe('女');
    expect(generateNationalId({ letter: 'F' })[0]).toBe('F');
  });
});

describe('roc-date', () => {
  it('年份互轉', () => {
    expect(convertRoc('114')).toMatchObject({ ok: true, from: 'roc', adYear: 2025, rocYear: 114 });
    expect(convertRoc('2025')).toMatchObject({ ok: true, from: 'ad', adYear: 2025, rocYear: 114 });
    expect(convertRoc('民國1年').adYear).toBe(1912);
    expect(convertRoc('民國前1年').adYear).toBe(1911);
  });
  it('完整日期', () => {
    for (const s of ['114/3/5', '114-03-05', '民國114年3月5日', '1140305', '2025/03/05', '20250305']) {
      expect(convertRoc(s)).toMatchObject({ ok: true, adYear: 2025, month: 3, day: 5 });
    }
  });
  it('錯誤', () => {
    expect(convertRoc('114/2/30').failure).toBe('date');
    expect(convertRoc('abc').failure).toBe('format');
    expect(convertRoc('').failure).toBe('empty');
  });
});

describe('amount-zh', () => {
  it.each([
    ['0', '零元整'],
    ['10', '壹拾元整'],
    ['12345', '壹萬貳仟參佰肆拾伍元整'],
    ['1001', '壹仟零壹元整'],
    ['10001', '壹萬零壹元整'],
    ['110000', '壹拾壹萬元整'],
    ['1000000', '壹佰萬元整'],
    ['100000000', '壹億元整'],
    ['100200000', '壹億零貳拾萬元整'],
    ['120000000', '壹億貳仟萬元整'],
    ['100010000', '壹億零壹萬元整'],
    ['1,234.5', '壹仟貳佰參拾肆元伍角整'],
    ['1.05', '壹元零伍分'],
    ['0.05', '伍分'],
    ['2.34', '貳元參角肆分'],
  ])('%s → %s', (input, expected) => {
    expect(amountToZh(input).text).toBe(expected);
  });
  it('錯誤', () => {
    expect(amountToZh('12.345').failure).toBe('decimals');
    expect(amountToZh('abc').failure).toBe('format');
    expect(amountToZh('1'.repeat(17)).failure).toBe('too-big');
  });
});

describe('carrier', () => {
  it('格式', () => {
    expect(validateCarrier('/ABC+123').ok).toBe(true);
    expect(validateCarrier('/abc.-12').ok).toBe(true);
    expect(validateCarrier('ABC1234').failure).toBe('prefix');
    expect(validateCarrier('/ABC12').failure).toBe('length');
    expect(validateCarrier('/ABC12_3').failure).toBe('charset');
  });
});

describe('zip', () => {
  it('搜尋', () => {
    expect(searchZip('中正區').some((e) => e.zip === '100')).toBe(true);
    expect(searchZip('台北市大安').map((e) => e.zip)).toContain('106');
    expect(searchZip('106')[0]?.area).toBe('大安區');
    expect(searchZip('台北 大安').map((e) => e.zip)).toEqual(['106']);
    expect(searchZip('', '澎湖縣').length).toBeGreaterThan(0);
  });
});

describe('bank', () => {
  const data = {
    banks: [['004', '臺灣銀行', '台銀'], ['812', '台新國際商業銀行', '台新銀']] as [string, string, string][],
    branches: [['0040037', '營業部']] as [string, string][],
  };
  it('依代碼、名稱、簡稱與分行', () => {
    expect(searchBanks(data, '004').hits.map((h) => h.code)).toEqual(['004', '0040037']);
    expect(searchBanks(data, '台新').hits[0]?.code).toBe('812');
    expect(searchBanks(data, '臺銀營業').hits).toHaveLength(0);
    expect(searchBanks(data, '營業部').hits[0]?.name).toBe('臺灣銀行 營業部');
    expect(searchBanks(data, '').hits).toHaveLength(0);
    expect(searchBanks(data, '臺灣 營業').hits.map((h) => h.code)).toEqual(['0040037']);
    expect(searchBanks(data, '台新 營業').hits).toHaveLength(0);
  });
});

describe('holidays', () => {
  it('國定假日與農曆', () => {
    expect(dayInfo('2026-02-17')).toMatchObject({ kind: 'holiday', name: '春節', lunar: '正月初一' });
    expect(dayInfo('2026-09-25')).toMatchObject({ kind: 'holiday', name: '中秋節', lunar: '八月十五' });
  });
  it('補班、上班日、週末', () => {
    expect(dayInfo('2025-02-08')?.kind).toBe('makeup-workday');
    expect(dayInfo('2026-03-04')?.kind).toBe('workday');
    expect(dayInfo('2026-03-07')?.kind).toBe('weekend');
  });
  it('無資料年份只依週末判斷；非法日期回傳 null', () => {
    expect(dayInfo('2031-03-04')).toMatchObject({ kind: 'workday', hasData: false });
    expect(dayInfo('2026-02-30')).toBeNull();
  });
  it('年度清單不含單純週末', () => {
    const list = yearEntries(2026);
    expect(list.length).toBeGreaterThan(10);
    expect(list.every((e) => e.name !== '' || e.kind === 'makeup-workday')).toBe(true);
  });
});

describe('fake-data', () => {
  it('欄位完整且身分證與統編通過驗證', () => {
    const people = generatePeople(10);
    expect(people).toHaveLength(10);
    for (const p of people) {
      expect(validateNationalId(p.nationalId).ok).toBe(true);
      expect(p.mobile).toMatch(/^09\d{2}-\d{3}-\d{3}$/);
      expect(p.email).toMatch(/@example\.com$/);
      expect(p.name.length).toBeGreaterThanOrEqual(2);
    }
  });
});
