// Inicialización de PageFlip (versión estable + fix de ghosting)
document.addEventListener('DOMContentLoaded', function () {


    // =======================================
    // AVISAR AL HOME: INTERACCIONES DEL HERO
    // Enviar mensaje al padre en cada pointerdown dentro del hero
    // para que el header pueda ocultarse cada vez que el usuario
    // interactúe con la revista.
    // =======================================
    document.addEventListener("pointerdown", () => {
        window.parent.postMessage(
            { type: "HERO_INTERACTION" },
            "*"
        );
    });

    // =======================================
    // AVISAR AL HOME: INTENCIÓN DE SCROLL
    // =======================================
    let scrollIntentSent = false;

    const notifyScrollIntent = () => {
        if (scrollIntentSent) return;

        scrollIntentSent = true;

        window.parent.postMessage(
            { type: "HERO_SCROLL_INTENT" },
            "*"
        );  
    };

    // Rueda de mouse
    document.addEventListener("wheel", notifyScrollIntent, { passive: true });

    // Touch (mobile)
    document.addEventListener("touchmove", notifyScrollIntent, { passive: true });
    
    // ===============================
    // CONTENEDOR
    // ===============================
    const container = document.getElementById('mi-revista');

    if (!container) {
        console.error('No se encontró el contenedor #mi-revista.');
        return;
    }

    if (typeof St === 'undefined' || !St.PageFlip) {
        console.error('La librería PageFlip (St) no está cargada.');
        return;
    }

    // ===============================
    // DIMENSIONES
    // ===============================
    const pageWidth  = Math.floor(window.innerWidth / 2);
    const pageHeight = window.innerHeight;

    const pageFlip = new St.PageFlip(container, {
        width: pageWidth,
        height: pageHeight,
        size: 'stretch',
        minWidth: 315,
        maxWidth: 3000,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        showCover: false,
        mobileScrollSupport: false
    });

    // ===============================
    // ASEGURAR PÁGINAS PARES
    // ===============================
    (function ensureEvenTotalPages(){
        const allPages = Array.from(container.querySelectorAll('.page'));
        if (allPages.length % 2 !== 0) {
            const last = allPages[allPages.length - 1];
            const blank = document.createElement('div');
            blank.className = 'page';
            blank.setAttribute('data-name', 'blank-inserted');
            last.parentNode.insertBefore(blank, last);
            console.log('Se insertó página en blanco para paridad.');
        }
    })();

    // ===============================
    // CARGAR PÁGINAS
    // ===============================
    pageFlip.loadFromHTML(container.querySelectorAll('.page'));
    window.pageFlip = pageFlip;

    console.log('PageFlip inicializado en #mi-revista', pageFlip);

    // ===============================
    // MAPA DE PÁGINAS (DEBUG)
    // ===============================
    (function logPageNames(){
        const pages = container.querySelectorAll('.page');
        const map = [];
        pages.forEach((p, i) => {
            map.push({ index: i, id: p.id || null, name: p.getAttribute('data-name') || null });
        });
        console.log('Mapa de páginas:', map);
    })();

    // =====================================================
    // 🔧 FIX REAL DEL PROBLEMA (GHOSTING AL AVANZAR)
    // =====================================================
    // NO toca CSS
    // NO rompe fluidez
    /// ===============================
    // FIX GHOSTING — versión estable
    // ===============================
    const pageContents = container.querySelectorAll('.page-content');

    // Asegurar visibilidad inicial
    pageContents.forEach(el => {
        el.style.opacity = '1';
    });

    // Durante el flip → ocultar suavemente
    pageFlip.on('flip', () => {
        pageContents.forEach(el => {
            el.style.opacity = '0';
        });
    });

    // Cuando el flip termina y queda estable → mostrar
    pageFlip.on('changeState', (e) => {
        if (e.data === 'read') {
            pageContents.forEach(el => {
                el.style.opacity = '1';
            });
        }
    });
    // Evita que PageFlip reutilice el frame anterior


    // ===============================
    // RESIZE
    // ===============================
    window.addEventListener('resize', function(){
        try {
            const newPageWidth  = Math.floor(window.innerWidth / 2);
            const newPageHeight = window.innerHeight;

            if (typeof pageFlip.update === 'function') {
                pageFlip.update({ width: newPageWidth, height: newPageHeight });
            } else if (typeof pageFlip.resize === 'function') {
                pageFlip.resize(newPageWidth, newPageHeight);
            }
        } catch (e) {
            console.error('Error al redimensionar PageFlip:', e);
        }
    });

});
