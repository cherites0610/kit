export const SITE = {
  name: 'Cherites Kit',
  url: 'https://kit.cherites.org',
  tagline: '台灣在地線上小工具，資料只在你的瀏覽器處理',
  lang: 'zh-Hant-TW',
} as const;

export interface ToolEntry {
  slug: string;
  name: string;
  summary: string;
  keywords: string;
  status: 'live' | 'soon';
  /** 頁面 <title>（會自動加上「｜站名」） */
  seoTitle: string;
  seoDescription: string;
  isNew?: boolean;
}

export const TOOLS: ToolEntry[] = [
  {
    slug: 'ubn', name: '統一編號', summary: '驗證、生成 8 碼統一編號', status: 'live',
    keywords: '統編 統一編號 驗證 生成 公司 營業登記',
    seoTitle: '統一編號驗證與生成',
    seoDescription: '台灣統一編號（統編）驗證與生成工具：輸入 8 碼立即檢查是否符合規則並說明原因，也能產生測試用統編。資料只在瀏覽器處理。',
  },
  {
    slug: 'national-id', name: '身分證字號', summary: '驗證、生成（測試用）', status: 'live',
    keywords: '身分證 身份證 字號 驗證 居留證 生成',
    seoTitle: '身分證字號驗證與生成',
    seoDescription: '台灣身分證字號與新式居留證號驗證工具：檢查英文字母、性別碼與檢查碼，說明不通過的原因，並可產生測試用號碼。資料只在瀏覽器處理，不會送出。',
  },
  {
    slug: 'carrier', name: '手機條碼', summary: '統一發票載具格式檢查', status: 'live',
    keywords: '手機條碼 載具 發票 共通性載具 格式',
    seoTitle: '手機條碼（載具）格式檢查',
    seoDescription: '檢查統一發票手機條碼載具格式是否正確：斜線開頭加 7 碼，並說明不符的原因。僅檢查格式，不代表已申請。資料只在瀏覽器處理，不會送出。',
  },
  {
    slug: 'bank-code', name: '銀行代碼', summary: '銀行與分行代碼查詢', status: 'live',
    keywords: '銀行 代碼 分行 銀行代號 匯款 郵局 信用合作社',
    seoTitle: '銀行代碼與分行代碼查詢',
    seoDescription: '查詢台灣銀行 3 碼代碼與分行 7 碼代碼，輸入銀行名稱、分行名稱或代碼即可。可一鍵複製，匯款轉帳時使用。',
  },
  {
    slug: 'zip', name: '郵遞區號', summary: '縣市鄉鎮 3 碼郵遞區號查詢', status: 'live',
    keywords: '郵遞區號 郵區 地址 縣市 鄉鎮 三碼',
    seoTitle: '郵遞區號查詢（3 碼）',
    seoDescription: '輸入縣市、鄉鎮市區名稱或郵遞區號，快速查詢台灣 3 碼郵遞區號，支援「台」與「臺」通用，可一鍵複製。資料只在瀏覽器處理，不會送出。',
  },
  {
    slug: 'roc-year', name: '民國年轉換', summary: '民國年與西元年互轉', status: 'live',
    keywords: '民國 西元 年 轉換 日期 民國年',
    seoTitle: '民國年與西元年轉換',
    seoDescription: '台灣民國年與西元年互相轉換，支援年份與完整日期，自動判斷輸入是民國或西元，也支援民國前。換算公式：西元 = 民國 + 1911。',
  },
  {
    slug: 'amount-zh', name: '中文大寫金額', summary: '數字轉壹萬貳仟', status: 'live',
    keywords: '大寫 金額 壹貳參 支票 中文 數字',
    seoTitle: '中文大寫金額轉換',
    seoDescription: '阿拉伯數字金額轉中文大寫（壹貳參肆），可用於支票、收據與合約，支援角、分，一鍵複製。資料只在瀏覽器處理。',
  },
  {
    slug: 'holidays', name: '國定假日', summary: '假日、補班日與農曆查詢', status: 'live',
    keywords: '假日 農曆 補班 行事曆 國定假日 放假 連假',
    seoTitle: '國定假日、補班日與農曆查詢',
    seoDescription: '查詢台灣國定假日、補假、補行上班日與農曆日期，內建 2025 至 2027 年資料。實際放假以人事行政總處公告為準。',
  },
  {
    slug: 'fake-data', name: '測試假資料', summary: '姓名、地址、電話等', status: 'live',
    keywords: '假資料 測試 姓名 地址 電話 身分證 統編 mock',
    seoTitle: '台灣測試用假資料產生器',
    seoDescription: '產生台灣格式的測試用假資料：姓名、身分證字號、手機、市話、地址與統一編號。全部隨機產生，不對應真人。',
  },
];
