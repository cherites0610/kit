/** 測試用假資料。全部隨機拼湊，不對應任何真人。純函式，可注入 random。 */
import zip from '../data/zip.json';
import { generateNationalId } from './national-id';
import { generateUbn } from './ubn';

type Rand = () => number;

const SURNAMES = '陳林黃張李王吳劉蔡楊許鄭謝郭洪曾邱廖賴徐周葉蘇莊呂江何蕭羅高潘簡朱鍾游彭詹胡施沈余趙盧梁顏柯孫魏翁戴范宋方鄧杜傅侯曹薛丁卓馬阮董唐温'.split('');
const GIVEN_A = '志家俊建國怡雅佩淑美惠嘉宗宇冠彥柏承品欣思君婉靜詩育心文明正偉雅慧';
const GIVEN_B = '豪明宏偉君婷涵翰軒瑋庭安晴恩霖菁瑜倫翔廷勳萱妤潔玲華平豪成賢傑芳';
const ROADS = ['中山路', '中正路', '民生路', '民權路', '民族路', '忠孝路', '仁愛路', '信義路', '和平路', '復興路', '光復路', '文化路', '建國路', '成功路', '大同路', '自由路'];
const MOBILE_PREFIX = ['0910', '0912', '0919', '0921', '0928', '0932', '0933', '0937', '0952', '0955', '0958', '0963', '0972', '0975', '0988'];
const AREA_CODES = ['02', '03', '04', '06', '07'];

const pick = <T>(arr: readonly T[], r: Rand): T => arr[Math.floor(r() * arr.length)]!;
const digits = (n: number, r: Rand) => Array.from({ length: n }, () => Math.floor(r() * 10)).join('');

export interface FakePerson {
  name: string;
  gender: '男' | '女';
  nationalId: string;
  mobile: string;
  phone: string;
  email: string;
  address: string;
  ubn: string;
}

export function generatePerson(r: Rand = Math.random): FakePerson {
  const gender = r() < 0.5 ? '男' : '女';
  const given = pick([...GIVEN_A], r) + (r() < 0.8 ? pick([...GIVEN_B], r) : '');
  const [city, areas] = pick(zip as [string, [string, string][]][], r);
  const [zipCode, area] = pick(areas, r);
  const m = digits(6, r);
  const mobile = `${pick(MOBILE_PREFIX, r)}-${m.slice(0, 3)}-${m.slice(3)}`;
  const p = digits(8, r);
  const ascii = Array.from({ length: 8 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(r() * 26)]).join('');
  return {
    name: pick(SURNAMES, r) + given,
    gender,
    nationalId: generateNationalId({ gender }, r),
    mobile,
    phone: `(${pick(AREA_CODES, r)})${p.slice(0, 4)}-${p.slice(4)}`,
    email: `${ascii}@example.com`,
    address: `${zipCode}${city}${area}${pick(ROADS, r)}${Math.floor(r() * 300) + 1}號${Math.floor(r() * 15) + 1}樓`,
    ubn: generateUbn(r),
  };
}

export function generatePeople(count: number, r: Rand = Math.random): FakePerson[] {
  const n = Math.min(Math.max(Math.floor(count) || 1, 1), 10);
  return Array.from({ length: n }, () => generatePerson(r));
}

export const FAKE_FIELDS: { key: keyof FakePerson; label: string }[] = [
  { key: 'name', label: '姓名' },
  { key: 'gender', label: '性別' },
  { key: 'nationalId', label: '身分證字號' },
  { key: 'mobile', label: '手機' },
  { key: 'phone', label: '市話' },
  { key: 'email', label: '電子郵件' },
  { key: 'address', label: '地址' },
  { key: 'ubn', label: '統一編號' },
];
