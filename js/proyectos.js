// proyectos.js - hero board background and reveal effects
(function () {
  "use strict";

  const revealCards = () => {
    const items = document.querySelectorAll(".reveal-text, .reveal-image");
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 500 + (index * 100));
    });
  };

  window.addEventListener("load", () => {
    const container = document.getElementById("svg-tablero-container");
    if (!container) {
      revealCards();
      return;
    }

    fetch("img/Cedahause/svg/casaCedahause.svg")
      .then((response) => response.text())
      .then((svg) => {
        container.innerHTML = svg;
        revealCards();
      })
      .catch(() => {
        revealCards();
      });
  });
})();
