---
applyTo: "**/*.{html,css,js}"
---

# Frontend — reglas de implementación (ejecución segura)

- Cambios mínimos y trazables: evitar refactors masivos (salvo Gate C).
- Mantener aire/jerarquía: márgenes consistentes, una idea por escena, no saturar.
- Animaciones: suaves y funcionales; preferir `transform`/`opacity`; evitar animar `top/left/height` salvo necesidad.
- Evitar scrollbars indeseados: revisar `overflow-x/y`, contenedores con `100vh`, padding/márgenes, y elementos `position: fixed/absolute`.
- Hero/header/loop: mínimo Gate B (nunca cambios “rápidos” sin debate si afecta comportamiento o ritmo).
- Performance: evitar listeners duplicados; minimizar reflows.
- Al finalizar: checklist (desktop/responsive/scroll/performance/no regresiones de hero+header+loop).
