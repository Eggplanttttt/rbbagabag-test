"use strict";
(() => {
    const filters = document.querySelector(".filter-buttons");
    const grid = document.getElementById("loan-container");
    if (!filters || !grid) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealed = new WeakSet();
    const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || revealed.has(entry.target)) return;
            const rowTop = entry.target.offsetTop;
            grid.querySelectorAll(".loan-card").forEach(card => {
                if (Math.abs(card.offsetTop - rowTop) > 2 || revealed.has(card)) return;
                revealed.add(card);
                revealObserver.unobserve(card);
                if (reducedMotion.matches || !card.animate) return;
                card.animate([
                    { opacity: 0, transform: "translateY(60px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ], {
                    duration: 1500,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "backwards"
                });
            });
        });
    }, { threshold: 0.08 }) : null;
    function revealCards() {
        if (!revealObserver) return;
        revealObserver.disconnect();
        grid.querySelectorAll(".loan-card").forEach(card => revealObserver.observe(card));
    }
    revealCards();
    let request;
    filters.addEventListener("click", async event => {
        const link = event.target.closest("a.filter-button");
        if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (request) request.abort();
        const current = new AbortController();
        request = current;
        grid.setAttribute("aria-busy", "true");
        try {
            const response = await fetch(link.href, { signal: current.signal });
            if (!response.ok) throw new Error("Unable to load loans");
            const page = new DOMParser().parseFromString(await response.text(), "text/html");
            const nextGrid = page.getElementById("loan-container");
            if (!nextGrid) throw new Error("Missing loan cards");
            grid.replaceChildren(...nextGrid.childNodes);
            revealCards();
            filters.querySelectorAll("a").forEach(button => {
                button.setAttribute("aria-pressed", String(button === link));
                if (button === link) button.setAttribute("aria-current", "true");
                else button.removeAttribute("aria-current");
            });
            history.replaceState(history.state, "", link.href);
        } catch (error) {
            if (error.name !== "AbortError") window.location.assign(link.href);
        } finally {
            if (request === current) grid.removeAttribute("aria-busy");
        }
    });
})();
