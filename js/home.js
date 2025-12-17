// home.js
// Controla la aparición del Header y el Hero
// después de finalizar la Intro

(function () {
  "use strict";

  let executed = false;

  window.addEventListener("introComplete", () => {
    if (executed) return;
    executed = true;

    // 1. Mostrar Header
    document.body.classList.add("header-visible");

    // 2. Mostrar Hero (efecto revista)
    setTimeout(() => {
      document.body.classList.add("hero-visible");
    }, 400); // delay editorial
  });

})();
