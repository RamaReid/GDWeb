// smoothScroll removed
// Intentionally left blank to remove smooth scrolling functionality.
// If you need the old smooth scroller, restore from git history.

  // Respect prefers-reduced-motion
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let running = false;
  let current = window.scrollY || 0;
  let target = current;
  let velocity = 0;
  let rafId = null;

  // tuning (adjusted for an even gentler feel)
  const ease = 0.02; // lerp factor (smaller = slower/smoother)
  const speed = 0.45; // multiplier for wheel delta (lower = gentler)
  const maxDelta = 800; // clamp very large deltas
  const protectedSpeed = 0.12; // speed when header not yet visible

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rafLoop() {
    running = true;
    current += (target - current) * ease;
    // if very close, snap and stop (smaller threshold for smoother feel)
    if (Math.abs(target - current) < 0.2) {
      window.scrollTo(0, Math.round(target));
      running = false;
      return;
    }
    window.scrollTo(0, current);
    rafId = requestAnimationFrame(rafLoop);
  }

  function syncToCurrent() {
    // cancel any in-flight RAF and align internal state to current scroll
    try { if (rafId) cancelAnimationFrame(rafId); } catch (e) {}
    rafId = null;
    running = false;
    current = window.scrollY || 0;
    target = current;
    try { window.scrollTo(0, Math.round(current)); } catch (e) {}
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
    // notify other code that user attempted to wheel (so page can react)
    try { window.dispatchEvent(new CustomEvent('smoothscroll-wheel', { detail: { delta: e.deltaY } })); } catch (err) {}

    // Some environments require passive:false to preventDefault
    e.preventDefault();
    // Apply normal speed to delta
    let delta = clamp(e.deltaY * speed, -maxDelta, maxDelta);
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
    // normal touch handling
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

    // normal keyboard handling

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

  // Manage attaching/detaching listeners so the behavior can be enabled
  // only after the app signals it's safe (e.g., after unlock/restore header).
  let listenersAttached = false;

  function attachListeners() {
    if (listenersAttached) return;
    // don't attach if reduced motion is requested or on small screens
    if (reduce || window.innerWidth <= 768) return;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    // Keep target in sync if user scrolls by other means
    window.addEventListener('scroll', onScrollSync, { passive: true });

    listenersAttached = true;
  }

  function detachListeners() {
    if (!listenersAttached) return;
    window.removeEventListener('wheel', onWheel, { passive: false });
    window.removeEventListener('touchstart', onTouchStart, { passive: false });
    window.removeEventListener('touchmove', onTouchMove, { passive: false });
    window.removeEventListener('touchend', onTouchEnd, { passive: true });
    window.removeEventListener('keydown', onKeyDown, { passive: false });
    window.removeEventListener('scroll', onScrollSync, { passive: true });
    listenersAttached = false;
  }

  function onScrollSync() { if (!running) { current = window.scrollY; target = current; } }

  // Expose enable/disable API and listen for events to toggle
  window.smoothScroll = window.smoothScroll || {};
  window.smoothScroll.enable = attachListeners;
  window.smoothScroll.disable = detachListeners;
  window.smoothScroll.sync = syncToCurrent;

  window.addEventListener('smoothscroll-enable', function () { attachListeners(); }, { passive: true });
  window.addEventListener('smoothscroll-disable', function () { detachListeners(); }, { passive: true });

})();
