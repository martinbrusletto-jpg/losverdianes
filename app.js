const nav=document.querySelector('#nav');
const toggle=document.querySelector('.nav-toggle');
const menu=document.querySelector('.nav nav');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const setNav=()=>nav?.classList.toggle('scrolled',scrollY>28);
setNav();
addEventListener('scroll',setNav,{passive:true});

toggle?.addEventListener('click',()=>{
  const open=menu?.classList.toggle('open');
  toggle.textContent=open?'Close':'Menu';
  toggle.setAttribute('aria-expanded',String(Boolean(open)));
});

document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>{
  menu?.classList.remove('open');
  if(toggle){toggle.textContent='Menu';toggle.setAttribute('aria-expanded','false')}
}));

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

if(!reduced){
  const arrival=document.querySelector('[data-arrival]');
  const frameA=document.querySelector('.arrival-frame-a');
  const frameB=document.querySelector('.arrival-frame-b');
  const title=document.querySelector('[data-arrival-copy="0"]');
  const beat1=document.querySelector('[data-arrival-copy="1"]');
  const beat2=document.querySelector('[data-arrival-copy="2"]');
  const progressBar=document.querySelector('.arrival-progress span');
  const wellness=document.querySelector('[data-wellness]');
  const wellnessImage=document.querySelector('.wellness-sticky>img');
  const depthSections=[...document.querySelectorAll('[data-depth]')];

  let ticking=false;
  const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
  const invLerp=(a,b,v)=>clamp((v-a)/(b-a));

  const update=()=>{
    ticking=false;
    if(arrival){
      const rect=arrival.getBoundingClientRect();
      const max=arrival.offsetHeight-innerHeight;
      const p=clamp(-rect.top/Math.max(1,max));
      if(progressBar)progressBar.style.height=`${p*100}%`;
      if(frameA){
        frameA.style.opacity=String(1-invLerp(.36,.62,p));
        frameA.style.transform=`translate3d(0,${p*-2.2}%,0)`;
        const img=frameA.querySelector('img');
        if(img)img.style.transform=`scale(${1.09-p*.035})`;
      }
      if(frameB){
        frameB.style.opacity=String(invLerp(.34,.58,p));
        frameB.style.transform=`translate3d(0,${(1-p)*1.8}%,0)`;
        const img=frameB.querySelector('img');
        if(img)img.style.transform=`scale(${1.105-p*.045})`;
      }
      title?.classList.toggle('dim',p>.23);
      beat1?.classList.toggle('active',p>.27&&p<.6);
      beat2?.classList.toggle('active',p>.64);
    }

    depthSections.forEach(section=>{
      const rect=section.getBoundingClientRect();
      const p=clamp((innerHeight-rect.top)/(innerHeight+rect.height));
      const image=section.querySelector('.chapter-image img, :scope>img');
      if(image)image.style.transform=`scale(${1.09-p*.055}) translate3d(0,${(p-.5)*-1.4}%,0)`;
    });

    if(wellness&&wellnessImage){
      const rect=wellness.getBoundingClientRect();
      const max=wellness.offsetHeight-innerHeight;
      const p=clamp(-rect.top/Math.max(1,max));
      wellnessImage.style.transform=`scale(${1.12-p*.065}) translate3d(0,${p*-1.6}%,0)`;
    }
  };

  const requestUpdate=()=>{
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  };
  update();
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate,{passive:true});
}
