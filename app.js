const cfg = window.LOS_VERDIALES || {};
const copy = window.LV_COPY || {};
const LANG_KEY = 'lv-lang';
const PLANS_KEY = 'lv-plans-unlocked';

let lang = localStorage.getItem(LANG_KEY) || 'no';
let menuOpen = false;
let activePlanId = null;

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

  renderFacts();
  if (isPlansUnlocked()) renderPlansTabs();
}

function isPlansUnlocked() {
  return localStorage.getItem(PLANS_KEY) === '1';
}

function renderFacts() {
  const container = document.getElementById('factsBand');
  if (!container) return;

  container.innerHTML = '';
  const facts = cfg.facts || [];

  facts.forEach((fact) => {
    if (!fact.value) return;
    const cell = document.createElement('div');
    cell.className = 'facts-cell';
    cell.innerHTML = `
      <span class="facts-label">${t(`facts.${fact.id}.label`)}</span>
      <span class="facts-value">${fact.value}</span>
    `;
    container.appendChild(cell);
  });

  container.hidden = container.children.length === 0;
}

function getActivePlans() {
  return (cfg.plans || []).filter((plan) => plan.enabled !== false);
}

function unlockPlans() {
  localStorage.setItem(PLANS_KEY, '1');
  showPlansViewer();
}

function showPlansViewer() {
  const gate = document.getElementById('plansGate');
  const viewer = document.getElementById('plansViewer');

  gate?.classList.add('hidden');
  viewer?.classList.remove('hidden');
  viewer?.setAttribute('aria-hidden', 'false');
  renderPlansTabs();
}

function renderPlansTabs() {
  const tabsEl = document.getElementById('plansTabs');
  const panelsEl = document.getElementById('plansPanels');
  if (!tabsEl || !panelsEl) return;

  const plans = getActivePlans();
  if (!plans.length) return;

  if (!activePlanId || !plans.some((plan) => plan.id === activePlanId)) {
    activePlanId = plans[0].id;
  }

  tabsEl.innerHTML = '';
  panelsEl.innerHTML = '';

  plans.forEach((plan, index) => {
    const tabId = `plan-tab-${plan.id}`;
    const panelId = `plan-panel-${plan.id}`;
    const isActive = plan.id === activePlanId;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `plans-tab${isActive ? ' is-active' : ''}`;
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.textContent = t(plan.labelKey);
    tab.addEventListener('click', () => selectPlanTab(plan.id));
    tabsEl.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = `plans-panel${isActive ? ' is-active' : ''}`;
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = !isActive;

    const frame = document.createElement('div');
    frame.className = 'plans-frame';

    const empty = document.createElement('p');
    empty.className = 'plans-empty';
    empty.textContent = t('plans.empty');

    const img = document.createElement('img');
    img.src = plan.src;
    img.alt = t(plan.captionKey);
    img.loading = 'lazy';
    img.className = 'plans-image hidden';
    img.addEventListener('load', () => {
      img.classList.remove('hidden');
      empty.classList.add('hidden');
    });
    img.addEventListener('error', () => {
      img.classList.add('hidden');
      empty.classList.remove('hidden');
    });
    if (img.complete && img.naturalWidth > 0) {
      img.classList.remove('hidden');
      empty.classList.add('hidden');
    }
    img.addEventListener('click', () => openPlanLightbox(plan.src, t(plan.captionKey)));

    frame.appendChild(empty);
    frame.appendChild(img);

    const caption = document.createElement('p');
    caption.className = 'plans-caption';
    caption.textContent = t(plan.captionKey);

    panel.appendChild(frame);
    panel.appendChild(caption);

    if (plan.pdf) {
      const download = document.createElement('a');
      download.className = 'text-link plans-download';
      download.href = plan.pdf;
      download.download = '';
      download.textContent = t('plans.download');
      panel.appendChild(download);
    }

    panelsEl.appendChild(panel);
  });
}

function selectPlanTab(planId) {
  activePlanId = planId;
  renderPlansTabs();
}

function openPlanLightbox(src, alt) {
  const lightbox = document.getElementById('planLightbox');
  const img = document.getElementById('planLightboxImg');
  if (!lightbox || !img) return;

  img.src = src;
  img.alt = alt;
  lightbox.classList.remove('hidden');
  document.getElementById('planLightboxClose')?.focus();
}

function closePlanLightbox() {
  const lightbox = document.getElementById('planLightbox');
  const img = document.getElementById('planLightboxImg');
  lightbox?.classList.add('hidden');
  if (img) {
    img.src = '';
    img.alt = '';
  }
}

function initPlans() {
  const form = document.getElementById('plansForm');
  const errorEl = document.getElementById('plansError');

  if (isPlansUnlocked()) {
    showPlansViewer();
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl?.classList.add('hidden');

    const formData = new FormData(form);
    const email = formData.get('email');
    if (!email) return;

    const payload = new URLSearchParams();
    payload.append('form-name', 'floor-plans');
    payload.append('name', formData.get('name') || '');
    payload.append('email', email);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      if (!response.ok) throw new Error('submit failed');
      unlockPlans();
    } catch {
      errorEl?.classList.remove('hidden');
    }
  });

  document.getElementById('planLightboxClose')?.addEventListener('click', closePlanLightbox);
  document.getElementById('planLightbox')?.addEventListener('click', (event) => {
    if (event.target.id === 'planLightbox') closePlanLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePlanLightbox();
  });
}

document.querySelectorAll('.lang-switch-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(lang);
initPlans();

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
