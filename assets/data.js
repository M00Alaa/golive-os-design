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
