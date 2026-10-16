"use strict";
(() => {
    const button = document.getElementById("back-to-top");
    if (!button) return;
    function updateVisibility() {
        const hero = document.querySelector(".hero");
        const threshold = hero ? hero.offsetTop + hero.offsetHeight : 400;
        button.hidden = window.scrollY < threshold;
    }
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
    updateVisibility();
})();
