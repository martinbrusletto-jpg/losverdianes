const cfg = window.LOS_VERDIALES || {};
const copy = window.LV_COPY || {};
const LANG_KEY = 'lv-lang';

let lang = localStorage.getItem(LANG_KEY) || 'no';
let menuOpen = false;

function t(key) {
  return copy[lang]?.[key] ?? copy.no?.[key] ?? '';
}

function applyLang(next) {
  lang = next === 'en' ? 'en' : 'no';
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  const titleKey = document.body.dataset.i18nTitle || 'meta.title';
  const title = t(titleKey);
  const description = t('meta.description');
  if (title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.content = description;

  document.querySelectorAll('.lang-switch-btn').forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const toggle = document.querySelector('.nav-toggle');
  if (toggle && !menuOpen) toggle.textContent = t('nav.menu');
}

document.querySelectorAll('.lang-switch-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(lang);

const heroStill = document.querySelector('#heroStill');
const heroVideo = document.querySelector('#heroVideo');

if (heroVideo) {
  heroVideo.addEventListener('canplay', () => {
    heroVideo.classList.add('is-ready');
    heroStill?.classList.add('is-hidden');
  }, { once: true });

  heroVideo.play().catch(() => {});
}

document.querySelectorAll('.video-chapter-media').forEach((video) => {
  video.play().catch(() => {});
});

const gallery = document.querySelector('#exteriorGallery');
const section = document.querySelector('#exterior');
const exteriors = cfg.exterior || [];

if (exteriors.length && section && gallery) {
  section.hidden = false;
  exteriors.forEach((item) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `<img src="${item.src}" alt="${item.label || 'Los Verdiales'}" loading="lazy">`;
    gallery.appendChild(figure);
  });
}

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav nav');

toggle?.addEventListener('click', () => {
  menuOpen = nav?.classList.toggle('open');
  toggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  toggle.textContent = menuOpen ? t('nav.close') : t('nav.menu');
});

document.querySelectorAll('.nav nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuOpen = false;
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = t('nav.menu');
  });
});
