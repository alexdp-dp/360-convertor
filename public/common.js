const folderPages=[
  ['/', 'home','Dosar','fa-folder-open'],['/unitati-de-masura','units','Unități','fa-ruler-combined'],['/randomizare','random','Random','fa-shuffle'],['/zaruri','dice','Zaruri','fa-dice'],['/convertor-valutar','money','Valutar','fa-money-bill-transfer'],['/calculatoare','calc','Calculatoare','fa-calculator'],['/data-si-timp','date','Dată și timp','fa-clock'],['/liste','lists','Liste','fa-list-check'],['/text','words','Text','fa-font'],['/culori','colors','Culori','fa-palette'],['/generatoare','generate','Generatoare','fa-wand-magic-sparkles'],['/dimensiuni','sizes','Dimensiuni','fa-crop-simple']
];
function setActiveTab() {
  const route = location.pathname.replace(/\/$/, '') || '/'; const nav=document.querySelector('.folder-tabs'); if(!nav)return;
  nav.innerHTML=folderPages.map(([url,cls,label,icon],i)=>`<a class="folder-tab ${cls}${url===route?' active':''}" href="${url}" style="--i:${i}" title="${label}"><i class="fa-solid ${icon}"></i><span>${label}</span></a>`).join('');
  if(route==='/'){const grid=document.querySelector('.tool-grid');if(grid)grid.innerHTML=folderPages.slice(1).map(([url,cls,label,icon])=>`<a class="tool-card ${cls}" href="${url}"><i class="fa-solid ${icon}"></i><div><strong>${label}</strong><br><small>Deschide instrumentele</small></div></a>`).join('')}
  const active=nav.querySelector('.active'); if(active)setTimeout(()=>active.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}),80);
}
function formatNumber(value, digits = 8) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('ro-RO', { maximumFractionDigits: digits }).format(value);
}
document.addEventListener('DOMContentLoaded',()=>{setActiveTab();setTimeout(()=>document.querySelectorAll('[data-help]').forEach(btn=>{if(btn.dataset.ready)return;btn.dataset.ready='1';const bubble=document.createElement('span');bubble.className='help-bubble';bubble.textContent=btn.dataset.help;btn.parentElement.style.position='relative';btn.parentElement.append(bubble);btn.addEventListener('click',e=>{e.preventDefault();bubble.classList.toggle('show')});btn.addEventListener('mouseenter',()=>bubble.classList.add('show'));btn.addEventListener('mouseleave',()=>bubble.classList.remove('show'))}),0)});
