// interaction states for screenshots: [url, js-to-run]
module.exports = {
  'companies-add': ['companies.html?open=add'],
  'companies-add-invalid': ['companies.html?open=add&validate=1'],
  'companies-menu': ['companies.html?menu=2'],
  'companies-filter': ['companies.html?tab=st:trial'],
  'companies-noresults': ['companies.html', "(()=>{const i=document.querySelector('[data-search]');i.value='zzz';i.dispatchEvent(new Event('input',{bubbles:true}))})()"],
  'companies-delete': ['companies.html', "(()=>{document.querySelectorAll('[data-menu]')[0].click();setTimeout(()=>[...document.querySelectorAll('.menu-i')].pop().click(),50)})()"],
  'companies-toast': ['companies.html?toast=1'],
};
Object.assign(module.exports, {
  'c360-users': ['company-360.html?tab=c360:users'],
  'c360-projects': ['company-360.html?tab=c360:projects'],
  'c360-billing': ['company-360.html?tab=c360:billing'],
  'c360-support': ['company-360.html?tab=c360:support'],
  'c360-activity': ['company-360.html?tab=c360:activity'],
  'c360-refund': ['company-360.html?tab=c360:billing', "(()=>{document.querySelectorAll('[data-menu=inv]')[2].click();setTimeout(()=>[...document.querySelectorAll('.menu-i')].pop().click(),50)})()"],
});
Object.assign(module.exports, {
  'plans-annual': ['plans.html?tab=cycle:y'],
  'plans-edit': ['plans.html', "document.querySelectorAll('[data-menu=plan]')[1].click();setTimeout(()=>document.querySelector('.menu-i').click(),50)"],
  'plans-coupon': ['plans.html?open=coupon'],
  'billing-subs': ['billing.html?tab=bt:subs', 'window.scrollTo(0,9999)'],
  'billing-failed': ['billing.html?tab=bt:failed', 'window.scrollTo(0,9999)'],
  'billing-invoice': ['billing.html', "document.querySelector('[data-open=invoice]').click()"],
  'billing-refund': ['billing.html', "document.querySelector('[data-open=invoice]').click();setTimeout(()=>document.querySelector('.ovl [data-open=refund]').click(),100)"],
});
Object.assign(module.exports, {
  'support-view': ['support.html?tab=sv:un'],
  'support-new': ['support.html?open=ticket&validate=1'],
  'ticket-sent': ['support-ticket.html', "(()=>{document.querySelector('[data-menu=macros]').click();setTimeout(()=>{document.querySelector('.menu-i').click();document.querySelector('[data-file]').click();document.querySelector('[data-send]').click();window.scrollTo(0,9999)},80)})()"],
  'ticket-note': ['support-ticket.html?tab=cmp:note', "(()=>{const t=document.querySelector('[data-composer] textarea');t.value='Checked with engineering — fix ships at 6 PM.';document.querySelector('[data-send]').click();window.scrollTo(0,9999)})()"],
  'ticket-reassign': ['support-ticket.html?open=reassign'],
});
Object.assign(module.exports, {
  'audit-filter': ['audit-log.html', "(()=>{const s=document.querySelector('[data-col-filter][data-key=actor]');s.value='MA';s.dispatchEvent(new Event('change',{bubbles:true}))})()"],
  'audit-event': ['audit-log.html', "document.querySelector('tr[data-open=event]').click()"],
  'settings-brand': ['settings.html?tab=set:brand'],
  'settings-billing': ['settings.html?tab=set:billing'],
  'settings-email': ['settings.html?tab=set:email'],
  'settings-security': ['settings.html?tab=set:security'],
  'settings-int': ['settings.html?tab=set:int'],
  'settings-api': ['settings.html?tab=set:api'],
  'settings-danger': ['settings.html?tab=set:danger'],
  'settings-key': ['settings.html?tab=set:api&open=key'],
  'settings-tpl': ['settings.html?tab=set:email', "document.querySelector('[data-open=tpl]').click()"],
});
Object.assign(module.exports, {
  'staff-invite': ['staff.html?open=invite'],
  'staff-filter': ['staff.html', "(()=>{const s=document.querySelector('[data-col-filter]');s.value='support';s.dispatchEvent(new Event('change',{bubbles:true}))})()"],
  'staff-newrole': ['staff.html?open=newrole'],
});
Object.assign(module.exports, {
  'wsp-board': ['ws-projects.html?tab=view:board'],
  'wsp-timeline': ['ws-projects.html?tab=view:timeline'],
  'wsp-attn': ['ws-projects.html?tab=pst:attn'],
  'wsp-new': ['ws-projects.html?open=new'],
});
Object.assign(module.exports, {
  'prj-req': ['ws-project.html?tab=prj:req'],
  'prj-appr': ['ws-project.html?tab=prj:appr'],
  'prj-tasks': ['ws-project.html?tab=prj:tasks'],
  'prj-risks': ['ws-project.html?tab=prj:risks'],
  'prj-files': ['ws-project.html?tab=prj:files'],
  'prj-activity': ['ws-project.html?tab=prj:activity'],
  'prj-update': ['ws-project.html?open=update'],
  'prj-newreq': ['ws-project.html?tab=prj:req&open=req'],
  'prj-rqedit': ['ws-project.html?tab=prj:req', "document.querySelectorAll('[data-menu=rq]')[2].click();setTimeout(()=>document.querySelector('.menu-i').click(),50)"],
  'prj-upload': ['ws-project.html?tab=prj:files&open=upload'],
});
Object.assign(module.exports, {
  'clients-new': ['ws-clients.html?open=new'],
  'clients-import': ['ws-clients.html?open=import'],
  'clients-view': ['ws-clients.html', "document.querySelector('[data-open=view]').click()"],
  'team-pending': ['ws-team.html?tab=tm:pending'],
  'team-guests': ['ws-team.html?tab=tm:guests'],
  'team-invite': ['ws-team.html?open=invite'],
});
Object.assign(module.exports, {
  'tpl-lib': ['ws-templates.html?tab=tps:lib'],
  'tpl-new': ['ws-templates.html?open=new'],
  'wset-brand': ['ws-settings.html?tab=wset:brand'],
  'wset-defaults': ['ws-settings.html?tab=wset:defaults'],
  'wset-notif': ['ws-settings.html?tab=wset:notif'],
  'wset-int': ['ws-settings.html?tab=wset:int'],
  'wset-billing': ['ws-settings.html?tab=wset:billing'],
  'wset-danger': ['ws-settings.html?tab=wset:danger'],
  'wset-odoo': ['ws-settings.html?tab=wset:int&open=odoo&validate=1'],
});
