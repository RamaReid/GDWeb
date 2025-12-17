// radialReveal.js
// Revelado radial del cover (#background-overlay)
// Origen: centro real del logo final (SVG que queda tras la intro)

(function () {

  function startRadialReveal(options = {}) {

    const duration = options.duration || 12000;

    const overlay = document.getElementById("background-overlay");
    const svgMask = document.getElementById("radialMaskSVG");
    const maskCircle = document.getElementById("maskHole");
    const maskRect = document.getElementById("maskRect");
    const logo = document.querySelector("#loader-container svg");

    if (!overlay || !svgMask || !maskCircle || !maskRect || !logo) {
      return;
    }

    // Medidas reales del overlay
    const overlayRect = overlay.getBoundingClientRect();

    // Ajustar el SVG del mask al tamaño real del overlay
    svgMask.setAttribute("width", overlayRect.width);
    svgMask.setAttribute("height", overlayRect.height);
    svgMask.setAttribute(
      "viewBox",
      `0 0 ${overlayRect.width} ${overlayRect.height}`
    );

    maskRect.setAttribute("width", overlayRect.width);
    maskRect.setAttribute("height", overlayRect.height);

    // Medidas reales del logo final
    const logoRect = logo.getBoundingClientRect();

    // Centro del logo convertido al sistema de coordenadas del overlay
    const cx = logoRect.left + logoRect.width / 2 - overlayRect.left;
    const cy = logoRect.top + logoRect.height / 2 - overlayRect.top;

    // Estado inicial del agujero
    maskCircle.setAttribute("cx", cx);
    maskCircle.setAttribute("cy", cy);
    maskCircle.setAttribute("r", 0);

    // Radio máximo seguro (cubre toda la pantalla)
    const maxRadius = Math.hypot(overlayRect.width, overlayRect.height);

    const startTime = performance.now();

    function animate(now) {
      const t = Math.min(1, (now - startTime) / duration);

      // easing perceptual (similar a tu lenguaje de animaciones)
      const eased = 1 - Math.pow(1 - t, 3);

      maskCircle.setAttribute("r", eased * maxRadius);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // El cover deja de interceptar interacción
        overlay.style.pointerEvents = "none";
      }
    }

    requestAnimationFrame(animate);
  }

  // Exponer API global
  window.startRadialReveal = startRadialReveal;

})();
