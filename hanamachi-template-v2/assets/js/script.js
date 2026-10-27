'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'メニューを開く');
    nav?.classList.remove('nav--open');
  };

  menuButton?.addEventListener('click', () => {
    const next = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(next));
    menuButton.setAttribute('aria-label', next ? 'メニューを閉じる' : 'メニューを開く');
    nav?.classList.toggle('nav--open', next);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (nav?.classList.contains('nav--open') && !header?.contains(event.target)) closeMenu();
  });

  const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();
  document.getElementById('year').textContent = String(new Date().getFullYear());

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--ready');
      observer.observe(el);
    });
  }

  const dialog = document.getElementById('image-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('.lightbox__image');
    const caption = dialog.querySelector('.lightbox__caption');
    document.querySelectorAll('[data-lightbox]').forEach(button => {
      button.addEventListener('click', () => {
        image.src = button.dataset.lightbox;
        image.alt = button.querySelector('img')?.alt || '';
        caption.textContent = button.dataset.caption || '';
        dialog.showModal();
      });
    });
    dialog.querySelector('.lightbox__close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
    });
  }
})();
