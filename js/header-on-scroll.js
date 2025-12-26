// header-on-scroll.js
(function(){
  'use strict';

  const SHOW_THRESHOLD = 150; // Un poco más de margen para no molestar al Hero
  let ticking = false;

  function update() {
    const y = window.scrollY || 0;

    // Si el usuario scrollea hacia abajo, el Header vuelve a aparecer
    // sin importar que el JS inicial lo haya ocultado.
    if (y > SHOW_THRESHOLD) {
      document.body.classList.add('header-visible');
    } else {
      // Si vuelven arriba de todo, lo ocultamos para que el Hero respire
      // (a menos que estemos en la fase de 'Firma' inicial)
      if (window.__gd_scroll_unlocked) {
         document.body.classList.remove('header-visible');
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();