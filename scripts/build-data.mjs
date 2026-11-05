// 由公開資料集產生網站內建資料。用法：node scripts/build-data.mjs <資料夾>
// 資料夾需含 cal2025.json cal2026.json cal2027.json（ruyut/TaiwanCalendar）、
// zip.json（donma/TaiwanAddressCityAreaRoadChineseEnglishJSON）、
// bank3.json bank7.json（Jakevin/TaiwanBank7DigitCode，Apache-2.0）
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) throw new Error('請指定資料夾');
const read = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));

// 行事曆：只存「與週末預設不同」或有名稱的日子
const calendar = {};
for (const y of [2025, 2026, 2027]) {
  const days = [];
  for (const d of read(`cal${y}.json`)) {
    const dt = new Date(`${d.date.slice(0, 4)}-${d.date.slice(4, 6)}-${d.date.slice(6, 8)}T12:00:00Z`);
    const weekend = dt.getUTCDay() === 0 || dt.getUTCDay() === 6;
    if (d.isHoliday !== weekend || d.description) days.push([d.date, d.isHoliday ? 1 : 0, d.description]);
  }
  calendar[y] = days;
}
writeFileSync('src/data/calendar.json', JSON.stringify(calendar));

// 郵遞區號（3 碼）
const zip = read('zip.json').map((c) => [c.CityName, c.AreaList.map((a) => [a.ZipCode, a.AreaName])]);
writeFileSync('src/data/zip.json', JSON.stringify(zip));

// 銀行與分行：瀏覽器在需要時才下載，不內嵌進頁面
const banks = read('bank3.json').map((b) => [b.Value, b.Key, b.Short]);
const branches = read('bank7.json').map((b) => [b.Value, b.Key]);
writeFileSync('public/data/banks.json', JSON.stringify({ banks, branches }));
console.log({ calendar: Object.fromEntries(Object.entries(calendar).map(([k, v]) => [k, v.length])), zip: zip.length, banks: banks.length, branches: branches.length });
