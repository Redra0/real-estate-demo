const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {properties:P,photos:PHOTOS}=window.PROPERTY_DATA;
const PHOTO=(id,alt,loading="lazy")=>`<img src="https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82" alt="${alt}" loading="${loading}" decoding="async">`;
$("#heroArt").innerHTML=PHOTO("photo-1600585154340-be6161a56a0c","Photograph of a contemporary home exterior","eager");
$("#areaArt").innerHTML=PHOTO("photo-1600607687939-ce8a6c25118c","Illustrative photograph of a light-filled home interior");

let mode="buy",showAll=false,filtered=false,saved=new Set();
const fmt=p=>"£"+p.toLocaleString("en-GB");
const price=p=>p.m==="rent"?fmt(p.p)+" pcm":fmt(p.p);
function filters(){const v=id=>$(id).value.trim();return{loc:v("#loc").toLowerCase(),k:v("#kind"),min:+v("#min")||0,max:+v("#max")||Infinity,b:+v("#beds")}}
function render(){
 const f=filters(),active=filtered;
 let list=P.filter(p=>p.m===mode&&(!f.loc||(p.loc+" "+p.t).toLowerCase().includes(f.loc))&&(!f.k||p.k===f.k)&&p.p>=f.min&&p.p<=f.max&&p.b>=f.b);
 const total=list.length;if(!showAll&&!active)list=list.slice(0,4);
 $("#count").textContent=total?`Showing ${list.length} of ${total} fictional demo listings.`:"";
 $("#all").hidden=active||total<=4||showAll;
 $("#grid").innerHTML=total?list.map(p=>`<article class="card"><div class="ph">${PHOTO(PHOTOS[p.id],`Illustrative property photograph for ${p.t}`)}<span class="badge">${p.badge}</span><span class="demo">Fictional demo listing</span><button class="save" data-save="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="${saved.has(p.id)?"Remove":"Save"} ${p.t}">${saved.has(p.id)?"♥":"♡"}</button></div><div class="cb"><div class="price">${price(p)}</div><h3>${p.t}</h3><div class="meta">${p.loc}</div><div class="meta">${p.b} bed · ${p.ba} bath · ${p.k}</div><button class="btn" data-view="${p.id}">View property</button></div></article>`).join(""):`<div class="empty"><h3>No properties match these filters</h3><p class="meta">Try a wider budget, fewer bedrooms or a different area.</p><button class="btn" data-reset>Reset filters</button></div>`;
 $("#savedN").textContent=saved.size?`${saved.size} saved`:"";
}
function setMode(m){if(mode!==m){$("#sf").reset();filtered=false;showAll=false;$("#serr").textContent=""}mode=m;$$('.tabs button').forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===m));$("#minLabel").textContent=m==="rent"?"Minimum rent (£/month)":"Minimum price (£)";$("#maxLabel").textContent=m==="rent"?"Maximum rent (£/month)":"Maximum price (£)";$("#min").placeholder=m==="rent"?"Min per month":"No min";$("#max").placeholder=m==="rent"?"Max per month":"No max"}

function reset(){
    $("#sf").reset();
    resetState();
}
function resetState(){
    filtered=false;
    showAll=false;
    $("#serr").textContent="";
    render()
}
$$(".tabs button").forEach(b=>b.onclick=()=>{setMode(b.dataset.mode);showAll=false;render()});
$$("[data-mode]:not(.tabs button)").forEach(a=>a.addEventListener("click",()=>{setMode(a.dataset.mode);showAll=false;render();closeMenu()}));
$("#sf").onsubmit=e=>{e.preventDefault();const f=filters();
 if(f.max<f.min){$("#serr").textContent="Maximum price should be higher than the minimum price.";return}
 $("#serr").textContent="";filtered=!!(f.loc||f.k||f.min||f.max<Infinity||f.b);showAll=true;render();$("#properties").scrollIntoView()};
