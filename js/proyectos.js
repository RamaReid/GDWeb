// proyectos.js - hero collage and chapter reveals
(function () {
  "use strict";

  let heroStarted = false;

  const startHeroCollage = () => {
    if (heroStarted) return;
    const collage = document.querySelector(".hero-collage");
    if (!collage) return;
    heroStarted = true;
    setTimeout(() => {
      collage.classList.add("is-visible");
      const items = Array.from(collage.querySelectorAll(".hero-photo"));
      if (!items.length) {
        collage.classList.add("is-ready");
        return;
      }
      const maxDelay = items.reduce((max, item) => {
        const delayValue = parseFloat(item.style.getPropertyValue("--delay")) || 0;
        return Math.max(max, delayValue);
      }, 0);
      const entryDuration = 1250;
      const settleBuffer = 200;
      window.setTimeout(() => {
        collage.classList.add("is-ready");
      }, maxDelay + entryDuration + settleBuffer);
    }, 1600);
  };

  const waitForHero = () => {
    const start = performance.now();
    const tick = () => {
      if (document.body.classList.contains("hero-visible") || performance.now() - start > 7000) {
        startHeroCollage();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  };

  const revealChapterCards = () => {
    const sections = document.querySelectorAll(".projects-chapter");
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => {
        section.querySelectorAll(".scene-card").forEach((card) => card.classList.add("is-visible"));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const cards = entry.target.querySelectorAll(".scene-card");
          cards.forEach((card, index) => {
            setTimeout(() => card.classList.add("is-visible"), index * 220);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const updateActiveHero = () => {
    const collage = document.querySelector(".hero-collage");
    if (!collage) return;

    const mql = window.matchMedia("(max-width: 900px)");
    if (!mql.matches) {
      collage.querySelectorAll(".hero-photo.is-active").forEach((item) => item.classList.remove("is-active"));
      return;
    }

    const items = Array.from(collage.querySelectorAll(".hero-photo"));
    if (!items.length) return;

    const rect = collage.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    let closest = items[0];
    let minDistance = Infinity;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        closest = item;
      }
    });

    items.forEach((item) => item.classList.toggle("is-active", item === closest));
  };

  const bindHeroScroll = () => {
    const collage = document.querySelector(".hero-collage");
    if (!collage) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveHero();
        ticking = false;
      });
    };

    collage.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveHero);
    updateActiveHero();
  };

  window.addEventListener("introComplete", waitForHero);

  window.addEventListener("load", () => {
    const container = document.getElementById("svg-tablero-container");
    const afterSvg = () => {
      revealChapterCards();
      waitForHero();
      bindHeroScroll();
    };

    if (!container) {
      afterSvg();
      return;
    }

    fetch("img/Cedahause/svg/casaCedahause.svg")
      .then((response) => response.text())
      .then((svg) => {
        container.innerHTML = svg;
        afterSvg();
      })
      .catch(() => {
        afterSvg();
      });
  });
})();
