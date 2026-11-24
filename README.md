# GoLive OS — HTML design prototype

Live: https://golive-os-design.vercel.app · كل push على `main` بيتنشر تلقائيًا على Vercel.

افتح `index.html` (المعرض) — كل الشاشات متقسمة حسب السطح، وكل شاشة ليها AR/EN وLight/Dark.

| السطح | الشاشات |
|---|---|
| Super Admin | `dashboard` · `companies` · `company-360` · `plans` · `billing` · `support` · `support-ticket` · `staff` · `audit-log` · `settings` |
| Company Workspace | `ws-dashboard` · `ws-projects` · `ws-project` · `ws-templates` · `ws-clients` · `ws-team` · `ws-settings` |
| Client Portal | `portal` · `portal-requirements` · `portal-approvals` · `portal-files` · `portal-messages` |
| Registration & Onboarding | `signup` · `login` · `onboarding-workspace` · `onboarding-invite` · `onboarding-plan` · `ws-welcome` · `empty-states` |

- **روابط لحالة معيّنة:** `ws-project.html?lang=en&theme=dark` (الاختيار بيتحفظ في localStorage).
- **الملفات:**
  - `assets/tokens.css` — كل متغيرات `--gl-*` (ألوان، مسافات 8pt، زوايا، ظلال، خطوط). المرجع لـ Tailwind / PrimeNG.
  - `assets/app.css` — المكونات الأساسية (خصائص CSS منطقية بس عشان RTL/LTR).
  - `assets/screens.css` — أنماط الشاشات المشتركة (settings، wizard، auth، portal، plans، chat، gantt…).
  - `assets/app.js` — الـ shells: `admin` (sidebar المنصة)، `ws` (sidebar مساحة الشركة)، `portal` (هيدر أفقي للعميل)، `auth` (split screen)، `wizard` (stepper)، و`doc` (المعرض ونظام التصميم). كمان فيه helpers مشتركة `ui.*`.
  - `assets/data.js` — بيانات تجريبية وهمية (دومينات `.example`)، `assets/icons.js` — أيقونات Lucide.
- **الخط:** Readex Pro من Google Fonts، مع نسخة محلية `assets/fonts/ReadexPro.ttf`.
