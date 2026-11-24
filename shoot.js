// usage: node shoot.js [filter ...]  -> renders configured shots (filter = substring of shot name)
const { chromium } = require('playwright');
const path = require('path');
const base = 'file://' + path.join(__dirname, 'html') + '/';
const PAGES = [
  'dashboard', 'companies', 'company-360', 'plans', 'billing', 'support', 'support-ticket', 'staff', 'audit-log', 'settings',
  'ws-dashboard', 'ws-projects', 'ws-project', 'ws-templates', 'ws-clients', 'ws-team', 'ws-settings',
  'portal', 'portal-requirements', 'portal-approvals', 'portal-files', 'portal-messages',
  'signup', 'login', 'onboarding-workspace', 'onboarding-invite', 'onboarding-plan', 'ws-welcome', 'empty-states',
  'design-system', 'index'
];
const SHOTS = {};
for (const p of PAGES) {
  SHOTS[p + '-ar-light'] = p + '.html?lang=ar&theme=light';
  SHOTS[p + '-en-light'] = p + '.html?lang=en&theme=light';
  SHOTS[p + '-ar-dark'] = p + '.html?lang=ar&theme=dark';
}
// interaction states: name -> [url, optional JS to run before the shot]; shot as the viewport (overlays are fixed)
const STATES = require('./states.js');
for (const [k, v] of Object.entries(STATES)) { for (const lang of ['ar', 'en']) SHOTS['x-' + k + '-' + lang] = [v[0] + (v[0].includes('?') ? '&' : '?') + 'lang=' + lang + '&theme=light', v[1]]; }
(async () => {
  const want = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) console.log('CONSOLE', m.text()); });
  for (let [name, url] of Object.entries(SHOTS)) {
    let act = null; if (Array.isArray(url)) { act = url[1]; url = url[0]; }
    if (want.length ? !want.some(w => name === w || (w.endsWith('*') && name.startsWith(w.slice(0, -1)))) : !name.endsWith('ar-light')) continue;
    if (want.length === 0 && name.startsWith('x-')) continue;
    await page.goto(base + url, { waitUntil: 'networkidle' }).catch(e => console.log('GOTO', e.message));
    await page.evaluate(() => document.fonts.ready);
    if (act) { await page.evaluate(act).catch(e => console.log('ACT', e.message)); }
    await page.waitForTimeout(act || name.startsWith('x-') ? 450 : 0);
    const info = await page.evaluate(() => {
      const over = [];
      document.querySelectorAll('#app *').forEach(el => {
        const cs = getComputedStyle(el);
        if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX === 'visible' && el.clientWidth > 0 && !['svg', 'path', 'circle', 'polyline', 'line', 'rect', 'polygon'].includes(el.tagName.toLowerCase()))
          over.push(el.tagName + '.' + el.className + ' ' + el.scrollWidth + '>' + el.clientWidth + ' "' + el.textContent.trim().slice(0, 24) + '"');
      });
      const ell = [...document.querySelectorAll('td,.nm,.dm,.ell,.v')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim().slice(0, 30));
      return { docW: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, over: over.slice(0, 12), ell: ell.slice(0, 12) };
    });
    await page.screenshot({ path: path.join(__dirname, 'screenshots', name + '.png'), fullPage: !name.startsWith('x-') });
    console.log(name, JSON.stringify(info));
    if (name.endsWith('ar-light') && !name.startsWith('index')) await page.screenshot({ path: path.join(__dirname, 'html/assets/thumbs', name + '.png'), clip: { x: 0, y: 0, width: 1440, height: 810 } });
  }
  await browser.close();
})();
