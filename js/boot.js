// boot.js — gate: window.load + (loaderCycles >= 2) => appReady
(function () {
    // Ensure reload starts at top (avoid scroll restoration).
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
        if (window.location.hash) return;
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    window.addEventListener("pageshow", resetScroll);
    document.addEventListener("DOMContentLoaded", resetScroll);
    // --- NUEVO: Lógica de Salto de Intro ---
    const navTransitionStored = sessionStorage.getItem('gd_nav_transition') === '1';
    if (navTransitionStored) {
        sessionStorage.removeItem('gd_nav_transition');
    }

    const path = window.location.pathname || "";
    const isIndexPage = path.endsWith("/") || /\/(index|index1)\.html$/i.test(path);
    const navTransitionFlag = navTransitionStored || !isIndexPage;

    if (navTransitionFlag) {
        window.__gd_skip_intro = true;
        window.stopLoaderLoop = true;

        // Cuando el HTML este listo, esperamos al menos 1 ciclo del loader
        // antes de iniciar el radial reveal y liberar la pagina.
        document.addEventListener("DOMContentLoaded", () => {
            let navResolved = false;
            const revealDuration = 6000;

            const resolveNav = () => {
                if (navResolved) return;
                navResolved = true;
                delete window.__gd_nav_wait;

                const logo = document.querySelector("#loader-container svg");
                if (logo) {
                    logo.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                    logo.style.opacity = "0";
                }

                if (typeof window.startRadialReveal === "function") {
                    window.startRadialReveal({ duration: revealDuration });
                }

                document.body.classList.remove("sequence-only");
                window.dispatchEvent(new Event("introComplete"));

                setTimeout(() => {
                    const introLayer = document.getElementById("intro-layer");
                    const maskSVG = document.getElementById("radialMaskSVG");
                    if (introLayer) introLayer.style.display = "none";
                    if (maskSVG) maskSVG.style.display = "none";
                }, revealDuration + 500);
            };

            const onCycle = () => {
                if (typeof window.loaderCycles !== "number") return;
                if (window.loaderCycles < 1) return;
                resolveNav();
            };

            const fallback = setTimeout(resolveNav, 5500);

            // Hook de loader.js para esperar al menos un ciclo.
            window.__gd_nav_wait = () => {
                clearTimeout(fallback);
                onCycle();
            };

            // Si ya tenemos ciclos, resolvemos sin esperar.
            onCycle();
        });
    }
    // --- FIN Lógica de Salto ---
    let loaded = false;

    window.addEventListener("load", () => {
        loaded = true;
        maybeReady();
    });

    function maybeReady() {
        if (!loaded) return;
        if (typeof window.loaderCycles !== "number") return;
        if (window.loaderCycles < 2) return;

        // Disparar una sola vez
        if (window.__gd_app_ready_fired) return;
        window.__gd_app_ready_fired = true;

        // 🔑 Activar POST-LOOP antes de iniciar la intro
        window.stopLoaderLoop = true;

        window.dispatchEvent(new Event("appReady"));
    }

    // Hook para que loader.js avise cuando suma ciclos
    window.__gd_maybeReady = maybeReady;
})();
