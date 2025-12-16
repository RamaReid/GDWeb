// intro.js
// Controla la secuencia Lift → Drop → Bounce
// Escuchando SOLO las animaciones de intro (no las internas del SVG)

let introExecuted = false;

window.addEventListener("appReady", () => {
    if (introExecuted) return;
    introExecuted = true;

    const container = document.getElementById("loader-container");
    if (!container) return;

    // Tomamos el SVG que quedó en pantalla post-loop
    const svg = container.querySelector("svg");
    if (!svg) return;

    // Estado base explícito
    svg.style.transformOrigin = "50% 70%";
    svg.style.transform = "translateY(0) scale(1)";

    // ---------------- LIFT ----------------
    svg.classList.add("lift-logo");

    svg.addEventListener("animationend", function onLift(e) {
        if (e.target !== svg) return;
        if (e.animationName !== "lift") return;

        svg.removeEventListener("animationend", onLift);
        svg.classList.remove("lift-logo");

        // ---------------- DROP ----------------
        svg.classList.add("drop-logo");

        svg.addEventListener("animationend", function onDrop(e) {
            if (e.target !== svg) return;
            if (e.animationName !== "drop") return;

            svg.removeEventListener("animationend", onDrop);
            svg.classList.remove("drop-logo");

            // ---------------- BOUNCE ----------------
            svg.classList.add("bounce-logo");

            svg.addEventListener("animationend", function onBounce(e) {
                if (e.target !== svg) return;
                if (e.animationName !== "bounce") return;

                svg.removeEventListener("animationend", onBounce);
                svg.classList.remove("bounce-logo");

                // Intro terminada
                window.dispatchEvent(new Event("introComplete"));
            });
        });
    });
});
