'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const readSet = (key, valid) => {
  try { const value=JSON.parse(localStorage.getItem(key)); return new Set(Array.isArray(value)?value.filter(id=>valid.has(id)):[]); }
  catch { return new Set(); }
};
const saved = readSet('dsn-fall-hearts-v1',new Set(PLACES.map(p=>p.id)));
const done = readSet('dsn-fall-dates-v1',new Set(DATES.map(p=>p.id)));
let category='all', onlySaved=false, currentPick=null, toastTimer;
function announce(message) {
  clearTimeout(toastTimer); $('toast').textContent=message; $('toast').classList.add('show');
  toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);
}
function persist(key, values) {
  try { localStorage.setItem(key,JSON.stringify([...values])); return true; }
  catch { announce('Saved for this visit. Browser storage is unavailable.'); return false; }
}
function normalize(value) { return value.normalize('NFKD').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
function renderPlaces(animate=false) {
  const query=normalize($('search').value);
  let places=PLACES.filter(p=>(category==='all'||p.category===category)&&(!onlySaved||saved.has(p.id))&&normalize(p.name+' '+p.note+' '+p.category).includes(query));
  const sort=$('sort').value;
  if(sort==='name') places.sort((a,b)=>a.name.localeCompare(b.name));
  if(sort==='rating'||sort==='low') places.sort((a,b)=>a.rating===null?1:b.rating===null?-1:(sort==='rating'?b.rating-a.rating:a.rating-b.rating));
  $('result-count').textContent=`${places.length} ${places.length===1?'place':'places'}${category==='all'?'':` · ${CATEGORIES[category].label}`}${onlySaved?' · saved with love':''}`;
  $('places-grid').innerHTML=places.map((p,i)=>{
    const cat=CATEGORIES[p.category];
    let tag=p.visits>1?`<span class="visit">${p.visits} visits ♡</span>`:p.rating>=10?'<span class="rating-tag">hall of fame ✧</span>':p.rating>8?'<span class="rating-tag">one to revisit</span>':p.rating!==null&&p.rating<=3?'<span class="rating-tag low">for the plot…</span>':'';
    return `<article class="place-card${animate?' enter':''}"${animate?` style="animation-delay:${Math.min(i,5)*18}ms"`:''}>
      <div class="card-top"><span class="category-label"><span aria-hidden="true">${cat.icon}</span>${cat.label}</span><button class="save-place" data-id="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="Save ${esc(p.name)}">${saved.has(p.id)?'♥':'♡'}</button></div>
      <h3>${esc(p.name)}${p.star?' <span class="star" aria-label="Starred in our list">★</span>':''}</h3>
      <p class="place-note">${esc(p.note)}</p>
      <div class="card-bottom">${p.rating===null?'<span class="rating unrated">Not rated yet</span>':`<span class="rating" aria-label="Rated ${p.rating} out of 10">${p.rating}<small>/10</small></span>`}${tag}</div>
    </article>`;
  }).join('');
  $('empty-state').hidden=places.length>0;
  $('empty-title').textContent=onlySaved&&!saved.size?'A little love goes a long way.':'No little memories here yet.';
  $('empty-copy').textContent=onlySaved&&!saved.size?'Tap a heart on a place to keep it here.':'Try another search, or start fresh.';
}
function updateCategory(next) {
  category=next;
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
}
function resetFilters() {
  updateCategory('all'); onlySaved=false; $('favorites-only').setAttribute('aria-pressed','false');
  $('search').value=''; $('sort').value='list'; renderPlaces(true);
}
document.querySelectorAll('[data-category]').forEach(button=>{
  const key=button.dataset.category;
  button.querySelector('span').textContent=key==='all'?PLACES.length:PLACES.filter(p=>p.category===key).length;
  button.addEventListener('click',()=>{updateCategory(key);renderPlaces(true);});
});
$('place-total').textContent=PLACES.length;
$('search').addEventListener('input',()=>renderPlaces());
$('sort').addEventListener('change',()=>renderPlaces(true));
$('favorites-only').addEventListener('click',()=>{onlySaved=!onlySaved;$('favorites-only').setAttribute('aria-pressed',String(onlySaved));renderPlaces(true);});
$('reset').addEventListener('click',()=>{resetFilters();$('search').focus();});
$('places-grid').addEventListener('click',event=>{
  const button=event.target.closest('[data-id]'); if(!button) return;
  const id=button.dataset.id;
  if(saved.has(id)) saved.delete(id); else saved.add(id);
  const persisted=persist('dsn-fall-hearts-v1',saved);
  if(onlySaved) {
    const buttons=[...$('places-grid').querySelectorAll('[data-id]')], index=buttons.indexOf(button);
    renderPlaces();
    const remaining=$('places-grid').querySelectorAll('[data-id]');
    (remaining[Math.min(index,remaining.length-1)]||$('favorites-only')).focus();
  } else {button.setAttribute('aria-pressed',String(saved.has(id)));button.textContent=saved.has(id)?'♥':'♡';}
  if(persisted) announce(saved.has(id)?'A little favorite, saved ♡':'Removed from your saved places');
});
document.querySelectorAll('[data-find]').forEach(button=>button.addEventListener('click',()=>{
  resetFilters();$('search').value=button.dataset.find;renderPlaces(true);$('little-book').scrollIntoView();$('search').focus({preventScroll:true});
}));
function renderDates() {
  $('date-items').innerHTML=DATES.map(d=>`<label class="date-item"><input type="checkbox" value="${d.id}" ${done.has(d.id)?'checked':''}><span><strong>${esc(d.name)}</strong><small>${esc(d.note)}</small></span><span class="date-emoji" aria-hidden="true">${d.icon}</span></label>`).join('');
  updateProgress();
}
function updateProgress() { $('date-progress').textContent=`${done.size} / ${DATES.length}`; }
$('date-items').addEventListener('change',event=>{
  const input=event.target; if(input.type!=='checkbox') return;
  if(input.checked) done.add(input.value); else done.delete(input.value);
  updateProgress();
  if(persist('dsn-fall-dates-v1',done)) announce(input.checked?'Another little memory, made ♡':'Back on the someday-soon list');
});
function chooseDate() {
  const available=DATES.filter(d=>!done.has(d.id));
  if(!available.length) {
    currentPick=null; $('picked-icon').textContent='♡';$('picked-name').textContent='A whole chapter of memories.';
    $('picked-note').textContent='You’ve checked off all six. Uncheck a date to do it all over again.';$('repick').disabled=true;
    return;
  }
  const pool=available.length>1?available.filter(d=>d.id!==currentPick):available;
  const pick=pool[Math.floor(Math.random()*pool.length)];currentPick=pick.id;
  $('picked-icon').textContent=pick.icon;$('picked-name').textContent=pick.name;$('picked-note').textContent=pick.note;
  $('repick').disabled=available.length<2;
}
function openDateJar() {chooseDate();$('date-dialog').showModal();}
$('pick-date').addEventListener('click',openDateJar);
$('pick-date-bottom').addEventListener('click',openDateJar);
$('repick').addEventListener('click',chooseDate);
$('close-date').addEventListener('click',()=>$('date-dialog').close());
$('date-dialog').addEventListener('click',event=>{if(event.target===$('date-dialog')){const b=event.target.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)event.target.close();}});
$('see-list').addEventListener('click',()=>{$('date-dialog').close();$('date-list').scrollIntoView();$('pick-date-bottom').focus({preventScroll:true});});
function unlock() {$('gate').close();$('site').inert=false;$('password').value='';$('gate-error').textContent='';}
function lock() {
  try {sessionStorage.removeItem('dsn-unlocked');} catch {}
  $('date-dialog').close();$('site').inert=true;clearTimeout(toastTimer);$('toast').classList.remove('show');$('toast').textContent='';
  $('gate').showModal();$('password').focus();
}
$('lock').addEventListener('click',lock);
$('lock-footer').addEventListener('click',lock);
$('gate').addEventListener('cancel',event=>event.preventDefault());
$('gate').addEventListener('keydown',event=>{if(event.key==='Escape')event.preventDefault();});
$('gate-form').addEventListener('submit',event=>{
  event.preventDefault();
  if($('password').value.trim().toLowerCase()==='dsn') {
    try {sessionStorage.setItem('dsn-unlocked','1');} catch {}
    unlock();document.querySelector('.hero-actions a').focus({preventScroll:true});
  } else {$('gate-error').textContent='Not quite, love. Try again.';$('password').value='';$('password').focus();}
});
window.addEventListener('storage',event=>{
  if(event.key==='dsn-fall-hearts-v1'||event.key===null){saved.clear();readSet('dsn-fall-hearts-v1',new Set(PLACES.map(p=>p.id))).forEach(id=>saved.add(id));renderPlaces();}
  if(event.key==='dsn-fall-dates-v1'||event.key===null){done.clear();readSet('dsn-fall-dates-v1',new Set(DATES.map(d=>d.id))).forEach(id=>done.add(id));renderDates();}
});
renderPlaces();renderDates();
let unlocked=false;try{unlocked=sessionStorage.getItem('dsn-unlocked')==='1';}catch{}
if(unlocked) unlock();else $('gate').showModal();
