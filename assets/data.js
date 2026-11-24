/* Demo data (fictional companies, .example domains) */
window.GL_COMPANIES = [
  // ar, en, domain, arInitial, enInitials, avatar, plan, status, users, mrr, created ar, created en, projects
  ['نيل سوفت للحلول','NileSoft Solutions','nilesoft.example','ن','NS','av-teal','Growth','active',24,179,'12 مارس 2026','Mar 12, 2026',7],
  ['دلتا لأنظمة ERP','Delta ERP Systems','delta-erp.example','د','DE','av-blue','Starter','trial',6,0,'18 نوفمبر 2026','Nov 18, 2026',2],
  ['سحابة الأهرام','Ahram Cloud','ahram-cloud.example','س','AC','av-violet','Enterprise','active',48,420,'3 يناير 2026','Jan 3, 2026',14],
  ['مدار للتقنية','Madar Tech','madar-tech.example','م','MT','av-amber','Growth','pastdue',19,179,'27 مايو 2026','May 27, 2026',5],
  ['رؤية للأنظمة المتكاملة','Roya Integrated Systems','roya-systems.example','ر','RI','av-teal','Starter','active',9,79,'9 أغسطس 2026','Aug 9, 2026',3],
  ['بوابة الشرق للاستشارات','Sharq Gate Consulting','sharq-gate.example','ب','SG','av-blue','Growth','active',31,179,'14 فبراير 2026','Feb 14, 2026',9],
  ['ثقة لحلول الأعمال','Thiqa Business Solutions','thiqa.example','ث','TB','av-amber','Starter','cancelled',4,0,'2 يونيو 2026','Jun 2, 2026',1],
  ['أفق الرقمية','Ofoq Digital','ofoq-digital.example','أ','OD','av-violet','Starter','trial',5,0,'20 نوفمبر 2026','Nov 20, 2026',1]
];
window.GL_PLAN_TAG = { Starter: 'neutral', Growth: 'brand', Enterprise: 'violet' };
window.GL_STATUS = {
  active: ['success', 'نشطة', 'Active'],
  trial: ['info', 'تجريبية', 'Trial'],
  pastdue: ['warning', 'متأخرة الدفع', 'Past due'],
  cancelled: ['danger', 'ملغاة', 'Cancelled']
};

/* Company workspace demo data (NileSoft Solutions) */
window.GL_TEAM = {
  // key: [ar, en, arInitial, enInitials, avatarClass, roleKey]
  as: ['أحمد سامي', 'Ahmed Samy', 'أ', 'AS', 'av-solid', 'owner'],
  ma: ['منى عادل', 'Mona Adel', 'م', 'MA', 'av-teal', 'pm'],
  ok: ['عمر خالد', 'Omar Khaled', 'ع', 'OK', 'av-blue', 'pm'],
  rf: ['رنا فتحي', 'Rana Fathy', 'ر', 'RF', 'av-violet', 'pm'],
  me: ['محمود عز', 'Mahmoud Ezz', 'م', 'ME', 'av-amber', 'consultant'],
  yt: ['ياسمين طارق', 'Yasmin Tarek', 'ي', 'YT', 'av-teal', 'consultant'],
  ha: ['حسام علي', 'Hossam Ali', 'ح', 'HA', 'av-blue', 'consultant'],
  dm: ['دينا مجدي', 'Dina Magdy', 'د', 'DM', 'av-violet', 'consultant']
};
window.GL_PHASES = [['الاكتشاف', 'Discovery'], ['التصميم', 'Design'], ['البناء', 'Build'], ['ترحيل البيانات', 'Data migration'], ['اختبار القبول', 'UAT'], ['الإطلاق', 'Go-live']];
window.GL_HEALTH = { ok: ['success', 'في المسار', 'On track'], risk: ['warning', 'معرّض للتأخير', 'At risk'], blocked: ['danger', 'متوقف', 'Blocked'], kick: ['info', 'بدأ حديثًا', 'Kick-off'], done: ['neutral', 'مكتمل', 'Completed'] };
window.GL_PROJECTS = [
  // ar, en, client ar, client en, client initial ar, en, av, phaseIdx, pct, go-live ar, en, health, pm, [approvals, requirements, blockers], value
  ['تطبيق Odoo ERP', 'Odoo ERP rollout', 'مصنع النور للبلاستيك', 'Al Nour Plastics', 'ن', 'AN', 'av-teal', 4, 72, '15 ديسمبر', 'Dec 15', 'ok', 'ma', [2, 4, 1], '$48,000'],
  ['ترحيل بيانات المخازن', 'Inventory migration', 'دلتا للتوزيع', 'Delta Distribution', 'د', 'DD', 'av-blue', 3, 55, '2 يناير', 'Jan 2', 'blocked', 'ok', [1, 2, 2], '$22,500'],
  ['Odoo CRM', 'Odoo CRM', 'الريادة الطبية', 'Riyada Medical', 'ر', 'RM', 'av-violet', 1, 30, '20 يناير', 'Jan 20', 'risk', 'rf', [3, 7, 1], '$18,000'],
  ['بوابة الموارد البشرية', 'HR portal', 'الأمل للمقاولات', 'Al Amal Contracting', 'أ', 'AA', 'av-amber', 5, 95, '28 نوفمبر', 'Nov 28', 'ok', 'ma', [1, 0, 0], '$15,600'],
  ['نقاط البيع POS', 'Odoo POS rollout', 'سوق فريش', 'Souq Fresh', 'س', 'SF', 'av-teal', 2, 48, '10 يناير', 'Jan 10', 'ok', 'rf', [0, 3, 0], '$26,000'],
  ['النظام المحاسبي', 'Accounting suite', 'كيان القابضة', 'Kayan Holding', 'ك', 'KH', 'av-blue', 1, 12, '18 فبراير', 'Feb 18', 'kick', 'ok', [2, 9, 0], '$31,000'],
  ['تخطيط التصنيع MRP', 'Manufacturing MRP', 'أوربت للصلب', 'Orbit Steel', 'أ', 'OS', 'av-violet', 0, 8, '3 مارس', 'Mar 3', 'kick', 'me', [0, 12, 0], '$54,000']
];