$("#sf").onreset=()=>setTimeout(resetState,0);
$("#all").onclick=()=>{showAll=true;render()};
document.addEventListener("click",e=>{const t=e.target.closest("[data-save],[data-view],[data-reset],[data-form],[data-close]");if(!t)return;
 if(t.dataset.save){const id=+t.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);render();const popupSave=$(`#pdb [data-save="${id}"]`);if(popupSave){popupSave.setAttribute("aria-pressed",saved.has(id));popupSave.textContent=saved.has(id)?"Saved ♥":"Save property ♡"}const focusTarget=$("#pd").open?(popupSave||t):$(`[data-save="${id}"]`);focusTarget?.focus()}
 else if(t.dataset.view)openP(+t.dataset.view);
 else if("reset" in t.dataset)reset();
 else if(t.dataset.form){$("#pd").close();openF(t.dataset.form)}
 else t.closest("dialog").close()});
function openP(id){const p=P.find(x=>x.id===id);
 $("#pdb").innerHTML=`<div class="dtop"><div><span class="meta">Fictional demo listing — all details are invented</span><h2 id="pdt" style="font-size:2rem;margin:4px 0 0">${p.t}</h2></div><button class="x" data-close aria-label="Close">✕</button></div><div class="ph" style="border-radius:10px;overflow:hidden;margin-top:14px">${PHOTO(PHOTOS[p.id],`Illustrative property photograph for ${p.t}`)}</div><div class="facts"><span class="price">${price(p)}</span><span>${p.b} bedrooms</span><span>${p.ba} bathrooms</span><span>${p.k}</span></div><p class="meta">${p.loc}</p><p>${p.d}</p><div class="row"><button class="btn" data-form="Arrange a viewing: ${p.t}">Arrange a viewing</button><button class="btn ghost" data-save="${p.id}" aria-pressed="${saved.has(p.id)}">${saved.has(p.id)?"Saved ♥":"Save property ♡"}</button></div>`;
 $("#pd").showModal()}
function openF(title){const [h,...c]=title.split(": ");$("#fdt").textContent=h;$("#fctx").textContent=c.length?`About: ${c.join(": ")}. Fields marked * are required.`:"Fields marked * are required.";
 $("#ef").hidden=false;$("#done").hidden=true;$("#ef").reset();$("#en").textContent=$("#ee").textContent="";[ $("#n"),$("#e") ].forEach(input=>input.removeAttribute("aria-invalid"));$("#fd").showModal()}
function validateContactField(input){
 const isName=input.id==="n",value=input.value.trim();
 const valid=isName?value.length>0:value.length>0&&input.validity.valid;
 const error=isName?$("#en"):$("#ee");
 error.textContent=valid?"":isName?"Enter your name so the team knows who to contact.":"Enter a valid email address, such as name@example.com.";
 input.setAttribute("aria-invalid",String(!valid));
 return valid
}
$("#ef").addEventListener("input",e=>{
 if(e.target.matches("#n[aria-invalid],#e[aria-invalid]"))validateContactField(e.target)
});
$("#ef").onsubmit=e=>{e.preventDefault();
 const nameValid=validateContactField($("#n")),emailValid=validateContactField($("#e"));
 if(!nameValid||!emailValid){(!nameValid?$("#n"):$("#e")).focus();return}
 $("#ef").hidden=true;$("#done").hidden=false
};
$("#pd").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
$("#fd").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
const bg=$("#burger"),lk=$("#links");
function closeMenu(){lk.classList.remove("open");bg.setAttribute("aria-expanded","false");bg.textContent="Menu"}
window.matchMedia("(min-width: 768px)").addEventListener("change",e=>{if(e.matches&&lk.classList.contains("open"))closeMenu()});
bg.onclick=()=>{const o=lk.classList.toggle("open");bg.setAttribute("aria-expanded",o);bg.textContent=o?"Close":"Menu"};
lk.addEventListener("click",e=>{if(e.target.closest("a,button"))closeMenu()});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const dialog=$("dialog[open]");if(dialog){e.preventDefault();dialog.close();return}if(lk.classList.contains("open")){closeMenu();bg.focus()}});
render();
