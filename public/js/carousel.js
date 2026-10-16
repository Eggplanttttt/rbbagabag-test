
document.querySelectorAll(".carousel").forEach(function (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const dotsBox = carousel.querySelector(".carousel-dots");
    if (slides.length === 0) { return; }

    let autoTimer = null;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    function slidesPerPage() {
        return Math.max(1, Math.round(track.clientWidth / slides[0].offsetWidth));
    }
    function pageCount() {
        return Math.ceil(slides.length / slidesPerPage());
    }
    function currentPage() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 2) { return pageCount() - 1; }
        const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 1;
        return Math.round(track.scrollLeft / (step * slidesPerPage()));
    }
    function goToPage(page) {
        const total = pageCount();
        const target = (page + total) % total;   
        const left = slides[target * slidesPerPage()].offsetLeft - slides[0].offsetLeft;
        track.scrollTo({ left: left, behavior: calm.matches ? "auto" : "smooth" });
    }

    function buildDots() {
        let dots = "";
        for (let i = 0; i < pageCount(); i++) {
            dots += '<button type="button" class="carousel-dot" aria-label="Go to page ' + (i + 1) + '"></button>';
        }
        dotsBox.innerHTML = dots;
        dotsBox.querySelectorAll(".carousel-dot").forEach(function (dot, i) {
            dot.addEventListener("click", function () { goToPage(i); restartAuto(); });
        });
        markActiveDot();
    }
    function markActiveDot() {
        const page = currentPage();
        dotsBox.querySelectorAll(".carousel-dot").forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === page);
            dot.setAttribute("aria-current", i === page ? "true" : "false");
        });
    }


    function startAuto() {
        if (calm.matches || pageCount() < 2) { return; }
        stopAuto();
        autoTimer = setInterval(function () { goToPage(currentPage() + 1); }, 5000);
    }
    function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
    function restartAuto() { stopAuto(); startAuto(); }

    carousel.querySelector(".carousel-prev").addEventListener("click", function () { goToPage(currentPage() - 1); restartAuto(); });
    carousel.querySelector(".carousel-next").addEventListener("click", function () { goToPage(currentPage() + 1); restartAuto(); });
    track.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") { goToPage(currentPage() - 1); }
        if (event.key === "ArrowRight") { goToPage(currentPage() + 1); }
    });

    let ticking = false;
    track.addEventListener("scroll", function () {
        if (ticking) { return; }
        ticking = true;
        requestAnimationFrame(function () { markActiveDot(); ticking = false; });
    });
    window.addEventListener("resize", buildDots);

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);

    buildDots();
    startAuto();
});
