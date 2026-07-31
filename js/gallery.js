// ---------------------------------------------------------
// Page "Catégorie Art" — construit le hub central + les
// onglets + la grille filtrable à partir de data/gallery.js
//
// Chaque "œuvre" (GALLERY[].works[]) peut contenir plusieurs
// photos/vidéos (angles, détails...) : elle s'affiche comme
// UNE vignette, avec un badge "+N" si elle a plusieurs médias,
// et ouvre un mini carrousel dans le lightbox.
// ---------------------------------------------------------

(function () {
  const hubCols = document.querySelectorAll('[data-hub-col]');
  const tabsEl = document.getElementById('gallery-tabs');
  const gridEl = document.getElementById('gallery-grid');
  if (!tabsEl || !gridEl || typeof GALLERY === 'undefined') return;

  // encode chaque segment d'un chemin (les dossiers contiennent des espaces/accents)
  function toUrl(catKey, relPath) {
    return ['assets', catKey, ...relPath.split('/')].map(encodeURIComponent).join('/');
  }

  const categories = GALLERY.filter((c) => c.works.length > 0);

  // --- Hub cards (autour de la photo centrale) ---
  if (hubCols.length) {
    categories.forEach((cat, i) => {
      const col = hubCols[i % hubCols.length];
      const card = document.createElement('a');
      card.href = `#${cat.key}`;
      card.className = 'hub-card';
      card.dataset.cat = cat.key;
      card.innerHTML = `<h3>${cat.label}</h3><span class="count">${cat.works.length} œuvre${cat.works.length > 1 ? 's' : ''}</span>`;
      card.addEventListener('click', (e) => {
        e.preventDefault();
        selectCategory(cat.key);
        document.getElementById('galerie').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      col.appendChild(card);
    });
  }

  // --- Tabs ---
  const allTab = makeTab('all', 'Tout voir');
  tabsEl.appendChild(allTab);
  categories.forEach((cat) => tabsEl.appendChild(makeTab(cat.key, cat.label)));

  function makeTab(key, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-tab';
    btn.dataset.cat = key;
    btn.textContent = label;
    btn.addEventListener('click', () => selectCategory(key));
    return btn;
  }

  // --- Grid ---
  function render(activeKey) {
    gridEl.innerHTML = '';
    const shown = categories.filter((c) => activeKey === 'all' || c.key === activeKey);

    const cards = [];
    shown.forEach((cat) => {
      cat.works.forEach((work) => {
        cards.push({
          work,
          media: work.media.map((m) => ({
            src: toUrl(cat.key, m.file),
            type: m.type,
            caption: work.title,
          })),
        });
      });
    });

    if (!cards.length) {
      gridEl.innerHTML = '<p class="gallery-empty">Aucune œuvre pour le moment dans cette catégorie — à venir bientôt.</p>';
      return;
    }

    cards.forEach((card, i) => {
      const cover = card.media.find((m) => m.type === 'image') || card.media[0];
      const fig = document.createElement('figure');
      fig.className = 'gallery-item';

      const thumbInner =
        cover.type === 'video'
          ? `<video src="${cover.src}" muted playsinline></video><span class="play-icon"><span>&#9658;</span></span>`
          : `<img src="${cover.src}" alt="${card.work.title || 'Œuvre de Marie-Ève'}" loading="lazy" />`;

      const badge = card.media.length > 1 ? `<span class="badge-count">${card.media.length} 🖼</span>` : '';
      const titleHtml = card.work.title ? `<figcaption class="work-title">${card.work.title}</figcaption>` : '';

      fig.innerHTML = `<div class="thumb">${thumbInner}${badge}</div>${titleHtml}`;
      fig.addEventListener('click', () => window.openLightbox(card.media, 0));
      gridEl.appendChild(fig);
      requestAnimationFrame(() => {
        setTimeout(() => fig.classList.add('is-shown'), 20 * (i % 12));
      });
    });
  }

  function selectCategory(key) {
    tabsEl.querySelectorAll('.gallery-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.cat === key));
    document.querySelectorAll('.hub-card').forEach((c) => c.classList.toggle('is-active', c.dataset.cat === key));
    render(key);
  }

  // deep-link via #hash (ex: categorie-art.html#pastels)
  const initial = location.hash ? location.hash.slice(1) : 'all';
  const validInitial = categories.some((c) => c.key === initial) ? initial : 'all';
  selectCategory(validInitial);
})();
