// home.js
// Entradas del Home SIN interferir con la Intro

(function () {
  "use strict";

  let executed = false;

  window.addEventListener("introComplete", () => {
    if (executed) return;
    executed = true;

    /* ============================================
       Delay editorial:
       dejamos que el reveal sea protagonista
    ============================================ */

    const HOME_DELAY = 1500;

    setTimeout(() => {
      const logo = document.querySelector(".brand-logo");
      const tagline = document.querySelector(".brand-tagline");
      const navItems = document.querySelectorAll(".nav-list li");
      const hero = document.querySelector(".hero-revista-shell");

      /* Estados iniciales (solo del home) */
      if (logo) {
        logo.style.opacity = "0";
        logo.style.transform = "translateY(6px)";
      }
      if (tagline) {
        tagline.style.opacity = "0";
        tagline.style.transform = "translateY(6px)";
      }
      navItems.forEach((li) => {
        li.style.opacity = "0";
        li.style.transform = "translateY(6px)";
      });

      /* Logo */
      setTimeout(() => {
        if (logo) {
          logo.style.transition = "opacity .4s ease, transform .4s ease";
          logo.style.opacity = "1";
          logo.style.transform = "translateY(0)";
        }
      }, 200);

      /* Tagline */
      setTimeout(() => {
        if (tagline) {
          tagline.style.transition = "opacity .4s ease, transform .4s ease";
          tagline.style.opacity = "1";
          tagline.style.transform = "translateY(0)";
        }
      }, 340);

      /* Navegación */
      navItems.forEach((li, i) => {
        setTimeout(() => {
          li.style.transition = "opacity .35s ease, transform .35s ease";
          li.style.opacity = "1";
          li.style.transform = "translateY(0)";
        }, 480 + i * 90);
      });

      setTimeout(() => {
        console.log("HERO setTimeout ejecutado");
        const heroSection = document.querySelector(".hero-revista-section");
        const heroShell = document.getElementById("hero-revista-shell");

        document.body.classList.add("hero-visible");

        if (heroSection) {
          heroSection.style.transition = "opacity 1.5s ease-out 150ms";
          heroSection.style.opacity = "1";
          heroSection.style.visibility = "visible";
          heroSection.style.pointerEvents = "auto";
        }

        if (heroShell && !heroShell.querySelector("iframe")) {
          const src = heroShell.getAttribute("data-hero-src");

          if (src) {
            const iframe = document.createElement("iframe");
            iframe.src = src;
            iframe.setAttribute("aria-label", "Revista GD");
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "0";
            iframe.style.display = "block";

            // Identificador útil (y compatibilidad si algún CSS/JS lo usa)
            iframe.id = "hero-iframe";

              // smoothScroll injection disabled temporarily (was causing scroll/layout issue)

            // Fallback: si el contenido del iframe no emite postMessage,
            // avisamos al padre que hubo interacción en el hero.
            const hideHeaderFromIframe = () => {
              try { window.dispatchEvent(new Event('HERO_INTERACTION_FALLBACK')); } catch (e) { }
            };

            iframe.addEventListener("pointerdown", hideHeaderFromIframe, { passive: true });
            iframe.addEventListener("mousedown", hideHeaderFromIframe, { passive: true });
            iframe.addEventListener("touchstart", hideHeaderFromIframe, { passive: true });

            heroShell.appendChild(iframe);
          } else {
            console.warn(
              "Hero revista: falta data-hero-src en #hero-revista-shell"
            );
          }
        }

        if (hero) {
          hero.style.transition = "opacity 1.5s ease-out 150ms, transform 1.9s cubic-bezier(.22,.9,.3,1) 150ms";
          hero.style.opacity = "1";
          hero.style.transform = "translateY(0) scale(1)";
        }
      }, 1200);
    }, HOME_DELAY);
  });
})();

// (no deterministic force here; intro.js controls reveal)

// NAV MOBILE TOGGLE
const navToggle = document.querySelector(".nav-toggle");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
}

/* ======================================================
   HERO (iframe) → HEADER STATE
====================================================== */

(function () {
  // Simplified: header appearance/disappearance removed — keep hero → unlock behavior only

  // Unlock scroll once (called from hero interaction or header interaction)
  function unlockScrollOnce() {
    if (window.__gd_scroll_unlocked) return;
    window.__gd_scroll_unlocked = true;

    // Remove the intro-only lock so page can scroll
    try { document.body.classList.remove('sequence-only'); } catch (e) {}

    // smoothScroll removed: no-op

    // clear any inline height styles that might prevent scroll
    try {
      document.documentElement.style.height = '';
      document.body.style.height = '';
    } catch (e) {
      // noop
    }
  }

  // Allow header interactions to also unlock the scroll (no header toggles)
  const headerEl = document.querySelector('.gd-header');
  if (headerEl) {
    headerEl.addEventListener('pointerdown', function () { unlockScrollOnce(); }, { passive: true });
  }

  // Mensajes desde el iframe: on interaction, unlock scroll and sync scroller
  window.addEventListener("message", (event) => {
    if (!event.data || !event.data.type) return;

    if (event.data.type === "HERO_INTERACTION" || event.data.type === "HERO_USER_INTERACT") {
      try { unlockScrollOnce(); } catch (e) {}
      // smoothScroll removed: no-op
    }

    if (event.data.type === "HERO_SCROLL_INTENT" || event.data.type === "HERO_SCROLL") {
      try { unlockScrollOnce(); } catch (e) {}
      // smoothScroll removed: no-op
    }
  });

  // Fallback event from in-page hero click (when iframe doesn't postMessage)
  window.addEventListener('HERO_INTERACTION_FALLBACK', function () {
    try { unlockScrollOnce(); } catch (e) {}
    // smoothScroll removed: no-op
  }, { passive: true });

  // No header show/hide logic present
})();
