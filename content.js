(() => {
  'use strict';

  // >>> HIER nichts ändern: deine bestehende GIAP-PWA
  const GIAP_BASE = 'https://alexbasila.github.io/GIAP-global-idea-addressing-protocol/';

  // ————————————————————————————————————————————————————————————————
  // Hilfen
  const log = (...a) => console.log('[GIAP-EXT]', ...a);

  function pickText() {
    // 1) Auswahl
    const sel = (getSelection()?.toString() || '').trim();
    if (sel) return sel;

    // 2) Textarea (normales Chatfeld)
    const ta = document.querySelector('textarea');
    if (ta && ta.value && ta.value.trim()) return ta.value.trim();

    // 3) Rich-Editor (contenteditable)
    const ce = document.querySelector('[contenteditable="true"][role="textbox"], div[contenteditable="true"]');
    const t = (ce?.innerText || ce?.textContent || '').trim();
    if (t) return t;

    return '';
  }

  function go() {
    let idea = pickText();
    if (!idea) {
      idea = prompt('Keine Auswahl/kein Texteingabefeld gefunden. Idee manuell eingeben:') || '';
    }
    idea = (idea || '').trim();
    if (!idea) return;

    const url = `${GIAP_BASE}?idea=${encodeURIComponent(idea)}&auto=1`;
    // Neuer Tab (bewusst), damit ChatGPT offen bleibt
    window.open(url, '_blank', 'noopener');
  }

  function ensureButton() {
    if (document.getElementById('giap-churchen-btn')) return;

    // Manche iframes / skeleton states: nicht zu früh einfügen
    if (!document.body) return;

    const b = document.createElement('button');
    b.id = 'giap-churchen-btn';
    b.type = 'button';
    b.textContent = 'Churchen ●';
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(); }, { passive: false });

    document.body.appendChild(b);
    log('Button injected');
  }

  // beim Laden + bei DOM-Änderungen + auf Resize sichern
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureButton);
  } else {
    ensureButton();
  }
  new MutationObserver(ensureButton).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('resize', ensureButton, { passive: true });
  setInterval(ensureButton, 1500);
})();
