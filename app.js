const suppliers = [
  {id:1,name:"مؤسسة الأفق لمواد البناء",initial:"أ",category:"الإسمنت والخرسانة",wilaya:"الجزائر",products:["إسمنت","خرسانة جاهزة","رمل"],desc:"مورد لمواد البناء ومستلزمات المشاريع."},
  {id:2,name:"شركة الريادة للحديد",initial:"ر",category:"حديد البناء",wilaya:"سطيف",products:["حديد تسليح","شبكات حديدية"],desc:"توريد منتجات الحديد لمشاريع البناء."},
  {id:3,name:"مواد البناء الحديثة",initial:"م",category:"الآجر والبلوك",wilaya:"وهران",products:["آجر","بلوك","طوب"],desc:"مواد بناء متنوعة للمشاريع السكنية والتجارية."},
  {id:4,name:"التجهيز المتكامل",initial:"ت",category:"الكهرباء والسباكة",wilaya:"قسنطينة",products:["كابلات","أنابيب"],desc:"مستلزمات الكهرباء والسباكة للمباني."},
  {id:5,name:"لمسة للبناء والتشطيب",initial:"ل",category:"التشطيبات",wilaya:"البليدة",products:["بلاط","دهان","عزل"],desc:"منتجات التشطيب والعزل للمنازل والمشاريع."},
  {id:6,name:"الخرسانة المتينة",initial:"خ",category:"الإسمنت والخرسانة",wilaya:"باتنة",products:["إسمنت","خرسانة"],desc:"حلول الخرسانة وموادها لمختلف الاحتياجات."}
];
let category = "";
const $ = selector => document.querySelector(selector);

// Add an accessible theme switch beside the mobile menu control.
const themeKey = "souqna_the2";
const themeBtn = document.createElement("button");
themeBtn.id = "themeBtn";
themeBtn.type = "button";
themeBtn.setAttribute("aria-label", "تفعيل الوضع الليلي");
themeBtn.innerHTML = "🌙";
$("#menuBtn").insertAdjacentElement("beforebegin", themeBtn);

const darkStyles = document.createElement("style");
darkStyles.textContent = `
#themeBtn{display:inline-grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid #dfe4e8;border-radius:8px;background:transparent;color:inherit;font-size:21px;line-height:1;cursor:pointer;flex:none}
#themeBtn:hover{background:#f0f2f4}#themeBtn:focus-visible{outline:2px solid #d5a64a;outline-offset:2px}
body.dark{--paper:#0f1420;--ink:#e6ebf2;--muted:#a5b0c0;background:#0f1420;color:#e6ebf2;color-scheme:dark}
body.dark header,body.dark nav,body.dark .search,body.dark .cat,body.dark .card,body.dark .empty,body.dark .request form,body.dark .join{background:#1a2233;color:#e6ebf2;border-color:#303b50}
body.dark .topline{background:#111a2a;color:#cbd5e1}
body.dark .heading h2,body.dark .search h2,body.dark .card h3,body.dark .steps h3,body.dark .join h2,body.dark .cat b{color:#e6ebf2}
body.dark .hero{background:#0f1420;color:#e6ebf2}body.dark .hero p,body.dark .heading p,body.dark .steps p,body.dark .join p{color:#a5b0c0}
body.dark .cat.selected,body.dark .cat:hover{background:#263248}
body.dark .avatar{background:#29364d;color:#e6ebf2}
body.dark input,body.dark select,body.dark textarea{background:#111a2a;color:#e6ebf2;border-color:#3a465b}
body.dark input::placeholder,body.dark textarea::placeholder{color:#8996aa}
body.dark .cardbottom{border-color:#303b50}body.dark .join{background:#172236}
body.dark .meta,body.dark .desc,body.dark .steps p,body.dark .join p,body.dark .heading p{color:#a5b0c0}
body.dark .steps article{border-color:#303b50}body.dark .empty{color:#e6ebf2}
body.dark nav.open{background:#1a2233}body.dark #themeBtn:hover{background:#263248}
@media(max-width:620px){#themeBtn{width:38px;height:38px;margin-inline-start:auto;margin-inline-end:8px}body.dark nav{background:#1a2233}}
`;
document.head.append(darkStyles);

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0f1420" : "#102b3f");
}
try { applyTheme(localStorage.getItem(themeKey) === "dark"); } catch { applyTheme(false); }
themeBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  try { localStorage.setItem(themeKey, isDark ? "dark" : "light"); } catch {}
});
const topline = $(".topline");
if (topline && !topline.textContent.includes("🇩🇿")) topline.prepend(document.createTextNode("🇩🇿 "));

function render() {
  const q = $("#q").value.trim().toLocaleLowerCase("ar"), w = $("#wilaya").value;
  const found = suppliers.filter(s => (!q || [s.name,s.category,s.wilaya,...s.products].join(" ").toLocaleLowerCase("ar").includes(q)) && (!w || s.wilaya === w) && (!category || s.category === category));
  $("#cards").innerHTML = found.map(s => `<article class="card"><div class="cardtop"><span class="avatar">${s.initial}</span><span class="demo">بيانات تجريبية</span></div><h3>${s.name}</h3><span class="kind">${s.category}</span><p class="meta">📍 ${s.wilaya} · ${s.products.join(" · ")}</p><p class="desc">${s.desc}</p><div class="cardbottom"><span>متاح لتلبية احتياجاتك</span><button data-id="${s.id}">اطلب عرض سعر ⟵</button></div></article>`).join("");
  $("#count").textContent = found.length + " نتائج تجريبية";
  $("#empty").hidden = found.length > 0;
  $("#cards").hidden = !found.length;
}
$("#searchForm").addEventListener("submit", e => { e.preventDefault(); render(); $("#suppliers").scrollIntoView({behavior:"smooth"}); });
$("#q").addEventListener("input", render);
$("#wilaya").addEventListener("change", render);
document.querySelectorAll(".cat").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".cat").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected"); category = button.dataset.cat; render();
}));
$("#reset").addEventListener("click", () => {
  $("#q").value = ""; $("#wilaya").value = ""; category = "";
  document.querySelectorAll(".cat").forEach(item => item.classList.toggle("selected", !item.dataset.cat)); render();
});
$("#cards").addEventListener("click", e => {
  const button = e.target.closest("[data-id]"); if (!button) return;
  $("#request").scrollIntoView({behavior:"smooth"});
  $('textarea[name="details"]').value = "أرغب في عرض سعر من: " + suppliers.find(s => s.id === +button.dataset.id).name;
});
$("#rfq").addEventListener("submit", e => {
  e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); data.createdAt = new Date().toISOString();
  try { const all = JSON.parse(localStorage.getItem("bunyan_demo_rfqs") || "[]"); all.push(data); localStorage.setItem("bunyan_demo_rfqs", JSON.stringify(all)); $("#feedback").textContent = "تم استلام طلبك التجريبي بنجاح."; e.currentTarget.reset(); }
  catch { $("#feedback").textContent = "تعذر حفظ الطلب في هذا المتصفح."; }
});
$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));
$("#nav").querySelectorAll("a").forEach(a => a.addEventListener("click", () => $("#nav").classList.remove("open")));
$("#year").textContent = new Date().getFullYear();
render();
