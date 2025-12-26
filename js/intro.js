/**
 * intro.js
 * Gestiona la coreografía física del logo: Lift → Drop → Bounce.
 * Al finalizar, inicia el Radial Reveal (amanecer) y libera el Home.
 */

let introExecuted = false;

window.addEventListener("appReady", () => {

  if (window.__gd_skip_intro) return; 

  if (introExecuted) return;
  introExecuted = true;

  const container = document.getElementById("loader-container");
  const svg = container?.querySelector("svg");
  
  if (!svg) {
    console.warn("GD Intro: No se encontró el SVG del loader.");
    // Fallback de seguridad: si no hay SVG, liberamos el sitio igual
    window.dispatchEvent(new Event("introComplete"));
    document.body.classList.remove("sequence-only");
    return;
  }

  /* ======================================================
     1. CONFIGURACIÓN INICIAL
     Aseguramos el punto de apoyo para que el rebote sea natural.
  ====================================================== */
  svg.style.transformOrigin = "50% 70%";
  
  // Iniciamos la primera fase: Elevación (Lift)
  svg.classList.add("lift-logo");

  /* ======================================================
     2. GESTIÓN DE ANIMACIONES ENCADENADAS
  ====================================================== */

  svg.addEventListener("animationend", function onAnimationEnd(e) {
    // Solo escuchamos animaciones que ocurren en el SVG principal
    if (e.target !== svg) return;

    // --- FASE: LIFT FINALIZADA ---
    if (e.animationName === "lift") {
      svg.classList.remove("lift-logo");
      // Iniciamos Caída (Drop)
      svg.classList.add("drop-logo");
    }

    // --- FASE: DROP FINALIZADA ---
    else if (e.animationName === "drop") {
      svg.classList.remove("drop-logo");
      // Iniciamos Rebote final (Bounce)
      svg.classList.add("bounce-logo");
    }

    // --- FASE: BOUNCE FINALIZADA (El momento de la verdad) ---
    else if (e.animationName === "bounce") {
      svg.removeEventListener("animationend", onAnimationEnd);
      svg.classList.remove("bounce-logo");

      /* ======================================================
         3. EL AMANECER (Hand-off al Home)
         El logo físico termina y comienza la revelación del plano.
      ====================================================== */

      // A. Desvanecimiento suave del logo del loader (0.6s)
      svg.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      svg.style.opacity = "0";

      // B. Inicio del Radial Reveal (El telón se abre)
      // Duración de 6s para apreciar la nitidez del plano técnico.
      if (typeof window.startRadialReveal === "function") {
        window.startRadialReveal({
          duration: 6000 
        });
      }

      sessionStorage.setItem('gd_intro_done', 'true'); 

      // C. Disparo del evento crítico para home.js
      // Esto inicia el conteo de BEATS (Here Comes the Sun).
      window.dispatchEvent(new Event("introComplete"));

      // D. Liberación del bloqueo de scroll
      // Permite que la estructura del sitio sea interactiva.
      document.body.classList.remove("sequence-only");

      setTimeout(() => {
          const introLayer = document.getElementById("intro-layer");
          const maskSVG = document.getElementById("radialMaskSVG");
          if (introLayer) introLayer.style.display = "none";
          if (maskSVG) maskSVG.style.display = "none";
      }, 6500); // Esperamos a que el Radial Reveal termine (6s + margen)
      }
  });
});