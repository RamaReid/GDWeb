// header-on-scroll.js
// Show header when user scrolls; hide when at top
(function(){
  'use strict';
  // Hysteresis thresholds to avoid flicker when entering/leaving the hero
  const SHOW_THRESHOLD = 80; // show header when scrolled beyond this
  const HIDE_THRESHOLD = 40; // hide header when scrolled above this
  let last = window.scrollY || 0;
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY || 0;
    // Hysteresis: require passing SHOW_THRESHOLD to show, and HIDE_THRESHOLD to hide
    if (y > SHOW_THRESHOLD) {
      document.body.classList.add('header-visible');
    } else if (y < HIDE_THRESHOLD) {
      document.body.classList.remove('header-visible');
    }
    last = y;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // show header on any pointerdown/wheel/touchstart as well
  function onUserInput() {
    // Only show header on direct input if user has already scrolled past the show threshold
    try {
      if ((window.scrollY || 0) > SHOW_THRESHOLD) document.body.classList.add('header-visible');
    } catch (e) {}
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onUserInput, { passive: true });
  window.addEventListener('touchstart', onUserInput, { passive: true });
  window.addEventListener('pointerdown', onUserInput, { passive: true });

  // initialize state
  try { if ((window.scrollY || 0) > SHOW_THRESHOLD) document.body.classList.add('header-visible'); } catch(e) {}
})();
