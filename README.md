# GoLive OS — Phase 1 HTML prototype

افتح `index.html` في أي متصفح، ومن غير ما تحتاج سيرفر.

- **الأزرار اللي فوق:** `ع / EN` بتغيّر اللغة والاتجاه (RTL/LTR)، و ☀ / ☾ بتغيّر بين الوضع الفاتح والغامق. اختيارك بيتحفظ في localStorage.
- **روابط مباشرة لحالة معيّنة:** `dashboard.html?lang=en&theme=dark`
- **الملفات:**
  - `assets/tokens.css` فيه كل متغيرات `--gl-*`، الألوان والمسافات والزوايا والظلال والخطوط. ده المرجع اللي هيتنقل لـ Tailwind وPrimeNG.
  - `assets/app.css` فيه المكونات، ومكتوب بخصائص CSS المنطقية بس.
  - `assets/app.js` فيه الـ shell والأزرار، و`assets/icons.js` فيه أيقونات Lucide.
- **الخط:** Readex Pro من Google Fonts، ولو مفيش نت بيستخدم النسخة المحلية `assets/fonts/ReadexPro.ttf`.
