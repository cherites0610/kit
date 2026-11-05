# Cherites Kit 專案定案

> 本文件記錄專案目標與技術決策，後續開發以此為準。有變動請直接修改並註明日期。

## 網站名稱

**Cherites Kit**（網域 `kit.cherites.org`）。名稱集中放在單一設定檔，方便日後修改。
為了 SEO，頁面標題與描述仍會帶「台灣」「工具」等中文關鍵字，例如「統一編號驗證｜Cherites Kit」。

## 專案目標

給一般民眾使用的台灣在地線上工具箱，收集各種「台灣才會用到」的小工具。

- 每個工具單一功能、一頁一工具、開了就能用
- **所有資料只在瀏覽器端處理，不送出任何資料**（驗證證號等敏感輸入尤其如此）
- SEO 要好：每個工具頁有獨立的 title、description，並產生 sitemap

## 主要使用者

一般民眾（非工程師）。介面以簡單、直覺、好懂為優先。

## 技術選型

| 項目 | 決定 |
| --- | --- |
| 形式 | 網頁（純靜態，無後端） |
| 框架 | Astro（預設輸出靜態 HTML，SEO 佳，互動處才載入 JS） |
| 語言 | TypeScript |
| 套件管理 | pnpm |
| 部署 | Cloudflare Pages（靜態輸出，不需 adapter） |
| 流量統計 | Umami（不使用 Google Analytics） |

### 程式結構原則

- 工具邏輯（如統編驗證）寫成**純函式**，與 UI 分離，方便單元測試與重用
- 工具頁之間互相獨立，新增工具不應影響既有工具

### 流量統計（Umami）

- 以 script tag 嵌入（Website ID 本來就會出現在前端，不是機密）：

  ```html
  <script defer src="https://cloud.umami.is/script.js" data-website-id="527e141f-cda8-422c-863b-ae64d3453d66"></script>
  ```

- 腳本網址與網站 ID 透過環境變數設定，不寫死在程式碼中，並在 Cloudflare Pages 設定同名變數：
  - `PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js`
  - `PUBLIC_UMAMI_WEBSITE_ID=527e141f-cda8-422c-863b-ae64d3453d66`
- 未設定變數時（例如本機開發）不注入腳本，避免污染正式數據
- 只統計頁面流量，不得把使用者輸入的內容送進任何統計事件
- 採用 **Umami Cloud**（官方代管，免自架、有免費額度，註冊後新增網站即可取得網站 ID）
- 若日後流量超過免費額度，再評估自架

## 候選工具清單

第一階段先做 ★，其餘依序排入。

- ★ 統一編號：驗證、生成
- 身分證字號：驗證、生成（測試用）
- 手機條碼 / 統一發票載具驗證
- 銀行代碼、郵遞區號查詢
- 民國年 ↔ 西元年轉換
- 中文大寫數字 / 金額轉換（例如 壹萬貳仟）
- 農曆、國定假日、補班日查詢
- 測試用假資料（姓名、地址、電話）

## 第一階段範圍

1. 建立 Astro + TypeScript + pnpm 專案骨架：首頁（工具列表）、共用版型、SEO meta、sitemap
2. 第一個工具：統一編號驗證與生成
3. 接上 Umami
4. 設定 Cloudflare Pages 部署

## 網域與 SEO

- 網域：`kit.cherites.org`
- 接上 Google Search Console（GSC），建議用 DNS TXT 驗證（Cloudflare 管理 DNS 時最省事），並提交 `sitemap-index.xml`
- 每頁設定 canonical URL，`robots.txt` 指向 sitemap

## 介面語言

全站僅繁體中文（`lang="zh-Hant-TW"`），不做多語系。

## 待確認事項

- [ ] 無（Umami 已建立，網站名稱已定）
- [ ] 部署後：Cloudflare Pages 綁定網域、設定環境變數、GSC 驗證並提交 sitemap
