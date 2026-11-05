/** 3 碼郵遞區號查詢。純函式，資料見 src/data/zip.json。 */
import data from '../data/zip.json';

export interface ZipEntry {
  zip: string;
  city: string;
  area: string;
}

const ALL: ZipEntry[] = (data as [string, [string, string][]][]).flatMap(([city, areas]) =>
  areas.map(([zip, area]) => ({ zip, city, area })),
);

export const CITIES: string[] = (data as [string, unknown][]).map(([c]) => c);

/** 臺／台、全形數字視為相同 */
function norm(s: string): string {
  return s
    .replace(/[\s　]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/台/g, '臺');
}

/** 以空白分詞，每個詞都要符合郵遞區號開頭或「縣市＋區名」的一部分 */
export function searchZip(query: string, city = ''): ZipEntry[] {
  const qs = query.split(/[\s　]+/).map(norm).filter(Boolean);
  return ALL.filter((e) => {
    if (city && e.city !== city) return false;
    const hay = norm(e.city + e.area);
    return qs.every((q) => e.zip.startsWith(q) || hay.includes(q));
  });
}

export function zipCount(): number {
  return ALL.length;
}
