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
}

export const TOOLS: ToolEntry[] = [
  { slug: 'ubn', name: '統一編號', summary: '驗證、生成 8 碼統一編號', keywords: '統編 統一編號 驗證 生成 公司 營業登記', status: 'live' },
  { slug: 'national-id', name: '身分證字號', summary: '驗證、生成（測試用）', keywords: '身分證 身份證 字號 驗證', status: 'soon' },
  { slug: 'carrier', name: '手機條碼', summary: '統一發票載具驗證', keywords: '手機條碼 載具 發票', status: 'soon' },
  { slug: 'bank-code', name: '銀行代碼', summary: '銀行與分行代碼查詢', keywords: '銀行 代碼 分行', status: 'soon' },
  { slug: 'zip', name: '郵遞區號', summary: '縣市鄉鎮郵遞區號查詢', keywords: '郵遞區號 郵區 地址', status: 'soon' },
  { slug: 'roc-year', name: '民國年轉換', summary: '民國年與西元年互轉', keywords: '民國 西元 年 轉換', status: 'soon' },
  { slug: 'amount-zh', name: '中文大寫金額', summary: '數字轉壹萬貳仟', keywords: '大寫 金額 壹貳參 支票', status: 'soon' },
  { slug: 'holidays', name: '國定假日', summary: '農曆、假日與補班日查詢', keywords: '假日 農曆 補班 行事曆', status: 'soon' },
  { slug: 'fake-data', name: '測試假資料', summary: '姓名、地址、電話', keywords: '假資料 測試 姓名 地址 電話', status: 'soon' },
];
