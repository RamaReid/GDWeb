// loader.js — Loop infinito + estado POST-LOOP (no swap de SVG)

let cycleCount = 0;
window.loaderCycles = 0;

// Control externo (boot.js decide cuándo frenar)
window.stopLoaderLoop = false;

document.addEventListener("DOMContentLoaded", initLoader);

function initLoader() {
    const container = document.getElementById("loader-container");
    if (!container) return;
    startLoop(container);
}

function startLoop(container) {
    const svg = container.querySelector("svg");
    if (!svg) return;

    const lastStroke = svg.querySelector(".str5");
    if (!lastStroke) return;

    lastStroke.addEventListener(
        "animationend",
        () => {
            cycleCount++;
            window.loaderCycles = cycleCount;

            // Avisar al gate
            if (typeof window.__gd_maybeReady === "function") {
                window.__gd_maybeReady();
            }

            // ====== POST-LOOP ======
            // Si el gate activó stopLoaderLoop:
            // - NO clonar
            // - NO reiniciar
            // - Dejar ESTE MISMO SVG vivo (logo final)
            if (window.stopLoaderLoop) {
                svg.classList.add("post-loop");
                return;
            }

            // ====== LOOP INFINITO ======
            // Reiniciar clonando (comportamiento original)
            const clone = svg.cloneNode(true);
            container.innerHTML = "";
            container.appendChild(clone);

            // reflow
            void container.offsetWidth;

            startLoop(container);
        },
        { once: true }
    );
}
