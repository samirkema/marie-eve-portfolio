// ---------------------------------------------------------
// Page d'accueil — grille "à découvrir" : une œuvre par
// catégorie, tirée automatiquement de data/gallery.js
// ---------------------------------------------------------

(function () {
  const grid = document.getElementById('featured-grid');
  if (!grid || typeof GALLERY === 'undefined') return;

  function toUrl(catKey, relPath) {
    return ['assets', catKey, ...relPath.split('/')].map(encodeURIComponent).join('/');
  }

  const categories = GALLERY.filter((c) => c.works.length > 0);
  if (!categories.length) {
    grid.remove();
    return;
  }

  categories.slice(0, 4).forEach((cat) => {
    const work = cat.works[cat.works.length - 1];
    const cover = work.media.find((m) => m.type === 'image') || work.media[0];
    const a = document.createElement('a');
    a.href = `categorie-art.html#${cat.key}`;
    a.innerHTML = `<img src="${toUrl(cat.key, cover.file)}" alt="${cat.label}" loading="lazy" /><span class="tag">${cat.label}</span>`;
    grid.appendChild(a);
  });
})();
