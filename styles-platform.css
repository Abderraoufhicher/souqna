/* SOUQNA platform features. Requires Supabase JS v2 and supabase-config.js. */
(() => {
'use strict';
const cfg=window.SOUQNA_CONFIG||{};
const S={db:null,user:null,lang:document.documentElement.lang||'ar'};
const $=(q,r=document)=>r.querySelector(q);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=(a,f)=>S.lang==='fr'?f:a;
function toast(m){let x=$('#sqToast');if(!x){x=document.createElement('div');x.id='sqToast';x.className='sq-toast';document.body.append(x)}x.textContent=m;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2600)}
function mount(){
 if($('#sqPlatform'))return;
 const n=document.createElement('section');n.id='sqPlatform';n.className='sq-platform wrap';
 n.innerHTML=`<div class="sq-head"><div><span class="eyebrow small">SOUQNA · PLATFORM</span><h2>${ar('مركز خدمات سوقنا','Espace services SOUQNA')}</h2><p>${ar('التفاوض والثقة والقصص والمتاجر القريبة وتحليلات التاجر.','Négociation, confiance, stories, proximité et statistiques.')}</p></div><span class="sq-status" id="sqConn">${ar('يتطلب إعداد Supabase','Configuration Supabase requise')}</span></div>
 <div class="sq-auth"><div><b>${ar('حساب SOUQNA الموحد','Compte SOUQNA')}</b><small>${ar('تسجيل حقيقي ومزامنة بين الأجهزة بعد إعداد Supabase.','Connexion réelle et synchronisation après configuration Supabase.')}</small></div><form id="sqAuth"><input name="email" type="email" placeholder="Email" required><input name="password" type="password" minlength="8" placeholder="${ar('كلمة المرور','Mot de passe')}" required><button class="btn btn-dark">${ar('دخول / إنشاء','Connexion / Inscription')}</button></form><button id="sqOut" class="sq-link" hidden>${ar('خروج','Déconnexion')}</button></div>
 <div class="sq-tabs"><button class="active" data-tab="offers">${ar('التفاوض','Négociation')}</button><button data-tab="stories">${ar('القصص','Stories')}</button><button data-tab="nearby">${ar('بالقرب منك','À proximité')}</button><button data-tab="trust">${ar('الثقة','Confiance')}</button><button data-tab="analytics">${ar('التحليلات','Statistiques')}</button></div><div id="sqContent" class="sq-content"><div class="sq-empty">${ar('أكمل إعداد Supabase لتفعيل هذه الخدمات.','Configurez Supabase pour activer ces services.')}</div></div>`;
 ($('footer')||document.body).before(n);
 n.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;n.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.tab)});
 $('#sqAuth').onsubmit=login;
 $('#sqOut').onclick=async()=>{await S.db.auth.signOut();S.user=null;authState();$('#sqContent').innerHTML='<div class="sq-empty">Sign in to continue.</div>'};
}
function authState(){const f=$('#sqAuth'),o=$('#sqOut');if(!f)return;f.hidden=!!S.user;o.hidden=!S.user}
async function login(e){e.preventDefault();if(!S.db){toast(ar('بيانات Supabase غير مضبوطة بعد.','Supabase non configuré.'));return}
 const f=new FormData(e.currentTarget),email=f.get('email'),password=f.get('password');
 let r=await S.db.auth.signInWithPassword({email,password});
 if(r.error && /invalid login credentials/i.test(r.error.message))r=await S.db.auth.signUp({email,password});
 if(r.error){toast(r.error.message);return}S.user=r.data.user;await profile();authState();render('offers')}
