// ---------------------------------------------------------
// Page À propos — charge assets/portrait.(jpg|jpeg|png), et
// affiche un joli placeholder si aucune photo n'a encore été
// déposée à cet endroit.
// ---------------------------------------------------------

(function () {
  const img = document.getElementById('portrait-img');
  const placeholder = document.getElementById('portrait-placeholder');
  if (!img) return;

  const candidates = ['assets/portrait.jpg', 'assets/portrait.jpeg', 'assets/portrait.png'];
  let i = 0;

  function tryNext() {
    if (i >= candidates.length) {
      img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
      return;
    }
    img.src = candidates[i++];
  }

  img.addEventListener('error', tryNext);
  img.addEventListener('load', () => {
    if (placeholder) placeholder.style.display = 'none';
  });
  tryNext();
})();
