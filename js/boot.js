// boot.js — gate: window.load + (loaderCycles >= 2) => appReady
(function () {
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
