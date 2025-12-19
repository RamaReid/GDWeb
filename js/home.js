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
    const HOME_DELAY = 1500; // ms (ajustable, no rompe nada)

    setTimeout(() => {
      // 1. Mostrar header (ya tiene animación por CSS)
      document.body.classList.add("header-visible");

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
      navItems.forEach(li => {
        li.style.opacity = "0";
        li.style.transform = "translateY(6px)";
      });
      if (hero) {
        hero.style.opacity = "0";
        hero.style.transform = "scale(0.98)";
      }

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
        const heroShell   = document.getElementById("hero-revista-shell");

        document.body.classList.add("hero-visible");

        if (heroSection) {
            heroSection.style.transition = "opacity 0.5s ease";
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

                heroShell.appendChild(iframe);
            } else {
                console.warn(
                "Hero revista: falta data-hero-src en #hero-revista-shell"
                );
            }
        }

        if (hero) {
            hero.style.transition =
                "opacity 0.5s ease, transform 0.8s cubic-bezier(0.22,0.6,0.2,1)";
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

  const restoreHeader = () => {
    if (!heroActivated) return;

    heroActivated = false;

    document.body.classList.remove("hero-interacting");
    document.body.classList.add("header-visible");
  };

  // Mensajes desde el iframe
  window.addEventListener("message", (event) => {

    if (!event.data || !event.data.type) return;

    if (event.data.type === "HERO_INTERACTION") {
      if (heroActivated) return;

      heroActivated = true;
      document.body.classList.add("hero-interacting");
      document.body.classList.remove("header-visible");
    }

    if (event.data.type === "HERO_SCROLL_INTENT") {
      restoreHeader();
    }
  });

  // Fallback: wheel fuera del iframe (por si ocurre)
  window.addEventListener("wheel", restoreHeader, { passive: true });
  window.addEventListener("touchmove", restoreHeader, { passive: true });

})();
