const cfg=window.LOS_VERDIALES||{};
const hero=document.querySelector('#heroImage');
if(cfg.hero&&hero)hero.src=cfg.hero;

const strip=document.querySelector('#interiorStrip');
const interiors=cfg.interiors||[];
interiors.forEach((item,i)=>{
  const b=document.createElement('button');
  b.type='button';
  b.title=item.label||`Interior ${i+1}`;
  b.setAttribute('aria-label',item.label||`Interior ${i+1}`);
  b.innerHTML=`<img src="${item.src}" alt="${item.label||''}" loading="lazy">`;
  b.onclick=()=>{if(hero){hero.src=item.src;document.querySelector('#top').scrollIntoView({behavior:'smooth'});}};
  strip?.appendChild(b);
});
const count=document.querySelector('#interiorCount');
if(count)count.textContent=`${String(interiors.length).padStart(2,'0')} images`;

const gallery=document.querySelector('#exteriorGallery');
const section=document.querySelector('#exterior');
const exteriors=cfg.exterior||[];
if(exteriors.length&&section&&gallery){
  section.hidden=false;
  exteriors.forEach(x=>{
    const f=document.createElement('figure');
    f.innerHTML=`<img src="${x.src}" alt="${x.label||'Los Verdiales exterior'}" loading="lazy"><figcaption>${x.label||''}</figcaption>`;
    gallery.appendChild(f);
  });
}

const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav nav');
toggle?.addEventListener('click',()=>{
  const open=nav?.classList.toggle('open');
  toggle.textContent=open?'Close':'Menu';
});
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');if(toggle)toggle.textContent='Menu';}));