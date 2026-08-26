const cfg = window.LOS_VERDIALES || {};

const heroStill = document.querySelector('#heroStill');
const heroVideo = document.querySelector('#heroVideo');

if (heroVideo) {
  heroVideo.addEventListener('canplay', () => {
    heroVideo.classList.add('is-ready');
    heroStill?.classList.add('is-hidden');
  }, { once: true });

  heroVideo.play().catch(() => {
    /* Poster still remains visible */
  });
}

const gallery = document.querySelector('#exteriorGallery');
const section = document.querySelector('#exterior');
const exteriors = cfg.exterior || [];

if (exteriors.length && section && gallery) {
  section.hidden = false;
  exteriors.forEach((item) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `<img src="${item.src}" alt="${item.label || 'Los Verdiales eksteriør'}" loading="lazy">`;
    gallery.appendChild(figure);
  });
}

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav nav');

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.textContent = open ? 'Lukk' : 'Meny';
});

document.querySelectorAll('.nav nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = 'Meny';
  });
});
