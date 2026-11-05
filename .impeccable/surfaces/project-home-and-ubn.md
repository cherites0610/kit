---
version: 1
slug: "project-home-and-ubn"
primary_target: "PROJECT-HOME-AND-UBN"
related_targets: []
---

# Surface: 首頁 + 統一編號工具頁 (Operate, mobile-first)

## 範圍與對象
- 模式:Operate。上班族、會計、行政,手機單手,進來完成一件事、複製、離開。
- 保真度:可上線的手機優先版;桌面維持窄欄置中。
- 不做:登入、歷史紀錄、廣告、深色模式、多語系;不把輸入內容送進統計。

## 首頁(列表 + 搜尋)
- 頂欄站名、一行說明、搜尋框;下為單欄工具清單,每列有名稱、一句說明、狀態標籤(新/即將推出)。
- 僅統編可用;身分證、手機條碼、銀行代碼、郵遞區號、民國年、大寫金額、假日、假資料以「即將推出」列出(用戶確認放入)。
- 搜尋無結果:顯示「找不到工具」並引導回清單。頁尾放隱私說明。

## 統編頁(同頁兩個分頁:驗證 / 生成)
- 標題、一行說明、分頁、輸入區、結果。
- 驗證:單一真實 input,支援貼上並去除空格;全寬「驗證」鈕在輸入框正下方;結果為「驗證證明聯」:通過/不通過、原因、逐項檢查(位數、加權總和)、複製;證明聯內提醒「格式正確不代表公司真實存在」。
- 生成:數量(預設 1,上限 10)+「生成」鈕;結果為逐條可複製的統編 + 「全部複製」;標明「僅供測試」。
- 狀態:空白、輸入中(不提早報錯)、通過、不通過(位數不足/含非數字/檢查碼不符)、已複製回饋。
- 頁面有「資料只在你的瀏覽器處理」說明。

## 未決
無(2026-11-05 用戶已確認簡報)。實作前仍需:建立 Astro 專案、讀 craft-floor。

## Direction contract

THESIS: The result is a printed 電子發票證明聯 slip you can read and copy; refuses the generic coloured-card result panel.
OWN-WORLD: Thermal-paper white on a light grey ground, near-black ink (#202020), one receipt red (#D4202A) used only for 不通過 and emphasis, grey #8A8A8A for labels. Monospace tabular numerals for all codes; Noto Sans TC for prose. Dashed tear rules, zig-zag slip edge, flat (no gradients, no glow). Recognisable with content removed by the dashed rules and slip edge.
STORY: Visitor understands in one glance what the tool does, types or pastes 8 digits, sees a pass/fail slip with the reason, copies it, trusts that nothing leaves the browser.
FIRST VIEWPORT: 390x844. Black top bar with 'Cherites Kit' wordmark. H1 統一編號驗證 and one-line subtitle. Bordered mono input (large digits) with 驗證 button directly beneath, full width. Below it the result slip: title 驗證證明聯, big code, rows (檢查規則, 位數, 加權總和), verdict line. One-line privacy note under the slip. Primary action sits under the input, thumb reach.
FORM: 統一發票 thermal receipt, candidate 1 of 7 on my list (pick card), seed: 83c1a219cfcb16a6.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
