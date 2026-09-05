const nav=document.querySelector('#nav');
addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>24),{passive:true});
const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const toggle=document.querySelector('.nav-toggle');
const menu=document.querySelector('.nav nav');
toggle?.addEventListener('click',()=>{const open=menu?.classList.toggle('open');toggle.textContent=open?'Close':'Menu'});
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');if(toggle)toggle.textContent='Menu'}));