const suppliers = [
  {id:1,name:"مؤسسة الأفق لمواد البناء",initial:"أ",category:"الإسمنت والخرسانة",wilaya:"الجزائر",products:["إسمنت","خرسانة جاهزة"]},
  {id:2,name:"شركة الريادة للحديد",initial:"ر",category:"حديد البناء",wilaya:"سطيف",products:["حديد تسليح","شبكات حديدية"]},
  {id:3,name:"مواد البناء الحديثة",initial:"م",category:"الآجر والبلوك",wilaya:"وهران",products:["آجر","بلوك"]},
  {id:4,name:"التجهيز المتكامل",initial:"ت",category:"الكهرباء والسباكة",wilaya:"قسنطينة",products:["كابلات","أنابيب"]},
  {id:5,name:"لمسة للبناء والتشطيب",initial:"ل",category:"التشطيبات",wilaya:"البليدة",products:["بلاط","دهان","عزل"]},
  {id:6,name:"الخرسانة المتينة",initial:"خ",category:"الإسمنت والخرسانة",wilaya:"باتنة",products:["إسمنت","خرسانة"]}
];
let category = "";
const $ = selector => document.querySelector(selector);
const themeBtn = $("#themeBtn");
const themeKey = "souqna_the2";

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0f1420" : "#102b3f");
}
try { applyTheme(localStorage.getItem(themeKey) === "dark"); } catch { applyTheme(false); }
themeBtn.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  try { localStorage.setItem(themeKey, dark ? "dark" : "light"); } catch {}
});

function render() {
  const q = $("#q").value.trim().toLocaleLowerCase("ar");
  const wilaya = $("#wilaya").value;
  const found = suppliers.filter(s => (!q || [s.name, s.category, s.wilaya, ...s.products].join(" ").toLocaleLowerCase("ar").includes(q)) && (!wilaya || s.wilaya === wilaya) && (!category || s.category === category));
  $("#cards").innerHTML = found.map(s => `<article class="card"><div class="cardtop"><span class="avatar">${s.initial}</span></div><h3>${s.name}</h3><span class="kind">${s.category}</span><p class="meta">📍 ${s.wilaya} · ${s.products.join(" · ")}</p><div class="cardbottom"><span>تواصل لطلب السعر</span><button type="button" data-id="${s.id}">اطلب عرض سعر</button></div></article>`).join("");
  $("#count").textContent = `${found.length} موردين`;
  $("#empty").hidden = found.length > 0;
  $("#cards").hidden = !found.length;
}
$("#searchForm").addEventListener("submit", event => { event.preventDefault(); render(); $("#suppliers").scrollIntoView({behavior:"smooth"}); });
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
$("#cards").addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  const supplier = suppliers.find(item => item.id === Number(button.dataset.id));
  $("#request").scrollIntoView({behavior:"smooth"});
  $('textarea[name="details"]').value = `أرغب في عرض سعر من: ${supplier.name}\n`;
});

// Persist the RFQ before the browser performs its normal POST to FormSubmit.
$("#rfq").addEventListener("submit", event => {
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  data.createdAt = new Date().toISOString();
  try {
    const all = JSON.parse(localStorage.getItem("bunyan_demo_rfqs") || "[]");
    all.push(data);
    localStorage.setItem("bunyan_demo_rfqs", JSON.stringify(all));
    $("#feedback").textContent = "حُفظ الطلب محليًا، جارٍ إرساله إلى بريد الموقع…";
  } catch {
    // Do not block delivery if browser storage is unavailable.
    $("#feedback").textContent = "تعذر الحفظ المحلي؛ جارٍ محاولة إرسال الطلب إلى بريد الموقع…";
  }
  // No preventDefault: the valid form continues to its configured FormSubmit action.
});

$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));
$("#nav").querySelectorAll("a").forEach(link => link.addEventListener("click", () => $("#nav").classList.remove("open")));
$("#year").textContent = new Date().getFullYear();
render();
