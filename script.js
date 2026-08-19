/* ─── SMOOTH SCROLL ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    // Close mobile menu if open
    closeMobileMenu();
    target.scrollIntoView({ behavior: 'smooth' });
    // Move keyboard focus along with the skip link / nav jump (a11y)
    if (target.hasAttribute('tabindex')) {
      setTimeout(() => target.focus({ preventScroll: true }), 400);
    }
  });
});

/* ─── FOOTER — année dynamique ───────────────────── */
const footerCopy = document.getElementById('footer-copy');
if (footerCopy) {
  footerCopy.textContent = footerCopy.textContent.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
}

/* ─── SCROLL PROGRESS BAR ───────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
}, { passive: true });

/* ─── NAVBAR + ACTIVE LINKS ─────────────────────── */
const navbar   = document.getElementById('navbar');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a, .mob-menu a')];

function updateActiveNav() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 8;
  if (atBottom && sections.length) {
    const lastId = sections[sections.length - 1].id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${lastId}`));
    return;
  }

  const threshold = window.innerHeight * 0.4;
  let cur = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= threshold) cur = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ─── HAMBURGER MOBILE MENU ─────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  mobMenu?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (mobMenu?.classList.contains('open') &&
      !mobMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ─── REVEAL ON SCROLL ───────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

/* ─── HERO REVEAL ON LOAD ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#accueil .rv').forEach((el, i) => {
    setTimeout(() => el.classList.add('vis'), 80 + i * 110);
  });
});

/* ─── DARK / LIGHT MODE ──────────────────────────── */
const themeBtn  = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const themeColorMeta = document.getElementById('theme-color-meta');

function syncThemeColor(isLight) {
  themeColorMeta?.setAttribute('content', isLight ? '#F6F7FB' : '#09090B');
}

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
  syncThemeColor(true);
}
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeIcon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  syncThemeColor(isLight);
});

/* ═══════════════════════════════════════════════════
   MODAL SYSTEM  — multi-window, independent tracking
   Each modal is tracked in openModals Set.
   Overlay shows whenever any modal is open & not all minimized.
═══════════════════════════════════════════════════ */
const overlay   = document.getElementById('modal-overlay');
const openModals = new Set();  // all currently open (incl. minimized)
let zCounter = 600;

/* ── helpers ── */
function centerModal(win) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const rect = win.getBoundingClientRect();
  const w = rect.width || win.offsetWidth;
  const h = rect.height || win.offsetHeight;
  win.style.top     = Math.max(70, (vh - h) / 2) + 'px';
  win.style.left    = Math.max(20, (vw - w) / 2) + 'px';
  win.style.translate = 'none';
}

function bringToFront(win) {
  zCounter++;
  win.style.zIndex = zCounter;
}

function refreshOverlay() {
  // Show overlay only if at least one modal is open and not minimized
  const anyVisible = [...openModals].some(w => !w.classList.contains('minimized'));
  overlay.classList.toggle('active', anyVisible);
}

/* ── ACCESSIBILITÉ — rôle dialog + focus trap ── */
document.querySelectorAll('.modal-window').forEach(win => {
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  const titleEl = win.querySelector('.modal-title');
  if (titleEl) {
    if (!titleEl.id) titleEl.id = `${win.id}-title`;
    win.setAttribute('aria-labelledby', titleEl.id);
  }
  if (!win.hasAttribute('tabindex')) win.setAttribute('tabindex', '-1');
});

function getFocusableIn(win) {
  return [...win.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
  )].filter(el => el.offsetParent !== null);
}

function getTopModal() {
  let topWin = null, topZ = 0;
  openModals.forEach(w => {
    if (w.classList.contains('minimized')) return;
    const z = parseInt(w.style.zIndex || 0, 10);
    if (z >= topZ) { topZ = z; topWin = w; }
  });
  return topWin;
}

/* ── OPEN ── */
function openModal(id, triggerEl) {
  const win = document.getElementById(id);
  if (!win) return;

  win._lastTrigger = triggerEl || document.activeElement;

  // If already open (and just minimized), restore it
  if (openModals.has(win) && win.classList.contains('minimized')) {
    restoreFromDock(win);
    return;
  }

  // If already open and visible, just bring to front
  if (openModals.has(win)) {
    bringToFront(win);
    return;
  }

  openModals.add(win);
  win.classList.remove('minimized', 'maximized');
  win.style.width  = '';
  win.style.height = (win.dataset.defaultH || 480) + 'px';
  win.classList.add('open');
  bringToFront(win);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      centerModal(win);
      refreshOverlay();
      // Focus déplacé dans la modale à l'ouverture (a11y)
      const focusables = getFocusableIn(win);
      (focusables[0] || win).focus();
    });
  });
}

/* ── CLOSE ── */
function closeModal(win) {
  if (!win) return;
  openModals.delete(win);
  win.classList.remove('open', 'minimized', 'maximized');
  win.style.width  = '';
  win.style.height = '';
  // Remove dock chip if any
  removeDockChip(win);
  refreshOverlay();
  // Rendre le focus au déclencheur d'origine (a11y)
  if (win._lastTrigger && document.contains(win._lastTrigger)) {
    win._lastTrigger.focus();
  }
}

/* ── MINIMIZE → dock ── */
function minimizeModal(win) {
  if (win.classList.contains('minimized')) {
    restoreFromDock(win);
    return;
  }
  // Save position
  const rect = win.getBoundingClientRect();
  win.dataset.savedTop  = rect.top  + 'px';
  win.dataset.savedLeft = rect.left + 'px';

  win.classList.remove('maximized');
  win.classList.add('minimized');
  addToDock(win);
  refreshOverlay();
}

/* ── MAXIMIZE ── */
function maximizeModal(win) {
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    win.style.width  = '';
    win.style.height = (win.dataset.defaultH || 480) + 'px';
    win.style.translate = 'none';
    requestAnimationFrame(() => { requestAnimationFrame(() => centerModal(win)); });
  } else {
    win.classList.remove('minimized');
    win.classList.add('maximized');
    win.style.top     = '50%';
    win.style.left    = '50%';
    win.style.translate = '-50% -50%';
    win.style.width   = '';
    win.style.height  = '';
    removeDockChip(win);
    refreshOverlay();
  }
}

/* ── DOCK SYSTEM ── */
let dock = null;

function getDock() {
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'modal-dock';
    document.body.appendChild(dock);
  }
  return dock;
}

/* Récupère (et clone) l'icône propre à la modale — projet, compétence ou certification */
function getDockIcon(win) {
  const wrap = win.querySelector('.modal-proj-icon, .modal-skill-icon, .modal-cert-icon');
  if (wrap) {
    const clone = wrap.cloneNode(true);
    clone.removeAttribute('style');
    return clone;
  }
  // Repli (ex : carte "Projet à venir" sans icône dédiée) — réutilise la 1ère icône trouvée, sinon une icône générique
  const anyIcon = win.querySelector('.modal-body i[class*="fa-"]');
  const span = document.createElement('span');
  span.className = 'dock-icon-fallback';
  const i = document.createElement('i');
  i.className = anyIcon ? anyIcon.className : 'fa-solid fa-window-restore';
  span.appendChild(i);
  return span;
}

function addToDock(win) {
  const d = getDock();
  if (d.querySelector(`[data-dock-id="${win.id}"]`)) return;

  const title = win.querySelector('.modal-title')?.textContent?.trim() || win.id;
  const chip  = document.createElement('button');
  chip.className      = 'dock-chip';
  chip.dataset.dockId = win.id;
  chip.appendChild(getDockIcon(win));
  const label = document.createElement('span');
  label.className = 'dock-label';
  label.textContent = title.length > 26 ? title.slice(0, 24) + '…' : title;
  chip.appendChild(label);
  chip.addEventListener('click', () => restoreFromDock(win));
  d.appendChild(chip);
  d.classList.add('visible');
}

function removeDockChip(win) {
  const d = getDock();
  const chip = d.querySelector(`[data-dock-id="${win.id}"]`);
  if (chip) chip.remove();
  if (!d.children.length) d.classList.remove('visible');
}

function restoreFromDock(win) {
  removeDockChip(win);

  win.classList.remove('minimized');
  win.style.height = (win.dataset.defaultH || 480) + 'px';
  win.style.width  = '';

  // Restore saved position
  if (win.dataset.savedTop && win.dataset.savedTop !== 'px') {
    win.style.top     = win.dataset.savedTop;
    win.style.left    = win.dataset.savedLeft;
    win.style.translate = 'none';
  } else {
    win.style.translate = 'none';
    requestAnimationFrame(() => { requestAnimationFrame(() => centerModal(win)); });
  }

  bringToFront(win);
  refreshOverlay();
  requestAnimationFrame(() => {
    const focusables = getFocusableIn(win);
    (focusables[0] || win).focus();
  });
}

/* ── Bind card triggers ── */
document.querySelectorAll('[data-modal]').forEach(trigger => {
  // Cartes en <div> : les rendre accessibles au clavier sans changer leur style
  if (!['A', 'BUTTON'].includes(trigger.tagName)) {
    if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
    if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button');
  }
  trigger.addEventListener('click', () => openModal(trigger.dataset.modal, trigger));
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(trigger.dataset.modal, trigger);
    }
  });
});

/* ── Bind dot buttons (fermer/réduire/agrandir) ── */
const dotLabels = { close: 'Fermer', minimize: 'Réduire', maximize: 'Agrandir' };
document.querySelectorAll('.modal-window').forEach(win => {
  win.querySelectorAll('[data-action]').forEach(dot => {
    // Les points colorés sont des <span> : ajout du support clavier + libellé (a11y, sans impact visuel)
    if (!dot.hasAttribute('tabindex')) dot.setAttribute('tabindex', '0');
    if (!dot.hasAttribute('role')) dot.setAttribute('role', 'button');
    if (!dot.hasAttribute('aria-label')) dot.setAttribute('aria-label', dotLabels[dot.dataset.action] || dot.dataset.action);
  });

  win.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;
    if (action === 'close')    closeModal(win);
    if (action === 'minimize') minimizeModal(win);
    if (action === 'maximize') maximizeModal(win);
  });
  win.addEventListener('keydown', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    e.stopPropagation();
    const action = btn.dataset.action;
    if (action === 'close')    closeModal(win);
    if (action === 'minimize') minimizeModal(win);
    if (action === 'maximize') maximizeModal(win);
  });
  win.addEventListener('mousedown', () => bringToFront(win));
});

/* ── Overlay click closes topmost visible modal ── */
overlay.addEventListener('click', () => {
  const topWin = getTopModal();
  if (topWin) closeModal(topWin);
});

/* ── Escape closes topmost visible modal · Tab reste piégé dans la modale (a11y) ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const topWin = getTopModal();
    if (topWin) closeModal(topWin);
    return;
  }
  if (e.key === 'Tab') {
    const topWin = getTopModal();
    if (!topWin || !topWin.contains(e.target)) return;
    const focusables = getFocusableIn(topWin);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});

/* ─── IMAGE LIGHTBOX ─────────────────────────────── */
const lightbox    = document.getElementById('img-lightbox');
const lightboxImg = lightbox.querySelector('img');

// Handle broken images — show fallback, hide zone's ::after zoom icon
document.querySelectorAll('.modal-screenshot-zone img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('broken');
    img.style.display = 'none';
    img.closest('.modal-screenshot-zone').classList.add('no-img');
    img.closest('.modal-screenshot-zone').style.cursor = 'default';
  });
  img.addEventListener('load', () => {
    img.classList.remove('broken');
    img.closest('.modal-screenshot-zone').classList.remove('no-img');
    img.closest('.modal-screenshot-zone').style.cursor = 'zoom-in';
  });
});

// Click on zone → open lightbox (only if image loaded)
document.addEventListener('click', e => {
  const zone = e.target.closest('.modal-screenshot-zone');
  if (zone && !zone.classList.contains('no-img')) {
    const img = zone.querySelector('img');
    if (img && !img.classList.contains('broken') && img.src) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      return;
    }
  }
  // Close on click anywhere in lightbox
  if (e.target.closest('#img-lightbox') && lightbox.classList.contains('open')) {
    lightbox.classList.remove('open');
    setTimeout(() => { lightboxImg.src = ''; }, 250);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    lightbox.classList.remove('open');
    setTimeout(() => { lightboxImg.src = ''; }, 250);
  }
});
document.querySelectorAll('.modal-tabs').forEach(tabContainer => {
  const modal = tabContainer.closest('.modal-window');
  const tabs  = tabContainer.querySelectorAll('.mtab');
  const pages = modal.querySelectorAll('.modal-page');

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.stopPropagation();
      const targetPage = tab.dataset.page;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update pages
      pages.forEach(p => {
        p.classList.toggle('active', p.dataset.pageContent === targetPage);
      });
    });
  });
});
document.querySelectorAll('.modal-titlebar').forEach(bar => {
  const win = bar.closest('.modal-window');
  let dragging = false, startX, startY, initLeft, initTop;

  bar.addEventListener('mousedown', e => {
    if (e.target.closest('.modal-dots')) return;
    if (win.classList.contains('maximized')) return;

    dragging = true;
    bringToFront(win);

    const rect = win.getBoundingClientRect();
    win.style.top     = rect.top  + 'px';
    win.style.left    = rect.left + 'px';
    win.style.translate = 'none';

    startX   = e.clientX;
    startY   = e.clientY;
    initLeft = rect.left;
    initTop  = rect.top;

    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.left = Math.max(0, initLeft + e.clientX - startX) + 'px';
    win.style.top  = Math.max(0, initTop  + e.clientY - startY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.userSelect = ''; }
  });
});