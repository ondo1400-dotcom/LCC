/* LCC — interactions (multi-page) */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  const menuBtn  = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        mobileNav.hidden = false;
        mobileNav.style.display = 'flex';
      } else {
        mobileNav.style.display = 'none';
        mobileNav.hidden = true;
      }
    });
  }

  /* ---- Reveal-on-scroll ---- */
  const revealTargets = [
    '.section-head', '.intro-copy', '.intro-stats', '.values-grid',
    '.svc-grid', '.story-track', '.insight-grid', '.network-visual', '.cities',
    '.contact__copy', '.contact__form', '.message', '.mv-grid',
    '.timeline', '.life-grid', '.process', '.pillars',
    '.program', '.notice', '.contact-grid', '.faq',
    '.hero__title', '.hero__lead', '.hero__actions', '.hero__keys',
    '.page-hero__title', '.page-hero__lead', '.page-hero__meta',
    '.statement__inner', '.page-nav__inner'
  ];
  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const cls = el.matches('.values-grid, .svc-grid, .insight-grid, .cities, .life-grid, .pillars, .hero__keys, .page-hero__meta')
        ? 'reveal-stagger' : 'reveal';
      el.classList.add(cls);
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* ---- Stat count-up ---- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1500;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * easeOut(p)).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        cIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cIO.observe(el));

  /* ---- Mark current page in nav (based on filename) ---- */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__link[data-page]').forEach(a => {
    if (a.dataset.page === here || (here === '' && a.dataset.page === 'index.html')) {
      a.classList.add('is-active');
    }
  });

  /* ---- Poster gallery filter (programs.html) ---- */
  const grid = document.getElementById('posterGrid');
  const countEl = document.getElementById('posterCount');
  if (grid) {
    const posters = Array.from(grid.children);
    const total = posters.length;
    const filters = document.querySelectorAll('.poster-filter');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const f = btn.dataset.filter;
        let shown = 0;
        posters.forEach(p => {
          const match = f === 'all' || (p.dataset.cat || '').split(' ').includes(f);
          p.style.display = match ? '' : 'none';
          if (match) shown++;
        });
        if (countEl) countEl.textContent = shown;
      });
    });
    if (countEl) countEl.textContent = total;
  }

  /* ---- Testimonial pagination (insights.html) ---- */
  const tContainer = document.getElementById('testimonials');
  const tPager     = document.getElementById('testimonialPager');
  if (tContainer && tPager) {
    const perPage = 4;
    const items   = Array.from(tContainer.querySelectorAll('.testimonial'));
    const pages   = Math.max(1, Math.ceil(items.length / perPage));
    const pageList = tPager.querySelector('.pager__list');
    const prevBtn  = tPager.querySelector('[data-pager="prev"]');
    const nextBtn  = tPager.querySelector('[data-pager="next"]');
    let current = 0;

    const render = () => {
      items.forEach((el, i) => {
        const onPage = Math.floor(i / perPage) === current;
        el.hidden = !onPage;
      });
      pageList.querySelectorAll('button').forEach((b, i) => {
        b.classList.toggle('is-active', i === current);
      });
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === pages - 1;
    };

    for (let i = 0; i < pages; i++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(i + 1);
      btn.setAttribute('aria-label', (i + 1) + '페이지');
      btn.addEventListener('click', () => {
        current = i;
        render();
        const top = tContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      });
      li.appendChild(btn);
      pageList.appendChild(li);
    }
    prevBtn.addEventListener('click', () => {
      if (current > 0) { current--; render();
        const top = tContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
    nextBtn.addEventListener('click', () => {
      if (current < pages - 1) { current++; render();
        const top = tContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
    render();
  }

  /* ---- Smooth scroll for in-page anchors with header offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
