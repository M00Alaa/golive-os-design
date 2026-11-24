/* GoLive OS prototype runtime: language (ar/en) + theme (light/dark) toggles, shared shell, icons.
   State priority: URL (?lang=en&theme=dark) > localStorage > defaults (ar, light). */
(function () {
  const qs = new URLSearchParams(location.search);
  const store = {
    get: k => { try { return localStorage.getItem('gl-' + k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem('gl-' + k, v); } catch (e) {} }
  };
  const state = {
    lang: qs.get('lang') || store.get('lang') || 'ar',
    theme: qs.get('theme') || store.get('theme') || 'light'
  };
  if (qs.get('lang')) store.set('lang', state.lang);
  if (qs.get('theme')) store.set('theme', state.theme);
  let page = null;

  const L = (ar, en) => (state.lang === 'ar' ? ar : en);
  const icon = (name, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${(window.GL_ICONS || {})[name] || ''}</svg>`;
  const fwd = (cls) => icon('chevron-right', 'flip ' + (cls || ''));   // "forward" chevron, mirrors in RTL
  const back = (cls) => icon('chevron-left', 'flip ' + (cls || ''));

  function applyDoc() {
    const h = document.documentElement;
    h.lang = state.lang;
    h.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    h.dataset.theme = state.theme;
  }

  const NAV = [
    ['overview', 'dashboard', 'نظرة عامة', 'Overview', 'dashboard.html'],
    ['companies', 'building', 'الشركات', 'Companies', 'companies.html'],
    ['plans', 'layers', 'الخطط والأسعار', 'Plans & Pricing', '#'],
    ['billing', 'credit-card', 'الاشتراكات والفواتير', 'Subscriptions & Billing', '#'],
    ['support', 'life-buoy', 'الدعم الفني', 'Support', '#', '12'],
    ['staff', 'shield', 'فريق المنصة', 'Platform Staff', '#'],
    ['audit', 'file-text', 'سجل النشاط', 'Audit Log', '#'],
    ['settings', 'settings', 'الإعدادات', 'Settings', '#']
  ];

  function toggles() {
    return `
      <div class="seg" role="group" aria-label="Language">
        <button data-lang="ar" class="${state.lang === 'ar' ? 'on' : ''}">ع</button>
        <button data-lang="en" class="${state.lang === 'en' ? 'on' : ''}">EN</button>
      </div>
      <div class="seg" role="group" aria-label="Theme">
        <button data-theme-set="light" class="${state.theme === 'light' ? 'on' : ''}" title="Light">${icon('sun', 'xs')}</button>
        <button data-theme-set="dark" class="${state.theme === 'dark' ? 'on' : ''}" title="Dark">${icon('moon', 'xs')}</button>
      </div>`;
  }

  function sidebar(active) {
    const item = n => `<a class="nav-item ${n[0] === active ? 'active' : ''}" href="${n[4]}">${icon(n[1])}<span>${L(n[2], n[3])}</span>${n[5] ? `<span class="count">${n[5]}</span>` : ''}</a>`;
    return `
    <aside class="sidebar"><div class="sb-in">
      <a class="brand" href="index.html">
        <span class="brand-mark">${icon('rocket')}</span>
        <span><div class="brand-name">GoLive OS</div><div class="brand-sub">${L('لوحة إدارة المنصة', 'Platform Admin')}</div></span>
      </a>
      <nav class="nav">
        <div class="nav-label">${L('الرئيسية', 'Main')}</div>
        ${NAV.slice(0, 5).map(item).join('')}
      </nav>
      <nav class="nav">
        <div class="nav-label">${L('النظام', 'System')}</div>
        ${NAV.slice(5).map(item).join('')}
      </nav>
      <div class="sidebar-foot">
        <div class="sys-status"><span class="pulse"></span><span><b>${L('كل الأنظمة تعمل', 'All systems operational')}</b>${L('آخر فحص منذ دقيقتين', 'Last checked 2 min ago')}</span></div>
        <div class="me">
          <span class="avatar round av-solid">${L('م', 'M')}</span>
          <span><div class="me-name">${L('محمد علاء', 'Mohamed Alaa')}</div><div class="me-role">${L('مالك المنصة', 'Platform owner')}</div></span>
          <button class="icon-btn sm" title="Log out">${icon('log-out', 'flip')}</button>
        </div>
      </div>
    </div></aside>`;
  }

  function topbar() {
    return `
    <header class="topbar">
      <label class="control search">${icon('search', 'sm')}<input placeholder="${L('ابحث عن شركة، مستخدم أو فاتورة…', 'Search companies, users or invoices…')}"><span class="kbd">Ctrl K</span></label>
      <div class="topbar-actions">
        ${toggles()}
        <span class="sep"></span>
        <button class="icon-btn" title="Help">${icon('help')}</button>
        <button class="icon-btn bell" title="Notifications">${icon('bell')}</button>
      </div>
    </header>`;
  }

  function docbar() {
    return `
    <header class="topbar docbar">
      <a class="brand" href="index.html"><span class="brand-mark">${icon('rocket')}</span><span class="brand-name" style="color:var(--gl-text-primary)">GoLive OS</span></a>
      <nav class="row gap-1" style="margin-inline-start:var(--gl-space-6)">
        <a class="btn btn-ghost btn-sm ${page.doc === 'index' ? 'is-hover' : ''}" href="index.html">${L('المعرض', 'Gallery')}</a>
        <a class="btn btn-ghost btn-sm ${page.doc === 'ds' ? 'is-hover' : ''}" href="design-system.html">${L('نظام التصميم', 'Design System')}</a>
        <a class="btn btn-ghost btn-sm" href="dashboard.html">Super Admin</a>
      </nav>
      <div class="topbar-actions">${toggles()}</div>
    </header>`;
  }

  function render() {
    applyDoc();
    document.title = (typeof page.title === 'function' ? page.title(L) : page.title) + ' · GoLive OS';
    const body = page.render(L, { icon, fwd, back });
    const root = document.getElementById('app');
    if (page.doc) {
      root.innerHTML = `<div class="doc">${docbar()}<main class="doc-main">${body}</main></div>`;
    } else {
      root.innerHTML = `<div class="app">${sidebar(page.nav)}<div class="main">${topbar()}<main class="content">${body}</main></div></div>`;
    }
    if (page.after) page.after(L);
  }

  document.addEventListener('click', e => {
    const lb = e.target.closest('[data-lang]');
    const tb = e.target.closest('[data-theme-set]');
    if (lb) { state.lang = lb.dataset.lang; store.set('lang', state.lang); render(); }
    if (tb) { state.theme = tb.dataset.themeSet; store.set('theme', state.theme); render(); }
  });

  applyDoc();
  window.GL = { L, icon, fwd, back, state, mount(p) { page = p; render(); } };
})();
