/** 銀行（3 碼）與分行（7 碼）代碼查詢。資料見 public/data/banks.json，使用時才載入。 */

export interface BankData {
  /** [代碼, 全名, 簡稱] */
  banks: [string, string, string][];
  /** [7 碼代碼, 分行名稱] */
  branches: [string, string][];
}

export interface BankHit {
  kind: 'bank' | 'branch';
  code: string;
  /** 銀行全名；分行時為「銀行全名 分行名」 */
  name: string;
}

function norm(s: string): string {
  return s
    .replace(/[\s　]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/台/g, '臺')
    .toLowerCase();
}

/** 以空白分詞，每個詞都要符合；詞可以是代碼開頭或名稱的一部分 */
function tokens(query: string): string[] {
  return query.split(/[\s　]+/).map(norm).filter(Boolean);
}

export function searchBanks(data: BankData, query: string, limit = 40): { hits: BankHit[]; total: number } {
  const qs = tokens(query);
  if (qs.length === 0) return { hits: [], total: 0 };
  const bankName = new Map(data.banks.map(([code, name]) => [code, name]));
  const hits: BankHit[] = [];

  for (const [code, name, short] of data.banks) {
    const hay = norm(name + short);
    if (qs.every((q) => code.startsWith(q) || hay.includes(q))) hits.push({ kind: 'bank', code, name });
  }
  for (const [code, branch] of data.branches) {
    const bank = bankName.get(code.slice(0, 3)) ?? '';
    const hay = norm(`${bank}${branch}`);
    if (qs.every((q) => code.startsWith(q) || hay.includes(q))) hits.push({ kind: 'branch', code, name: `${bank} ${branch}` });
  }
  return { hits: hits.slice(0, limit), total: hits.length };
}
