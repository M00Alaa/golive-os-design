/* GoLive OS prototype interactions (desktop): tabs, table filters, modals & drawers, validation,
   row menus, add/edit/delete with undo, confirms, toasts, toggles, composers.
   Declarative: pages add data-* attributes; page.modals / page.menus / page.confirms define content.
   URL helpers for screenshots: ?tab=group:key,group2:key  &open=modalId  &toast=1 */
(function () {
  const qs = new URLSearchParams(location.search);
  const UI = {};                       // persisted tab state across re-renders (language/theme toggle)
  (qs.get('tab') || '').split(',').filter(Boolean).forEach(p => { const [g, k] = p.split(':'); UI[g] = k; });
  let page = null, menuRow = null, firstRun = true;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const L = (a, e) => GL.L(a, e);
  const icon = (n, c) => GL.icon(n, c);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- toasts ---------- */
  function toastHost() { let h = $('#gl-toasts'); if (!h) { h = document.createElement('div'); h.id = 'gl-toasts'; document.body.appendChild(h); } return h; }
  function toast(kind, title, msg, opts) {
    opts = opts || {};
    const ic = { success: 'check-circle', danger: 'alert-circle', warning: 'alert-triangle', info: 'info' }[kind] || 'info';
    const t = document.createElement('div');
    t.className = 'toast ' + kind + ' in';
    t.innerHTML = `<span class="ic">${icon(ic, 'sm')}</span><div class="grow"><div class="ttl">${title}</div>${msg ? `<div class="msg">${msg}</div>` : ''}</div>${opts.undo ? `<button class="btn btn-ghost btn-sm" data-undo>${L('تراجع', 'Undo')}</button>` : ''}<button class="icon-btn sm" data-dismiss>${icon('x', 'sm')}</button>`;
    if (opts.undo) t.querySelector('[data-undo]').onclick = () => { opts.undo(); t.remove(); toast('info', L('تم التراجع', 'Undone')); };
    t.querySelector('[data-dismiss]').onclick = () => t.remove();
    toastHost().appendChild(t);
    if (!opts.sticky) setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 250); }, opts.ms || 4500);
    return t;
  }

  /* ---------- tabs / segmented / list selection ---------- */
  function applyTabs(root) {
    $$('[data-tabs]', root).forEach(c => {
      const g = c.dataset.tabs, act = c.dataset.act || 'active';
      const tabs = $$('[data-tab]', c).filter(t => t.closest('[data-tabs]') === c);
      if (!tabs.length) return;
      let cur = UI[g];
      if (!cur || !tabs.some(t => t.dataset.tab === cur)) cur = (tabs.find(t => t.classList.contains(act)) || tabs[0]).dataset.tab;
      UI[g] = cur;
      tabs.forEach(t => { t.classList.toggle(act, t.dataset.tab === cur); t.setAttribute('aria-selected', t.dataset.tab === cur); });
      $$(`[data-pane-group="${g}"]`).forEach(p => { p.hidden = !(p.dataset.pane || '').split(' ').includes(cur); });
      if (c.dataset.filterTable) filterTable(c.dataset.filterTable);
    });
  }

  /* ---------- table filtering ---------- */
  function filterTable(id) {
    const tb = document.getElementById(id); if (!tb) return;
    const body = tb.tBodies ? tb.tBodies[0] : tb;
    const tabsC = $(`[data-filter-table="${id}"]`);
    const cat = tabsC ? UI[tabsC.dataset.tabs] : null;
    const q = ($(`[data-search="${id}"]`) || {}).value; const qq = (q || '').trim().toLowerCase();
    const sels = $$(`[data-col-filter="${id}"]`).filter(s => s.value);
    let n = 0;
    $$('[data-row]', body).forEach(r => {
      let ok = true;
      if (cat && cat !== 'all') ok = (r.dataset.cat || '').split(' ').includes(cat);
      if (ok && qq) ok = r.textContent.toLowerCase().includes(qq);
      if (ok) sels.forEach(s => { if (!(r.dataset[s.dataset.key] || '').split('|').includes(s.value)) ok = false; });
      r.hidden = !ok; if (ok) n++;
    });
    let nr = $('.no-res', body);
    if (!n) {
      if (!nr) {
        const cols = (tb.querySelector('tr') || { children: [] }).children.length || 1;
        nr = document.createElement(body.tagName === 'TBODY' ? 'tr' : 'div'); nr.className = 'no-res';
        const inner = `<div class="empty" style="padding-block:var(--gl-space-8)"><span class="empty-ic" style="background:var(--gl-bg-subtle);color:var(--gl-text-muted)">${icon('search')}</span><h3 class="t-h3">${L('مفيش نتايج', 'No results')}</h3><p>${L('جرّب كلمة تانية أو امسح الفلاتر.', 'Try another search or clear the filters.')}</p><button class="btn btn-outline btn-sm" data-clear-filters="${id}">${icon('x')}${L('مسح الفلاتر', 'Clear filters')}</button></div>`;
        nr.innerHTML = body.tagName === 'TBODY' ? `<td colspan="${cols}" style="height:auto;white-space:normal">${inner}</td>` : inner;
        body.appendChild(nr);
      }
    } else if (nr) nr.remove();
    $$(`[data-count="${id}"]`).forEach(e => { e.textContent = n; });
  }

  /* ---------- overlays (modal / drawer / confirm) ---------- */
  function closeOverlay(ov) { ov = ov || $$('.ovl').pop(); if (!ov) return; ov.classList.add('out'); setTimeout(() => ov.remove(), 180); }
  function overlay(html, kind, size) {
    const ov = document.createElement('div');
    ov.className = 'ovl ov-' + (kind || 'modal');
    ov.innerHTML = `<div class="${kind === 'drawer' ? 'drawer' : 'modal'} ${size || ''}" role="dialog" aria-modal="true">${html}</div>`;
    ov.addEventListener('mousedown', e => { if (e.target === ov) closeOverlay(ov); });
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    setTimeout(() => { const f = $('input:not([type=hidden]),textarea,select', ov); if (f && !firstRun) f.focus(); }, 60);
    return ov;
  }
  function rowData(row) {
    const d = {};
    if (!row) return d;
    if (row.dataset.ctx) try { Object.assign(d, JSON.parse(row.dataset.ctx)); } catch (e) {}
    $$('[data-f]', row).forEach(e => { if (!(e.dataset.f in d)) d[e.dataset.f] = e.textContent.trim(); });
    return d;
  }
  function openModal(id, trigger) {
    const m = (page && page.modals || {})[id] || (GLI.shared[id]);
    if (!m) { toast('info', L('قريبًا', 'Coming soon'), id); return; }
    const row = trigger ? (trigger.closest('[data-row]') || (trigger.closest('.menu') ? menuRow : null)) : null;
    const ctx = Object.assign({}, rowData(row), trigger && trigger.dataset.ctx ? JSON.parse(trigger.dataset.ctx) : {});
    const h = { icon, ui: GL.ui, ctx, L };
    const t = typeof m.title === 'function' ? m.title(L, ctx) : m.title;
    const sub = typeof m.sub === 'function' ? m.sub(L, ctx) : m.sub;
    const body = m.body(L, h);
    const foot = m.foot ? m.foot(L, h) : `<button type="button" class="btn btn-ghost" data-close>${L('إلغاء', 'Cancel')}</button><button type="submit" class="btn ${m.danger ? 'btn-danger' : 'btn-primary'}">${m.submitIcon ? icon(m.submitIcon, m.submitIcon === 'send' ? 'sm flip' : 'sm') : ''}${typeof m.submit === 'function' ? m.submit(L, ctx) : (m.submit || L('حفظ', 'Save'))}</button>`;
    const ov = overlay(`<form class="ov-form" novalidate>
      <header class="ov-head">${m.icon ? `<span class="ic-tile" style="${m.tone ? GL.ui.tone[m.tone] : ''}">${icon(m.icon)}</span>` : ''}<div class="grow"><h2 class="t-h2">${t}</h2>${sub ? `<p class="t-sm sec mt-1">${sub}</p>` : ''}</div><button type="button" class="icon-btn sm" data-close>${icon('x')}</button></header>
      <div class="ov-body">${body}</div>
      <footer class="ov-foot">${m.footNote ? `<span class="t-cap muted grow">${m.footNote(L)}</span>` : ''}${foot}</footer></form>`, m.kind, m.size);
    // prefill for edit
    $$('[name]', ov).forEach(f => { if (ctx[f.name] != null && !f.value) f.value = ctx[f.name]; });
    const form = $('form', ov);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(form)) return;
      const v = {}; $$('[name]', form).forEach(f => { if (f.type === 'checkbox') v[f.name] = f.checked; else v[f.name] = f.value; });
      $$('[data-val]', form).forEach(f => { v[f.dataset.val] = f.classList.contains('on') ? (f.dataset.value || true) : (v[f.dataset.val] || ''); });
      let res;
      if (m.onSubmit) res = m.onSubmit(v, Object.assign(h, { row, form }));
      if (res === false) return;
      if (m.add) addRow(m.add.table, m.add.row(v, L, h), m.add.prepend !== false);
      if (row && m.update !== false && !m.add) $$('[data-f]', row).forEach(el => { if (v[el.dataset.f] !== undefined && v[el.dataset.f] !== '') el.textContent = v[el.dataset.f]; }), flash(row);
      closeOverlay(ov);
      const tt = m.toast ? m.toast(L, v, ctx) : [L('اتحفظ', 'Saved'), ''];
      if (tt) toast(tt[2] || 'success', tt[0], tt[1]);
    });
    return ov;
  }
  function confirmBox(o, onOk) {
    const ov = overlay(`<div class="cf"><span class="cf-ic ${o.danger ? 'danger' : ''}">${icon(o.icon || (o.danger ? 'trash-2' : 'help'))}</span><h2 class="t-h2">${o.title}</h2><p class="sec">${o.text || ''}</p>
      ${o.type ? `<div class="field" style="text-align:start"><label class="t-sm">${L('اكتب', 'Type')} <b class="ltr">${o.type}</b> ${L('للتأكيد', 'to confirm')}</label><span class="control"><input data-type-confirm="${esc(o.type)}"></span></div>` : ''}
      <div class="row gap-2 cf-act"><button class="btn btn-outline grow" data-close>${L('إلغاء', 'Cancel')}</button><button class="btn ${o.danger ? 'btn-danger' : 'btn-primary'} grow" data-ok ${o.type ? 'disabled' : ''}>${o.btn || L('تأكيد', 'Confirm')}</button></div></div>`, 'modal', 'sm');
    const ok = $('[data-ok]', ov);
    const tc = $('[data-type-confirm]', ov);
    if (tc) tc.addEventListener('input', () => { ok.disabled = tc.value.trim() !== tc.dataset.typeConfirm; });
    ok.onclick = () => { closeOverlay(ov); onOk(); };
  }
  function flash(el) { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function addRow(tableId, html, prepend) {
    const tb = document.getElementById(tableId); if (!tb) return;
    const body = tb.tBodies && tb.tBodies[0] ? tb.tBodies[0] : tb;
    const tmp = document.createElement(body.tagName === 'TBODY' ? 'tbody' : 'div'); tmp.innerHTML = html.trim();
    const el = tmp.firstElementChild;
    prepend ? body.insertBefore(el, body.firstElementChild) : body.appendChild(el);
    const nr = $('.no-res', body); if (nr) nr.remove();
    flash(el); filterTable(tableId);
    return el;
  }
  function deleteRow(row, name) {
    const parent = row.parentNode, next = row.nextSibling;
    row.classList.add('leaving');
    setTimeout(() => { row.remove(); const t = parent.closest('table,[id]'); if (t && t.id) filterTable(t.id); }, 200);
    toast('success', L('اتحذف', 'Deleted'), name ? `«${name}»` : '', { undo: () => { row.classList.remove('leaving'); parent.insertBefore(row, next); flash(row); } });
  }

  /* ---------- validation ---------- */
  function setErr(f, msg) {
    const fld = f.closest('.field') || f.parentNode; const ctl = f.closest('.control') || f;
    ctl.classList.toggle('is-error', !!msg);
    let e = $('.err.v', fld);
    if (msg) { if (!e) { e = document.createElement('span'); e.className = 'err v row gap-1'; fld.appendChild(e); } e.innerHTML = icon('alert-circle', 'xs') + msg; }
    else if (e) e.remove();
  }
  function checkField(f) {
    const v = (f.value || '').trim();
    if (f.hasAttribute('data-req') && !v) return L('الحقل ده مطلوب', 'This field is required');
    if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return L('اكتب إيميل صحيح، زي name@company.example', 'Enter a valid email, e.g. name@company.example');
    if (v && f.dataset.min && v.length < +f.dataset.min) return L(`على الأقل ${f.dataset.min} حروف`, `At least ${f.dataset.min} characters`);
    if (f.dataset.match) { const o = f.form && f.form.querySelector(`[name="${f.dataset.match}"]`); if (o && o.value !== f.value) return L('مش متطابقة', 'Doesn’t match'); }
    return '';
  }
  function validate(form) {
    let first = null;
    $$('input,select,textarea', form).forEach(f => { if (f.closest('[hidden]')) return; const m = checkField(f); setErr(f, m); if (m && !first) first = f; });
    $$('[data-req-group]', form).forEach(g => { const ok = $$('.on', g).length > 0; g.classList.toggle('is-error', !ok); let e = g.nextElementSibling && g.nextElementSibling.classList.contains('err') ? g.nextElementSibling : null; if (!ok && !e) { e = document.createElement('span'); e.className = 'err row gap-1'; e.innerHTML = icon('alert-circle', 'xs') + L('اختار اختيار واحد على الأقل', 'Pick at least one option'); g.after(e); } else if (ok && e) e.remove(); if (!ok && !first) first = g; });
    if (first) { if (first.focus) first.focus(); const n = $$('.is-error', form).length; toast('danger', L('في بيانات ناقصة', 'Please fix the highlighted fields'), L(`${n} حقل محتاج مراجعة`, `${n} field(s) need attention`)); return false; }
    return true;
  }

  /* ---------- row menus ---------- */
  function closeMenus() { $$('.menu').forEach(m => m.remove()); }
  function openMenu(btn) {
    closeMenus();
    const items = ((page && page.menus) || {})[btn.dataset.menu] || GLI.shared.menus[btn.dataset.menu] || GLI.shared.menus.default;
    menuRow = btn.closest('[data-row]');
    const name = menuRow ? (rowData(menuRow).name || '') : '';
    const m = document.createElement('div'); m.className = 'menu';
    m.innerHTML = items.map(it => it === '-' ? '<div class="menu-sep"></div>' : `<button class="menu-i ${it.danger ? 'danger' : ''}" ${it.open ? `data-open="${it.open}"` : ''} ${it.del ? `data-delete="${esc(name)}"` : ''} ${it.toast ? `data-toast="${esc(it.toast(L, name))}"` : ''} ${it.confirm ? `data-confirm="${it.confirm}"` : ''} ${it.href ? `data-href="${it.href}"` : ''} ${it.ins ? `data-insert="${esc(it.ins(L))}"` : ''}>${icon(it.icon, 'sm')}<span>${L(it.ar, it.en)}</span></button>`).join('');
    document.body.appendChild(m);
    const r = btn.getBoundingClientRect(), rtl = document.documentElement.dir === 'rtl';
    m.style.top = (r.bottom + window.scrollY + 6) + 'px';
    const mw = m.offsetWidth;
    m.style.left = (rtl ? r.left : r.right - mw) + window.scrollX + 'px';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    const q = s => t.closest(s);
    let el;
    if ((el = q('[data-close]'))) { e.preventDefault(); closeOverlay(el.closest('.ovl')); return; }
    if ((el = q('[data-menu]')) && !q('.menu')) { e.preventDefault(); e.stopPropagation(); const open = $('.menu') && menuRow === el.closest('[data-row]'); open ? closeMenus() : openMenu(el); return; }
    const inMenu = !!q('.menu');
    if (!inMenu) closeMenus();
    if ((el = q('[data-tab]')) && el.closest('[data-tabs]')) { e.preventDefault(); const c = el.closest('[data-tabs]'); UI[c.dataset.tabs] = el.dataset.tab; applyTabs(document); return; }
    if ((el = q('[data-goto]'))) { e.preventDefault(); const [g, k] = el.dataset.goto.split(':'); UI[g] = k; applyTabs(document); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if ((el = q('[data-open]'))) { e.preventDefault(); openModal(el.dataset.open, el); closeMenus(); return; }
    if ((el = q('[data-delete]'))) {
      e.preventDefault(); const row = el.closest('[data-row]') || (inMenu ? menuRow : null); closeMenus();
      const name = el.dataset.delete || (row ? rowData(row).name : '');
      confirmBox({ danger: true, title: L(`حذف «${name}»؟`, `Delete “${name}”?`), text: L('الإجراء ده يقدر يتلغي خلال ثواني من رسالة التأكيد، بعدها هيتحذف نهائيًا.', 'You can undo from the notification for a few seconds; after that it’s permanent.'), btn: L('حذف', 'Delete') }, () => row && deleteRow(row, name));
      return;
    }
    if ((el = q('[data-confirm]'))) {
      e.preventDefault(); const c = ((page && page.confirms) || {})[el.dataset.confirm]; const row = el.closest('[data-row]') || (inMenu ? menuRow : null); closeMenus(); if (!c) return;
      const ctx = rowData(row);
      confirmBox({ danger: c.danger, icon: c.icon, title: c.title(L, ctx), text: c.text && c.text(L, ctx), btn: c.btn && c.btn(L, ctx), type: c.type && c.type(L, ctx) }, () => { if (c.run) c.run(L, ctx, row, el); const tt = c.toast && c.toast(L, ctx); if (tt) toast(tt[2] || 'success', tt[0], tt[1]); });
      return;
    }
    if ((el = q('[data-toast]'))) { e.preventDefault(); const [k, a, b] = el.dataset.toast.split('|'); toast(k, a, b); closeMenus(); return; }
    if ((el = q('[data-insert]'))) { const ta = $('[data-composer] textarea'); if (ta) { ta.value = el.dataset.insert; ta.focus(); } closeMenus(); return; }
    if ((el = q('[data-file]'))) { e.preventDefault(); const c = el.closest('[data-composer]'); const box = c && $('[data-files]', c); if (box) { const n = el.dataset.file; const d = document.createElement('span'); d.className = 'att'; d.innerHTML = icon('file', 'sm') + `<span class="ltr">${n}</span><span class="muted">240 KB</span><button class="icon-btn sm" type="button" data-rm>${icon('x', 'xs')}</button>`; box.appendChild(d); box.hidden = false; } return; }
    if ((el = q('[data-rm]'))) { e.preventDefault(); const it = el.closest('.att,[data-row],.chip'); if (it) it.remove(); return; }
    if ((el = q('[data-href]'))) { location.href = el.dataset.href; return; }
    if ((el = q('[data-clear-filters]'))) { const id = el.dataset.clearFilters; $$(`[data-search="${id}"],[data-col-filter="${id}"]`).forEach(f => { f.value = ''; }); const tc = $(`[data-filter-table="${id}"]`); if (tc) { UI[tc.dataset.tabs] = 'all'; applyTabs(document); } filterTable(id); return; }
    if ((el = q('[data-send]'))) { e.preventDefault(); send(el); return; }
    if ((el = q('[data-save]'))) { e.preventDefault(); const f = el.closest('[data-form]') || el.closest('form') || document; if (f !== document && !validate(f)) return; toast('success', L('اتحفظت التغييرات', 'Changes saved'), el.dataset.save || ''); $$('.dirty').forEach(d => d.classList.remove('dirty')); return; }
    if ((el = q('[data-step]'))) { e.preventDefault(); const f = el.closest('[data-form]'); if (f && !validate(f)) return; location.href = el.dataset.step; return; }
    if ((el = q('.switch')) && !el.hasAttribute('data-static')) { el.classList.toggle('on'); const lbl = el.dataset.label; toast('success', el.classList.contains('on') ? L('اتفعّل', 'Turned on') : L('اتقفل', 'Turned off'), lbl || ''); return; }
    if ((el = q('thead .box'))) { const tb = el.closest('table'); const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.innerHTML = on ? icon('check') : ''; $$('tbody [data-row]:not([hidden]) .box', tb).forEach(b => { b.classList.toggle('on', on); b.innerHTML = on ? icon('check') : ''; b.closest('tr').classList.toggle('sel', on); }); bulk(tb); return; }
    if ((el = q('tbody .box'))) { const on = !el.classList.contains('on'); el.classList.toggle('on', on); el.innerHTML = on ? icon('check') : ''; el.closest('tr').classList.toggle('sel', on); bulk(el.closest('table')); return; }
    if ((el = q('.check')) && !q('a')) { const b = $('.box', el); if (b) { e.preventDefault(); const on = !b.classList.contains('on'); b.classList.toggle('on', on); b.innerHTML = on ? icon('check') : ''; } return; }
    if ((el = q('.mtx .box, .opt .box'))) { /* handled by .opt below */ }
    if ((el = q('.opt'))) {
      e.preventDefault(); const g = el.parentElement; const multi = g.hasAttribute('data-multi');
      if (multi) { el.classList.toggle('on'); const b = $('.box', el); if (b) { b.classList.toggle('on', el.classList.contains('on')); b.innerHTML = el.classList.contains('on') ? icon('check') : ''; } }
      else { $$('.opt', g).forEach(o => { o.classList.toggle('on', o === el); const r = $('.radio', o); if (r) r.classList.toggle('on', o === el); }); }
      g.classList.remove('is-error'); if (g.nextElementSibling && g.nextElementSibling.classList.contains('err')) g.nextElementSibling.remove();
      return;
    }
    if ((el = q('[data-pick] > *'))) { const g = el.parentElement; $$(':scope > *', g).forEach(o => o.classList.toggle(g.dataset.pick || 'on', o === el)); return; }
    if ((el = q('.mtx td .box'))) return;
  });
  document.addEventListener('click', e => { const b = e.target.closest('.mtx td .box'); if (b) { const on = !b.classList.contains('on'); b.classList.toggle('on', on); b.innerHTML = on ? icon('check') : ''; } }, true);
  document.addEventListener('input', e => {
    const f = e.target;
    if (f.dataset.search) filterTable(f.dataset.search);
    if (f.closest('.is-error') || f.closest('.field') && $('.err.v', f.closest('.field'))) setErr(f, checkField(f));
    const fm = f.closest('[data-form]'); if (fm) fm.classList.add('dirty');
    if (f.dataset.pw !== undefined) pwMeter(f);
  });
  document.addEventListener('change', e => { const f = e.target; if (f.dataset.changeToast !== undefined) toast('success', L('اتحدث', 'Updated'), f.options ? f.options[f.selectedIndex].text : f.value); if (f.dataset.colFilter) filterTable(f.dataset.colFilter); if (f.closest('.is-error')) setErr(f, checkField(f)); const fm = f.closest('[data-form]'); if (fm) fm.classList.add('dirty'); });
  document.addEventListener('focusout', e => { const f = e.target; if (f.matches && f.matches('[data-req],[type=email],[data-min]') && f.value) setErr(f, checkField(f)); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenus(); closeOverlay(); } if (e.key === 'Enter' && e.target.closest('[data-composer]') && (e.ctrlKey || e.metaKey)) { const b = $('[data-send]', e.target.closest('[data-composer]')); if (b) send(b); } });
  window.addEventListener('scroll', closeMenus, { passive: true });

  function bulk(tb) {
    const n = $$('tbody .box.on', tb).length; const bar = $(`[data-bulk="${tb.id}"]`); if (!bar) return;
    bar.hidden = !n; const c = $('[data-bulk-n]', bar); if (c) c.textContent = n;
  }
  function pwMeter(f) {
    const v = f.value; const s = [v.length >= 8, /\d/.test(v), /[^\w\s]/.test(v), v.length >= 12].filter(Boolean).length;
    const m = f.closest('.field').querySelector('.pw-meter'); if (!m) return;
    $$('i', m).forEach((i, k) => { i.className = k < s ? 'on' + (s <= 1 ? ' weak' : s <= 2 ? ' mid' : '') : ''; });
    const h = f.closest('.field').querySelector('.pw-hint'); if (h) h.textContent = [L('ضعيفة جدًا', 'Very weak'), L('ضعيفة', 'Weak'), L('متوسطة', 'Fair'), L('كويسة', 'Good'), L('قوية', 'Strong')][s] + ' · ' + L('12 حرف أو أكتر مع رقم ورمز', '12+ characters with a number and symbol');
  }
  function send(btn) {
    const c = btn.closest('[data-composer]'); const ta = $('textarea', c); const v = (ta.value || '').trim();
    if (!v) { ta.classList.add('shake'); setTimeout(() => ta.classList.remove('shake'), 400); toast('warning', L('اكتب رسالة الأول', 'Write a message first')); return; }
    const th = document.getElementById(btn.dataset.send);
    const note = c.querySelector('[data-note].active, [data-tab="note"].active');
    const me = page && page.me ? page.me(L) : [L('أ', 'ME'), 'av-teal', L('أنت', 'You')];
    const d = document.createElement('div');
    d.className = 'msg ' + (note ? 'note' : 'mine');
    d.innerHTML = `${GL.ui.av(me[0], me[1], 'round')}<div class="bubble"><div class="hd"><b>${me[2]}</b>${note ? GL.ui.tag('accent', L('ملاحظة داخلية', 'Internal note'), false) : ''}<span>· ${L('الآن', 'just now')}</span></div><div class="bd">${esc(v)}</div></div>`;
    if (th) { th.appendChild(d); flash(d); d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    const fb = $('[data-files]', c); if (fb && fb.children.length) { const a = document.createElement('div'); a.className = 'row gap-2 wrap'; a.innerHTML = fb.innerHTML; $$('[data-rm]', a).forEach(x => x.remove()); d.querySelector('.bubble').appendChild(a); fb.innerHTML = ''; fb.hidden = true; }
    const after = $('[data-after]', c); if (after && after.value && page && page.afterSend) page.afterSend(after.value);
    ta.value = '';
    toast('success', note ? L('اتضافت الملاحظة', 'Note added') : L('اتبعتت', 'Sent'), note ? L('ظاهرة لفريقك بس', 'Visible to your team only') : '');
  }

  /* ---------- shared modals & menus ---------- */
  const GLI = window.GLI = { toast, openModal, confirmBox, addRow, deleteRow, filterTable, validate, UI, flash, shared: { menus: {} } };
  GLI.shared.menus.default = [{ icon: 'pencil', ar: 'تعديل', en: 'Edit', open: 'edit' }, { icon: 'copy', ar: 'نسخ', en: 'Duplicate', toast: (L, n) => `success|${L('اتعملت نسخة', 'Duplicated')}|${n}` }, '-', { icon: 'trash-2', ar: 'حذف', en: 'Delete', del: 1, danger: 1 }];

  window.GL_AFTER = (window.GL_AFTER || []).concat([(p) => {
    page = p; closeMenus();
    applyTabs(document);
    $$('[data-search]').forEach(f => filterTable(f.dataset.search));
    if (firstRun) {
      firstRun = false;
      if (qs.get('open')) { const tr = document.querySelector(`[data-open="${qs.get('open')}"]`); firstRun = true; openModal(qs.get('open'), tr); firstRun = false; }
      if (qs.get('validate')) { const f = $('.ovl form') || $('[data-form]'); if (f) setTimeout(() => validate(f), 50); }
      if (qs.get('toast')) toast('success', L('اتحفظت التغييرات', 'Changes saved'), L('كل اللي غيرته اتطبق على المساحة', 'Your updates are live in the workspace'), { sticky: true });
      if (qs.get('menu')) { const b = $$('[data-menu]')[+qs.get('menu') - 1 || 0]; if (b) openMenu(b); }
    }
  }]);
})();
