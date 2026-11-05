# 內建資料來源

網站內建的資料由 `scripts/build-data.mjs` 從下列公開資料集整理而成（2026-11-05 下載）。
更新時重新下載來源檔，再執行 `node scripts/build-data.mjs <資料夾>`。

| 資料 | 輸出 | 來源 | 授權 |
| --- | --- | --- | --- |
| 行事曆（2025–2027）| `src/data/calendar.json` | [ruyut/TaiwanCalendar](https://github.com/ruyut/TaiwanCalendar)，整理自行政院人事行政總處辦公日曆表 | 該 repo 未宣告授權；原始資料為政府公開資料 |
| 3 碼郵遞區號 | `src/data/zip.json` | [donma/TaiwanAddressCityAreaRoadChineseEnglishJSON](https://github.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON)，整理自中華郵政 | 該 repo 未宣告授權；原始資料為政府公開資料 |
| 銀行 3 碼、分行 7 碼代碼 | `public/data/banks.json` | [Jakevin/TaiwanBank7DigitCode](https://github.com/Jakevin/TaiwanBank7DigitCode)（資料更新至 2023-10） | Apache-2.0 |

## 已知限制

- 行事曆：2026、2027 年資料集中沒有「補行上班」日，未對照官方公告核實；實際放假與補班以人事行政總處公告為準。每年底官方公布次年行事曆後，需重新整理資料並補上新年份（`YEARS` 由資料自動決定，同時需在 `scripts/build-data.mjs` 加入年份）。
- 銀行與分行：資料停在 2023-10，之後的分行新設、裁撤、更名不會反映。
- 郵遞區號：只有 3 碼，不含 5 碼、6 碼。
- 農曆由瀏覽器內建的 `Intl`（chinese calendar）計算，不內建資料表。
