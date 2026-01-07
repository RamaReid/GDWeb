// nav-transition.js - mark internal navigation for mini loader
(function () {
  "use strict";

  const isSameOrigin = (url) => {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch (err) {
      return false;
    }
  };

  const isInternalLink = (link) => {
    if (!link) return false;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return false;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (link.hasAttribute("download")) return false;
    if (link.target && link.target !== "_self") return false;
    if (!isSameOrigin(link.href)) return false;
    return true;
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!isInternalLink(link)) return;
    if (link.href === window.location.href) return;
    sessionStorage.setItem("gd_nav_transition", "1");
  });
})();
