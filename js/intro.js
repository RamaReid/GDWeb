// intro.js
// Lift → Drop → Bounce
// El radial reveal comienza AL INICIAR el bounce
// El logo desaparece AL FINALIZAR el bounce

let introExecuted = false;

window.addEventListener("appReady", () => {
  if (introExecuted) return;
  introExecuted = true;

  const container = document.getElementById("loader-container");
  if (!container) return;

  const svg = container.querySelector("svg");
  if (!svg) return;

  // Estado base
  svg.style.transformOrigin = "50% 70%";
  svg.style.transform = "translateY(0) scale(1)";

  // -------- LIFT --------
  svg.classList.add("lift-logo");

  svg.addEventListener("animationend", function onLift(e) {
    if (e.target !== svg || e.animationName !== "lift") return;

    svg.removeEventListener("animationend", onLift);
    svg.classList.remove("lift-logo");

    // -------- DROP --------
    svg.classList.add("drop-logo");

    svg.addEventListener("animationend", function onDrop(e) {
      if (e.target !== svg || e.animationName !== "drop") return;

      svg.removeEventListener("animationend", onDrop);
      svg.classList.remove("drop-logo");

      // -------- BOUNCE --------
      svg.classList.add("bounce-logo");

      // 🔑 EL REVEAL EMPIEZA ACÁ (inicio del rebote)
      if (typeof window.startRadialReveal === "function") {
        window.startRadialReveal({
          duration: 13500
        });
      }

      svg.addEventListener("animationend", function onBounce(e) {
        if (e.target !== svg || e.animationName !== "bounce") return;

        svg.removeEventListener("animationend", onBounce);
        svg.classList.remove("bounce-logo");

        // El logo desaparece al finalizar el rebote
        svg.style.transition = "opacity 0.6s ease";
        svg.style.opacity = "0";

        // Evento de cierre de intro (opcional, pero limpio)
        window.dispatchEvent(new Event("introComplete"));

        // Mostrar el plano cuando el logo ya salió
        document.body.classList.add("plano-visible");

      });
    });
  });
});
