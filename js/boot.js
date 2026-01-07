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
    const navTransitionFlag = sessionStorage.getItem('gd_nav_transition') === '1';
    if (navTransitionFlag) {
        sessionStorage.removeItem('gd_nav_transition');
    }

    if (navTransitionFlag) {
        window.__gd_skip_intro = true;
        
        // Cuando el HTML esté listo, forzamos el estado final
        document.addEventListener("DOMContentLoaded", () => {
            document.body.classList.remove("sequence-only");
            document.body.classList.add("header-visible", "hero-visible");
            
            const introLayer = document.getElementById("intro-layer");
            if (introLayer) introLayer.style.display = "none";

            const maskSVG = document.getElementById("radialMaskSVG");
            if (maskSVG) maskSVG.style.display = "none";           
            
            // Avisamos que la intro "terminó" (aunque nos la saltamos)
            window.dispatchEvent(new Event("introComplete"));
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
