/** 工具頁共用的瀏覽器端小工具。 */

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** 證明聯上的一列「名稱 ……… 值」 */
export function row(dt: string, dd: string): HTMLDivElement {
  const r = el('div', 'slip__row');
  r.append(el('dt', undefined, dt), el('dd', undefined, dd));
  return r;
}

let toastTimer: number | undefined;

export async function copy(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = el('textarea');
    ta.value = text;
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const toast = $('toast');
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toast.hidden = true), 1600);
}

export function copyButton(label: string, getText: () => string, ariaLabel?: string): HTMLButtonElement {
  const b = el('button', 'btn btn--ghost', label);
  b.type = 'button';
  if (ariaLabel) b.setAttribute('aria-label', ariaLabel);
  b.addEventListener('click', () => copy(getText()));
  return b;
}

/** 建立一張「證明聯」外框，內容由呼叫端附加 */
export function slip(title: string, fail = false): HTMLDivElement {
  const s = el('div', fail ? 'slip slip--fail' : 'slip');
  s.append(el('p', 'slip__title', title), el('hr'));
  return s;
}

/** 一組 tab / tabpanel（id 需為 tab-<name> 與 panel-<name>） */
export function initTabs(names: string[]): void {
  const tabs = names.map((n) => $(`tab-${n}`));
  const panels = names.map((n) => $(`panel-${n}`));
  const select = (i: number) =>
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(i === j));
      t.tabIndex = i === j ? 0 : -1;
      panels[j]!.hidden = i !== j;
    });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        select(n);
        tabs[n]!.focus();
      }
    });
  });
}
