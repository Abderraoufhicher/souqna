const suppliers=[
{id:1,name:"مؤسسة الأفق لمواد البناء",initial:"أ",category:"الإسمنت والخرسانة",wilaya:"الجزائر",products:["إسمنت","خرسانة جاهزة","رمل"],desc:"مثال تجريبي لمورد متخصص في مواد البناء الأساسية وتوريد المشاريع."},
{id:2,name:"شركة الريادة للحديد",initial:"ر",category:"حديد البناء",wilaya:"سطيف",products:["حديد تسليح","شبكات حديدية"],desc:"مثال تجريبي لمورد حديد التسليح والمنتجات المعدنية."},
{id:3,name:"مواد البناء الحديثة",initial:"م",category:"الآجر والبلوك",wilaya:"وهران",products:["آجر","بلوك","طوب"],desc:"مثال تجريبي لمورد الآجر والبلوك ومواد البناء الهيكلية."},
{id:4,name:"التجهيز المتكامل",initial:"ت",category:"الكهرباء والسباكة",wilaya:"قسنطينة",products:["كابلات","أنابيب"],desc:"مثال تجريبي لتجهيزات الكهرباء والسباكة."},
{id:5,name:"لمسة للبناء والتشطيب",initial:"ل",category:"التشطيبات",wilaya:"البليدة",products:["بلاط","دهان","عزل"],desc:"مثال تجريبي لمواد التشطيب والعزل والطلاء."},
{id:6,name:"الخرسانة المتينة",initial:"خ",category:"الإسمنت والخرسانة",wilaya:"باتنة",products:["إسمنت","خرسانة"],desc:"مثال تجريبي لمنتجات الخرسانة ومواد البناء."}
];
let category="";
const $=s=>document.querySelector(s);
function render(){
 const q=$("#q").value.trim().toLocaleLowerCase("ar"),w=$("#wilaya").value;
 const found=suppliers.filter(s=>(!q||[s.name,s.category,s.wilaya,...s.products].join(" ").toLocaleLowerCase("ar").includes(q))&&(!w||s.wilaya===w)&&(!category||s.category===category));
 $("#cards").innerHTML=found.map(s=>`<article class="card"><div class="cardtop"><span class="avatar">${s.initial}</span><span class="demo">بيانات تجريبية</span></div><h3>${s.name}</h3><span class="kind">${s.category}</span><p class="meta">⌖ ${s.wilaya} · ${s.products.join(" · ")}</p><p class="desc">${s.desc}</p><div class="cardbottom"><span>ملف مورد تجريبي</span><button data-id="${s.id}">اطلب عرض سعر ←</button></div></article>`).join("");
 $("#count").textContent=found.length+" نتائج تجريبية";$("#empty").hidden=found.length>0;$("#cards").hidden=!found.length;
}
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();render();$("#suppliers").scrollIntoView({behavior:"smooth"})});
$("#q").addEventListener("input",render);$("#wilaya").addEventListener("change",render);
document.querySelectorAll(".cat").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".cat").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");category=b.dataset.cat;render()}));
$("#reset").addEventListener("click",()=>{$("#q").value="";$("#wilaya").value="";category="";document.querySelectorAll(".cat").forEach(x=>x.classList.toggle("selected",!x.dataset.cat));render()});
$("#cards").addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(!b)return;$("#request").scrollIntoView({behavior:"smooth"});$('textarea[name="details"]').value="أرغب في عرض سعر من: "+suppliers.find(s=>s.id===+b.dataset.id).name});
$("#rfq").addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));data.createdAt=new Date().toISOString();try{const all=JSON.parse(localStorage.getItem("bunyan_demo_rfqs")||"[]");all.push(data);localStorage.setItem("bunyan_demo_rfqs",JSON.stringify(all));$("#feedback").textContent="تم حفظ الطلب على هذا الجهاز فقط، ولم يُرسل إلى أي مورد.";e.currentTarget.reset()}catch{$("#feedback").textContent="تعذر الحفظ المحلي في هذا المتصفح."}});
$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("open"));$("#nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();render();