async function profile(){if(!S.user)return;const {data}=await S.db.from('profiles').select('id').eq('id',S.user.id).maybeSingle();if(!data)await S.db.from('profiles').insert({id:S.user.id,full_name:S.user.email.split('@')[0],role:'individual'})}
function signed(){if(S.user)return true;toast(ar('سجّل الدخول أولاً.','Connectez-vous d’abord.'));return false}
async function init(){
 mount();
 if(!cfg.url||!cfg.anonKey||!window.supabase?.createClient)return;
 S.db=window.supabase.createClient(cfg.url,cfg.anonKey);
 const {data:{session}}=await S.db.auth.getSession();S.user=session?.user||null;
 S.db.auth.onAuthStateChange((_e,s)=>{S.user=s?.user||null;authState();if(S.user)profile()});
 $('#sqConn').textContent=ar('Supabase متصل','Supabase connecté');authState();
 if(S.user){await profile();render('offers')}
}
async function render(tab){
 const root=$('#sqContent');if(!S.db){root.innerHTML='<div class="sq-empty">Add your Supabase URL and anon key in supabase-config.js.</div>';return}
 if(!S.user){root.innerHTML=`<div class="sq-empty">${ar('سجّل الدخول لاستخدام ميزات المنصة.','Connectez-vous pour utiliser les services.')}</div>`;return}
 root.innerHTML='<div class="sq-loading">…</div>';
 if(tab==='offers')return offers(root);
 if(tab==='stories')return stories(root);
 if(tab==='nearby')return nearby(root);
 if(tab==='trust')return trust(root);
 if(tab==='analytics')return analytics(root);
}
async function offers(root){
 const {data:ps}=await S.db.from('products').select('id,name,price,store_id').eq('status','active').limit(60);
 const {data:os}=await S.db.from('negotiation_offers').select('id,offered_price,status,created_at,products(name)').order('created_at',{ascending:false}).limit(20);
 root.innerHTML=`<div class="sq-grid"><form id="sqOffer" class="sq-card"><h3>${ar('تقديم عرض تفاوض','Proposer un prix')}</h3><label>${ar('المنتج','Produit')}<select name="p" required><option value="">—</option>${(ps||[]).map(p=>`<option value="${p.id}" data-price="${p.price}" data-store="${p.store_id}">${esc(p.name)} · ${Number(p.price).toLocaleString()} DA</option>`).join('')}</select></label><label>${ar('الكمية','Quantité')}<input name="qty" type="number" min="1" value="1"></label><label>${ar('السعر المقترح بالدينار','Prix proposé en DZD')}<input name="price" type="number" min="0" step=".01" required></label><label>${ar('ملاحظة','Note')}<textarea name="note"></textarea></label><button class="btn btn-dark">${ar('إرسال العرض','Envoyer')}</button></form><div class="sq-card"><h3>${ar('سجل العروض','Historique')}</h3>${(os||[]).map(o=>`<div class="sq-row"><div><b>${esc(o.products?.name||'Product')}</b><small>${Number(o.offered_price).toLocaleString()} DA · ${esc(o.status)}</small></div></div>`).join('')||'—'}</div></div>`;
 $('#sqOffer').onsubmit=async e=>{e.preventDefault();if(!signed())return;const f=new FormData(e.currentTarget),opt=e.currentTarget.p.selectedOptions[0];const {error}=await S.db.from('negotiation_offers').insert({product_id:f.get('p'),store_id:opt.dataset.store,buyer_id:S.user.id,quantity:+f.get('qty'),listed_price:+opt.dataset.price,offered_price:+f.get('price'),buyer_note:f.get('note')});if(error){toast(error.message);return}toast(ar('تم إرسال العرض','Offre envoyée'));offers(root)}
}
async function stories(root){
 const {data:rows,error}=await S.db.from('store_stories').select('id,store_id,media_path,media_type,caption,expires_at,stores(name)').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false}).limit(40);
 if(error){root.textContent=error.message;return}
 root.innerHTML=`<form id="sqStory" class="sq-card sq-story-form"><h3>${ar('نشر قصة تختفي بعد 24 ساعة','Publier une story de 24 h')}</h3><input name="file" type="file" accept="image/*,video/*" required><input name="caption" maxlength="180" placeholder="${ar('وصف قصير','Légende courte')}"><button class="btn btn-dark">${ar('نشر','Publier')}</button></form><div class="sq-story-grid">${(rows||[]).map(s=>{const u=S.db.storage.from('store-assets').getPublicUrl(s.media_path).data.publicUrl;return `<article class="sq-story">${s.media_type==='video'?`<video controls playsinline src="${u}"></video>`:`<img loading="lazy" src="${u}" alt="">`}<b>${esc(s.stores?.name||'SOUQNA')}</b><small>${esc(s.caption||'')}</small></article>`}).join('')}</div>`;
 $('#sqStory').onsubmit=async e=>{e.preventDefault();if(!signed())return;let {data:store}=await S.db.from('stores').select('id').eq('owner_id',S.user.id).maybeSingle();if(!store){toast(ar('يجب إنشاء متجر أولاً.','Créez d’abord votre boutique.'));return}const file=e.currentTarget.file.files[0],path=store.id+'/'+Date.now()+'-'+file.name.replace(/[^a-z0-9._-]/gi,'_');let up=await S.db.storage.from('store-assets').upload(path,file);if(up.error){toast(up.error.message);return}let ins=await S.db.from('store_stories').insert({store_id:store.id,media_path:path,media_type:file.type.startsWith('video/')?'video':'image',caption:e.currentTarget.caption.value});if(ins.error){toast(ins.error.message);return}toast(ar('تم نشر القصة','Story publiée'));stories(root)}
}
async function nearby(root){
 const {data:stores,error}=await S.db.from('stores').select('id,name,category,wilaya,municipality,latitude,longitude,phone,whatsapp').limit(150);
 if(error){root.textContent=error.message;return}
 root.innerHTML=`<div class="sq-card"><h3>${ar('اكتشف المتاجر القريبة','Boutiques à proximité')}</h3><p class="sq-muted">${ar('يمكنك اختيار الولاية دون GPS. مشاركة موقعك اختيارية.','Filtrez par wilaya sans GPS. La géolocalisation est facultative.')}</p><div class="sq-inline"><select id="sqW"><option value="">${ar('كل الولايات','Toutes les wilayas')}</option>${[...new Set((stores||[]).map(s=>s.wilaya).filter(Boolean))].sort().map(w=>`<option>${esc(w)}</option>`).join('')}</select><button id="sqGPS" class="btn btn-outline-dark">${ar('استخدم موقعي','Utiliser ma position')}</button></div><div id="sqStores"></div></div>`;
 let pos=null;const km=(a,b,c,d)=>{const r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))};
 const draw=()=>{const w=$('#sqW').value;const list=(stores||[]).filter(s=>!w||s.wilaya===w).map(s=>({...s,d:pos&&s.latitude&&s.longitude?km(pos.lat,pos.lng,s.latitude,s.longitude):null})).sort((a,b)=>(a.d??1e9)-(b.d??1e9));$('#sqStores').innerHTML=list.map(s=>`<div class="sq-row"><div><b>${esc(s.name)}</b><small>${esc([s.category,s.municipality,s.wilaya].filter(Boolean).join(' · '))}${s.d!==null?' · '+s.d.toFixed(1)+' km':''}</small></div><div>${s.phone?`<a href="tel:${esc(s.phone)}">☎</a>`:''} ${s.whatsapp?`<a target="_blank" rel="noopener" href="https://wa.me/${String(s.whatsapp).replace(/\\D/g,'')}">WhatsApp</a>`:''}</div></div>`).join('')||'—'};
 $('#sqW').onchange=draw;$('#sqGPS').onclick=()=>navigator.geolocation?.getCurrentPosition(p=>{pos={lat:p.coords.latitude,lng:p.coords.longitude};draw()},()=>toast(ar('لم يتم السماح بالموقع.','Localisation refusée.')));draw()
}
async function trust(root){
 const {data,error}=await S.db.from('store_trust_summary').select('*').order('trust_score',{ascending:false}).limit(30);
 if(error){root.textContent=error.message;return}
 root.innerHTML=`<div class="sq-card"><h3>${ar('مؤشرات الثقة','Indicateurs de confiance')}</h3><p class="sq-muted">${ar('تُحسب من التقييمات والطلبات المكتملة ومعدل الرد، ولا يحررها التاجر بنفسه.','Calculés à partir des avis, commandes terminées et taux de réponse.')}</p>${(data||[]).map(x=>`<div class="sq-row"><div><b>${esc(x.store_id.slice(0,8))}…</b><small>★ ${Number(x.average_rating).toFixed(1)} · ${x.review_count} ${ar('تقييم','avis')} · ${x.completed_orders} ${ar('طلب مكتمل','commandes')}</small></div><strong>${Number(x.trust_score).toFixed(0)}/100</strong></div>`).join('')||'—'}</div>`
}
async function analytics(root){
 const {data:store}=await S.db.from('stores').select('id').eq('owner_id',S.user.id).maybeSingle();
 if(!store){root.innerHTML=`<div class="sq-card">${ar('أنشئ متجرك أولاً لعرض التحليلات.','Créez votre boutique pour voir les statistiques.')}</div>`;return}
 const {data:ps}=await S.db.from('products').select('id,name').eq('store_id',store.id),ids=(ps||[]).map(p=>p.id);
 let events=[];if(ids.length){const r=await S.db.from('product_events').select('event_type,product_id').in('product_id',ids).gte('created_at',new Date(Date.now()-30*864e5).toISOString());events=r.data||[]}
 const counts={view:0,contact:0,favorite:0,share:0};events.forEach(e=>counts[e.event_type]=(counts[e.event_type]||0)+1);
 const {count}=await S.db.from('market_orders').select('*',{count:'exact',head:true}).eq('store_id',store.id);
 root.innerHTML=`<div class="sq-metrics">${[['👁','view',ar('مشاهدات','Vues')],['☎','contact',ar('اتصالات','Contacts')],['♡','favorite',ar('مفضلة','Favoris')],['▣','orders',ar('طلبات','Commandes')]].map(x=>`<div class="sq-metric"><span>${x[0]}</span><b>${x[1]==='orders'?(count||0):counts[x[1]]}</b><small>${x[2]}</small></div>`).join('')}</div><div class="sq-card"><h3>${ar('أداء المنتجات','Performance produits')}</h3>${(ps||[]).map(p=>`<div class="sq-row"><b>${esc(p.name)}</b><span>${events.filter(e=>e.product_id===p.id&&e.event_type==='view').length} views</span></div>`).join('')||'—'}<button id="sqCSV" class="btn btn-outline-dark">${ar('تصدير CSV','Exporter CSV')}</button></div>`;
 $('#sqCSV').onclick=()=>{const csv=[['metric','value'],...Object.entries(counts),['orders',count||0]].map(x=>x.join(',')).join('\\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='souqna-analytics.csv';a.click();URL.revokeObjectURL(a.href)}
}
window.SOUQNAPlatform={refresh:()=>render('offers')};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
