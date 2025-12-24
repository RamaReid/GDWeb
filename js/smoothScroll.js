// smoothScroll.js
// Smooth/inertia scroll for wheel and touch — respects prefers-reduced-motion
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  // Respect prefers-reduced-motion
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Only enable on wider screens (desktop-ish)
  if (window.innerWidth <= 768) return;

  let running = false;
  let current = window.scrollY || 0;
  let target = current;
  let velocity = 0;

  // tuning (adjusted for a gentler feel)
  const ease = 0.04; // lerp factor (smaller = slower/smoother)
  const speed = 0.6; // multiplier for wheel delta (lower = gentler)
  const maxDelta = 1200; // clamp very large deltas

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rafLoop() {
    running = true;
    current += (target - current) * ease;
    // if very close, snap and stop (smaller threshold for smoother feel)
    if (Math.abs(target - current) < 0.3) {
      window.scrollTo(0, Math.round(target));
      running = false;
      return;
    }
    window.scrollTo(0, current);
    requestAnimationFrame(rafLoop);
  }

  function shouldIgnoreEvent(evt) {
    // editable elements
    const tgt = evt.target;
    if (!tgt) return false;
    if (tgt.closest && tgt.closest('input, textarea, select, [contenteditable="true"]')) return true;
    // elements opt-out
    if (tgt.closest && tgt.closest('[data-no-smooth]')) return true;
    return false;
  }

  // Wheel handler
  function onWheel(e) {
    if (shouldIgnoreEvent(e)) return; // let native
    // Some environments require passive:false to preventDefault
    e.preventDefault();

    // notify other code that user attempted to wheel (so page can react)
    try { window.dispatchEvent(new CustomEvent('smoothscroll-wheel', { detail: { delta: e.deltaY } })); } catch (err) {}

    const delta = clamp(e.deltaY * speed, -maxDelta, maxDelta);
    target = clamp((target || window.scrollY) + delta, 0, document.documentElement.scrollHeight - window.innerHeight);

    if (!running) requestAnimationFrame(rafLoop);
  }

  // Touch handling (basic) — accumulate touchmove deltas
  let touchStartY = null;
  function onTouchStart(e) {
    if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (shouldIgnoreEvent(e)) return;
    if (!touchStartY) return;
    const y = e.touches[0].clientY;
    const delta = touchStartY - y;
    touchStartY = y;
    e.preventDefault();
    try { window.dispatchEvent(new CustomEvent('smoothscroll-touch', { detail: { delta } })); } catch (err) {}
    target = clamp((target || window.scrollY) + delta * speed, 0, document.documentElement.scrollHeight - window.innerHeight);
    if (!running) requestAnimationFrame(rafLoop);
  }
  function onTouchEnd() { touchStartY = null; }

  // Keyboard support for pageUp/pageDown/space/home/end
  function onKeyDown(e) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

    const h = window.innerHeight;
    if (e.code === 'PageDown') {
      e.preventDefault();
      target = clamp((target || window.scrollY) + h * 0.9, 0, document.documentElement.scrollHeight - h);
      if (!running) requestAnimationFrame(rafLoop);
    } else if (e.code === 'PageUp') {
      e.preventDefault();
      target = clamp((target || window.scrollY) - h * 0.9, 0, document.documentElement.scrollHeight - h);
      if (!running) requestAnimationFrame(rafLoop);
    } else if (e.code === 'Space') {
      e.preventDefault();
      const dir = e.shiftKey ? -1 : 1;
      target = clamp((target || window.scrollY) + dir * h * 0.9, 0, document.documentElement.scrollHeight - h);
      if (!running) requestAnimationFrame(rafLoop);
    } else if (e.code === 'Home') {
      e.preventDefault();
      target = 0; if (!running) requestAnimationFrame(rafLoop);
    } else if (e.code === 'End') {
      e.preventDefault();
      target = document.documentElement.scrollHeight - window.innerHeight; if (!running) requestAnimationFrame(rafLoop);
    }
  }

  // Attach listeners (non-passive where needed)
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: false });

  // Keep target in sync if user scrolls by other means
  window.addEventListener('scroll', () => { if (!running) { current = window.scrollY; target = current; } }, { passive: true });

})();
