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
    ['plans', 'layers', 'الخطط والأسعار', 'Plans & Pricing', 'plans.html'],
    ['billing', 'credit-card', 'الاشتراكات والفواتير', 'Subscriptions & Billing', 'billing.html'],
    ['support', 'life-buoy', 'الدعم الفني', 'Support', 'support.html', '12'],
    ['staff', 'shield', 'فريق المنصة', 'Platform Staff', 'staff.html'],
    ['audit', 'file-text', 'سجل النشاط', 'Audit Log', 'audit-log.html'],
    ['settings', 'settings', 'الإعدادات', 'Settings', 'settings.html']
  ];
  const WS_NAV = [
    ['ws-home', 'dashboard', 'الرئيسية', 'Dashboard', 'ws-dashboard.html'],
    ['ws-projects', 'briefcase', 'المشاريع', 'Projects', 'ws-projects.html', '7'],
    ['ws-clients', 'building-2', 'العملاء', 'Clients', 'ws-clients.html'],
    ['ws-templates', 'layout-template', 'قوالب التنفيذ', 'Playbooks', 'ws-templates.html'],
    ['ws-team', 'users', 'الفريق والصلاحيات', 'Team & roles', 'ws-team.html'],
    ['ws-settings', 'settings', 'إعدادات المساحة', 'Workspace settings', 'ws-settings.html']
  ];
  const WS_PINNED = [
    ['var(--gl-success-solid)', 'تطبيق Odoo ERP', 'Odoo ERP rollout', 'ws-project.html'],
    ['var(--gl-danger-solid)', 'ترحيل بيانات المخازن', 'Inventory migration', 'ws-project.html'],
    ['var(--gl-warning-solid)', 'Odoo CRM · الريادة', 'Odoo CRM · Riyada', 'ws-project.html']
  ];
  const PORTAL_NAV = [
    ['p-home', 'dashboard', 'الرئيسية', 'Home', 'portal.html'],
    ['p-req', 'clipboard-list', 'المطلوب منك', 'Requests', 'portal-requirements.html', '4'],
    ['p-appr', 'file-pen-line', 'الموافقات', 'Approvals', 'portal-approvals.html', '2'],
    ['p-files', 'folder', 'الملفات', 'Files', 'portal-files.html'],
    ['p-msg', 'message', 'الرسائل والتحديثات', 'Messages', 'portal-messages.html']
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

  const navItem = active => n => `<a class="nav-item ${n[0] === active ? 'active' : ''}" href="${n[4]}">${icon(n[1])}<span>${L(n[2], n[3])}</span>${n[5] ? `<span class="count">${n[5]}</span>` : ''}</a>`;

  function sidebar(active) {
    const item = navItem(active);
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

  function wsSidebar(active, fresh) {
    const item = n => navItem(active)(fresh ? n.slice(0, 5) : n);
    return `
    <aside class="sidebar ws"><div class="sb-in">
      <a class="ws-switch" href="ws-dashboard.html">
        <span class="avatar ws-logo">${L('ن', 'NS')}</span>
        <span class="grow"><div class="brand-name">${L('نيل سوفت للحلول', 'NileSoft Solutions')}</div><div class="brand-sub">${fresh ? L('تجربة مجانية · باقي 14 يوم', 'Free trial · 14 days left') : L('مساحة عمل · Growth', 'Workspace · Growth')}</div></span>
        ${icon('chevrons-up-down', 'sm')}
      </a>
      <nav class="nav">
        <div class="nav-label">${L('العمل', 'Work')}</div>
        ${WS_NAV.slice(0, 4).map(item).join('')}
      </nav>
      ${fresh ? '' : `<nav class="nav">
        <div class="nav-label">${L('مشاريع مثبتة', 'Pinned projects')}</div>
        ${WS_PINNED.map(p => `<a class="nav-item pin" href="${p[3]}"><i style="background:${p[0]}"></i><span class="ell">${L(p[1], p[2])}</span></a>`).join('')}
      </nav>`}
      <nav class="nav">
        <div class="nav-label">${L('المساحة', 'Workspace')}</div>
        ${WS_NAV.slice(4).map(item).join('')}
      </nav>
      <div class="sidebar-foot">
        <div class="sys-status usage-mini"><span class="grow"><b>${fresh ? L('0 من 10 مشاريع نشطة', '0 of 10 active projects') : L('7 من 10 مشاريع نشطة', '7 of 10 active projects')}</b><span class="bar thin"><i style="width:${fresh ? 0 : 70}%"></i></span></span></div>
        <div class="me">
          <span class="avatar round av-solid">${L('أ', 'A')}</span>
          <span><div class="me-name">${L('أحمد سامي', 'Ahmed Samy')}</div><div class="me-role">${L('مالك المساحة', 'Workspace owner')}</div></span>
          <button class="icon-btn sm" title="Log out">${icon('log-out', 'flip')}</button>
        </div>
      </div>
    </div></aside>`;
  }

  function topbar(ws) {
    const ph = ws ? L('ابحث في المشاريع والعملاء والمهام…', 'Search projects, clients and tasks…') : L('ابحث عن شركة، مستخدم أو فاتورة…', 'Search companies, users or invoices…');
    return `
    <header class="topbar">
      <label class="control search">${icon('search', 'sm')}<input placeholder="${ph}"><span class="kbd">Ctrl K</span></label>
      <div class="topbar-actions">
        ${ws ? `<a class="btn btn-primary btn-sm" href="ws-projects.html">${icon('plus')}${L('مشروع جديد', 'New project')}</a><span class="sep"></span>` : ''}
        ${toggles()}
        <span class="sep"></span>
        <button class="icon-btn" title="Help">${icon('help')}</button>
        <button class="icon-btn bell" title="Notifications">${icon('bell')}</button>
      </div>
    </header>`;
  }

  function portalbar(active) {
    return `
    <header class="pbar"><div class="pbar-in">
      <a class="p-brand" href="portal.html">
        <span class="avatar ws-logo sm">${L('ن', 'NS')}</span>
        <span><div class="p-brand-name">${L('نيل سوفت للحلول', 'NileSoft Solutions')}</div><div class="t-cap muted">${L('بوابة العميل · مصنع النور للبلاستيك', 'Client portal · Al Nour Plastics')}</div></span>
      </a>
      <nav class="p-nav">${PORTAL_NAV.map(n => `<a class="p-link ${n[0] === active ? 'active' : ''}" href="${n[4]}">${icon(n[1], 'sm')}<span>${L(n[2], n[3])}</span>${n[5] ? `<span class="badge">${n[5]}</span>` : ''}</a>`).join('')}</nav>
      <div class="topbar-actions">
        ${toggles()}
        <button class="icon-btn bell" title="Notifications">${icon('bell')}</button>
        <span class="avatar round sm av-amber">${L('خ', 'KM')}</span>
      </div>
    </div></header>`;
  }

  function authLayout(body) {
    return `
    <div class="auth">
      <section class="auth-form">
        <div class="auth-top"><a class="brand" href="index.html"><span class="brand-mark">${icon('rocket')}</span><span class="brand-name" style="color:var(--gl-text-primary)">GoLive OS</span></a><div class="row gap-2">${toggles()}</div></div>
        <div class="auth-mid">${body}</div>
        <div class="auth-foot t-cap muted"><span>© 2026 GoLive OS</span><span class="row gap-4"><a href="#">${L('الخصوصية', 'Privacy')}</a><a href="#">${L('الشروط', 'Terms')}</a><a href="#">${L('المساعدة', 'Help')}</a></span></div>
      </section>
      <aside class="auth-art">
        <div class="art-grid"></div>
        <div class="art-in">
          <span class="tag accent">${icon('sparkles', 'xs')}${L('لشركات تنفيذ ERP وCRM', 'Built for ERP & CRM implementers')}</span>
          <h2>${L('من توقيع العقد لحد الإطلاق، في مكان واحد.', 'From signed contract to go-live, in one place.')}</h2>
          <p>${L('المتطلبات والموافقات والـ blockers وبوابة العميل، كلها متابعة لحظة بلحظة.', 'Requirements, approvals, blockers and a client portal — tracked in real time.')}</p>
          <div class="art-card">
            <div class="row between"><div class="row gap-3"><span class="avatar sm av-teal">${L('ن', 'AN')}</span><div><div class="t-strong">${L('تطبيق Odoo ERP', 'Odoo ERP rollout')}</div><div class="t-cap">${L('مصنع النور للبلاستيك', 'Al Nour Plastics')}</div></div></div><span class="tag success"><span class="dot"></span>${L('في المسار', 'On track')}</span></div>
            <div class="art-steps">${[L('الاكتشاف', 'Discovery'), L('التصميم', 'Design'), L('البناء', 'Build'), L('UAT', 'UAT'), L('الإطلاق', 'Go-live')].map((x, i) => `<div class="${i < 3 ? 'done' : i === 3 ? 'cur' : ''}"><i></i><span>${x}</span></div>`).join('')}</div>
            <div class="row between t-cap"><span>${L('اكتمل 72%', '72% complete')}</span><span>${L('الإطلاق 15 ديسمبر', 'Go-live Dec 15')}</span></div>
          </div>
          <figure class="quote"><blockquote>${L('«قللنا رسائل الواتساب مع العملاء للنص، وبقى كل قرار موثق بموافقة.»', '“We halved client WhatsApp threads, and every decision now has a sign-off.”')}</blockquote>
            <figcaption><span class="avatar round sm av-amber">${L('س', 'SR')}</span><span><b>${L('سارة رمزي', 'Sara Ramzy')}</b>${L('مديرة مشاريع · مدار للتقنية', 'PM · Madar Tech')}</span></figcaption></figure>
        </div>
      </aside>
    </div>`;
  }

  function wizardLayout(body, step) {
    const steps = [L('بيانات الشركة', 'Workspace'), L('دعوة الفريق', 'Invite team'), L('اختيار الخطة', 'Choose plan'), L('جاهز', 'Ready')];
    return `
    <div class="wiz">
      <header class="wiz-bar">
        <a class="brand" href="index.html"><span class="brand-mark">${icon('rocket')}</span><span class="brand-name" style="color:var(--gl-text-primary)">GoLive OS</span></a>
        <ol class="stepper">${steps.map((t, i) => `<li class="${i < step ? 'done' : i === step ? 'cur' : ''}"><span class="st-n">${i < step ? icon('check') : i + 1}</span><span>${t}</span></li>`).join(`<li class="st-line" aria-hidden="true"></li>`)}</ol>
        <div class="row gap-2">${toggles()}</div>
      </header>
      <main class="wiz-main">${body}</main>
    </div>`;
  }

  function docbar() {
    return `
    <header class="topbar docbar">
      <a class="brand" href="index.html"><span class="brand-mark">${icon('rocket')}</span><span class="brand-name" style="color:var(--gl-text-primary)">GoLive OS</span></a>
      <nav class="row gap-1" style="margin-inline-start:var(--gl-space-6)">
        <a class="btn btn-ghost btn-sm ${page.doc === 'index' ? 'is-hover' : ''}" href="index.html">${L('المعرض', 'Gallery')}</a>
        <a class="btn btn-ghost btn-sm ${page.doc === 'ds' ? 'is-hover' : ''}" href="design-system.html">${L('نظام التصميم', 'Design System')}</a>
        <a class="btn btn-ghost btn-sm" href="dashboard.html">Super Admin</a>
        <a class="btn btn-ghost btn-sm" href="ws-dashboard.html">Workspace</a>
        <a class="btn btn-ghost btn-sm" href="portal.html">${L('بوابة العميل', 'Client portal')}</a>
        <a class="btn btn-ghost btn-sm ${page.doc === 'empty' ? 'is-hover' : ''}" href="signup.html">${L('التسجيل', 'Onboarding')}</a>
      </nav>
      <div class="topbar-actions">${toggles()}</div>
    </header>`;
  }

  function render() {
    applyDoc();
    document.title = (typeof page.title === 'function' ? page.title(L) : page.title) + ' · GoLive OS';
    const body = page.render(L, { icon, fwd, back, ui });
    const root = document.getElementById('app');
    const shell = page.shell || 'admin';
    if (page.doc) {
      root.innerHTML = `<div class="doc">${docbar()}<main class="doc-main">${body}</main></div>`;
    } else if (shell === 'ws') {
      root.innerHTML = `<div class="app">${wsSidebar(page.nav, page.fresh)}<div class="main">${topbar(true)}<main class="content">${body}</main></div></div>`;
    } else if (shell === 'portal') {
      root.innerHTML = `<div class="portal">${portalbar(page.nav)}<main class="p-main">${body}</main></div>`;
    } else if (shell === 'auth') {
      root.innerHTML = authLayout(body);
    } else if (shell === 'wizard') {
      root.innerHTML = wizardLayout(body, page.step || 0);
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

  /* Shared UI snippets */
  const ui = {
    tag: (cls, txt, dot) => `<span class="tag ${cls}">${dot === false ? '' : '<span class="dot"></span>'}${txt}</span>`,
    kpi: (label, ic, val, foot, style) => `<div class="card kpi"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-icon" style="${style || ''}">${icon(ic)}</span></div><span class="kpi-val">${val}</span><div class="kpi-foot">${foot}</div></div>`,
    mini: (ic, style, v, l) => `<div class="card mini"><span class="kpi-icon" style="${style || ''}">${icon(ic)}</span><div><div class="v">${v}</div><div class="l">${l}</div></div></div>`,
    av: (txt, cls, extra) => `<span class="avatar ${extra || 'sm round'} ${cls}">${txt}</span>`,
    stack: list => `<span class="av-stack">${list.map(a => `<span class="avatar sm round ${a[1]}">${a[0]}</span>`).join('')}</span>`,
    bar: (pct, cls) => `<div class="bar thin ${cls || ''}"><i style="width:${pct}%"></i></div>`,
    tone: { success: 'background:var(--gl-success-bg);color:var(--gl-success-fg)', warning: 'background:var(--gl-warning-bg);color:var(--gl-warning-fg)', danger: 'background:var(--gl-danger-bg);color:var(--gl-danger-fg)', info: 'background:var(--gl-info-bg);color:var(--gl-info-fg)', violet: 'background:var(--gl-violet-bg);color:var(--gl-violet-fg)', accent: 'background:var(--gl-accent-subtle);color:var(--gl-accent-text)' }
  };

  applyDoc();
  window.GL = { L, icon, fwd, back, ui, state, mount(p) { page = p; render(); } };
})();
