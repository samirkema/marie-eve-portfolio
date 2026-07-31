// ---------------------------------------------------------
// Comportements partagés sur les 4 pages : nav, scroll reveal,
// lightbox. La galerie filtrée (page Catégorie Art) est
// gérée séparément dans gallery.js.
// ---------------------------------------------------------

(function () {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('is-open'))
    );
  }

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Fade-in sections/cards as they enter the viewport (défilement/transition)
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Highlight current page in nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('is-active');
  });
})();

// ---------------------------------------------------------
// Lightbox — utilisé par la galerie (data-lightbox-src sur
// chaque vignette cliquable)
// ---------------------------------------------------------
window.openLightbox = (() => {
  let items = [];
  let index = 0;
  let box, stage, captionEl, navEls;

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Précédent">&#10094;</button>
      <div class="lightbox-stage"></div>
      <button class="lightbox-nav lightbox-next" aria-label="Suivant">&#10095;</button>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(box);
    stage = box.querySelector('.lightbox-stage');
    captionEl = box.querySelector('.lightbox-caption');
    navEls = box.querySelectorAll('.lightbox-nav');

    box.querySelector('.lightbox-close').addEventListener('click', close);
    box.addEventListener('click', (e) => {
      if (e.target === box) close();
    });
    box.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
    box.querySelector('.lightbox-next').addEventListener('click', () => step(1));
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function show() {
    const item = items[index];
    stage.innerHTML =
      item.type === 'video'
        ? `<video src="${item.src}" controls autoplay></video>`
        : `<img src="${item.src}" alt="${item.caption || 'Œuvre de Marie-Ève'}" />`;
    captionEl.textContent = items.length > 1 ? `${item.caption || ''} (${index + 1}/${items.length})`.trim() : item.caption || '';
    navEls.forEach((n) => (n.style.display = items.length > 1 ? '' : 'none'));
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function step(dir) {
    index = (index + dir + items.length) % items.length;
    show();
  }

  function close() {
    box.classList.remove('is-open');
    stage.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Accepte soit une liste de strings (images), soit une liste
  // d'objets {src, type, caption}.
  return function (list, startIndex) {
    if (!box) build();
    items = list.map((it) => (typeof it === 'string' ? { src: it, type: 'image' } : it));
    index = startIndex || 0;
    show();
  };
})();
