// home.js - Versión Final Auditada
(function () {
  "use strict";
  let executed = false;
  const BEAT = 465; 

  const sequenceTimers = [];
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    sequenceTimers.push(id);
    return id;
  };

  const clearSequenceTimers = () => {
    while (sequenceTimers.length) {
      clearTimeout(sequenceTimers.pop());
    }
  };

  const resetSequenceState = () => {
    document.body.classList.remove("header-visible", "hero-visible");

    const heroSection = document.querySelector(".hero-revista-section");
    const hero = document.querySelector(".hero-revista-shell");

    if (heroSection) {
      heroSection.style.opacity = "";
      heroSection.style.visibility = "";
    }

    if (hero) {
      hero.style.transition = "";
      hero.style.opacity = "";
      hero.style.transform = "";
    }
  };

  const runSequence = (options = {}) => {
    clearSequenceTimers();

    if (options.reset) {
      resetSequenceState();
    }

    schedule(() => {
      document.body.classList.add("header-visible");
    }, BEAT * 3);

    schedule(() => {
      document.body.classList.remove("header-visible");
      document.body.classList.add("hero-visible");

      const heroSection = document.querySelector(".hero-revista-section");
      const hero = document.querySelector(".hero-revista-shell");

      if (heroSection) {
        heroSection.style.opacity = "1";
        heroSection.style.visibility = "visible";
      }
      if (hero) {
        hero.style.transition = "opacity 2s ease-out, transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)";
        hero.style.opacity = "1";
        hero.style.transform = "translateY(0) scale(1)";
      }

      const heroShell = document.getElementById("hero-revista-shell");
      if (heroShell && !heroShell.querySelector("iframe")) {
        const src = heroShell.getAttribute("data-hero-src");
        if (src) {
          const iframe = document.createElement("iframe");
          iframe.src = src;
          iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "0";
          iframe.id = "hero-iframe";
          heroShell.appendChild(iframe);
        } else {
          window.dispatchEvent(new Event("HERO_INTERACTION_FALLBACK"));
        }
      } else if (!heroShell) {
        window.dispatchEvent(new Event("HERO_INTERACTION_FALLBACK"));
      }
    }, BEAT * 8);

    const navItems = document.querySelectorAll(".nav-list li");
    navItems.forEach((li, i) => {
      schedule(() => {
        li.style.opacity = "1";
        li.style.transform = "translateY(0)";
      }, (BEAT * 10) + (i * 100));
    });
  };

  window.addEventListener("introComplete", () => {
    if (executed) return;
    executed = true;
    runSequence();
  });


  // Reveal de escenas: Viaje corto de 15px para elegancia
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.scene-card');
        cards.forEach((card, index) => {
          setTimeout(() => card.classList.add('is-visible'), index * 250);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -15% 0px" });

  document.querySelectorAll('.scene').forEach(s => sceneObserver.observe(s));

  // Parallax del plano
  window.addEventListener('scroll', () => {
    const isProjectIndex = document.body.classList.contains('project-index');
    const target = isProjectIndex
      ? document.getElementById('svg-tablero-container')
      : document.getElementById('plano-bg');

    if (target && window.__gd_scroll_unlocked) {
      const offset = window.pageYOffset * 0.1;
      target.style.transform = isProjectIndex
        ? `translateY(${offset}px)`
        : `translateY(${offset}px) scale(1.03)`;
    }
  }, { passive: true });

  // Desbloqueo de scroll
  const unlock = () => {
    if (window.__gd_scroll_unlocked) return;
    window.__gd_scroll_unlocked = true;
    document.body.classList.remove('sequence-only');
  };
  window.addEventListener("message", (e) => { if(e.data?.type?.includes("HERO")) unlock(); });
  window.addEventListener('HERO_INTERACTION_FALLBACK', unlock);

  // --- EL DIRECTOR DE ESCENA (RESETEO DEL RELATO) ---
  const brandLink = document.querySelector('.brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', () => {
      sessionStorage.setItem('gd_nav_transition', '1');
      // Al tocar el logo, las fotos se vuelven invisibles de inmediato
      // para que vuelvan a "nacer" cuando el usuario scrollee hacia abajo.
      document.querySelectorAll('.scene-card').forEach(card => {
        card.classList.remove('is-visible');
      });
      // Nota: El scroll hacia arriba ocurre automaticamente por el href="#inicio"
      setTimeout(() => {
        runSequence({ reset: true });
      }, 0);
    });
  }

})();// home.js - Versión Final Sincronizada "Here Comes the Sun"
