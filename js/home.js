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
          heroSection.style.transition = "opacity 1.5s ease";
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

            // Fallback: si el contenido del iframe no emite postMessage,
            // igual ocultamos el header al primer click/tap en el iframe.
            const hideHeaderFromIframe = () => {
              document.body.classList.add("hero-interacting");
              document.body.classList.remove("header-visible");
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
          hero.style.transition =
            "opacity 1.5s ease, transform 2.5s cubic-bezier(0.22,0.6,0.2,1)";
          hero.style.opacity = "1";
          hero.style.transform = "scale(1)";
        }
      }, 1200);
    }, HOME_DELAY);
  });
})();

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
  let heroActivated = false;

  // Unlock scroll once (called from hero interaction or header interaction)
  function unlockScrollOnce(showHeader = false) {
    if (window.__gd_scroll_unlocked) return;
    window.__gd_scroll_unlocked = true;

    // Remove the intro-only lock so page can scroll
    document.body.classList.remove('sequence-only');

    // optionally ensure header is visible after unlock
    if (showHeader) {
      document.body.classList.add('header-visible');
    }

    // clear any inline height styles that might prevent scroll
    try {
      document.documentElement.style.height = '';
      document.body.style.height = '';
    } catch (e) {
      // noop
    }
  }

  // Allow header interactions to also unlock the scroll
  const headerEl = document.querySelector('.gd-header');
  if (headerEl) {
    headerEl.addEventListener('pointerdown', function () { unlockScrollOnce(true); }, { passive: true });
  }

  const restoreHeader = () => {
    if (!heroActivated) return;

    heroActivated = false;

    document.body.classList.remove("hero-interacting");
    document.body.classList.add("header-visible");
  };

  // Mensajes desde el iframe
  window.addEventListener("message", (event) => {
    if (!event.data || !event.data.type) return;

    // Soporta ambos nombres de evento (según versión del hero)
    if (event.data.type === "HERO_INTERACTION" || event.data.type === "HERO_USER_INTERACT") {
      // interaction with hero: unlock scroll but keep header hidden (hero-interacting)
      unlockScrollOnce(false);

      if (heroActivated) return;

      heroActivated = true;
      document.body.classList.add("hero-interacting");
      document.body.classList.remove("header-visible");
    }

    // Soporta variantes (por si el hero manda otro alias)
    if (event.data.type === "HERO_SCROLL_INTENT" || event.data.type === "HERO_SCROLL") {
      // intent to scroll: unlock and show header
      unlockScrollOnce(true);
      restoreHeader();
    }
  });

  // Fallback: wheel fuera del iframe (por si ocurre)
  window.addEventListener("wheel", restoreHeader, { passive: true });
  window.addEventListener("touchmove", restoreHeader, { passive: true });
})();
