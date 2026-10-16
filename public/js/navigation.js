

(function () {
    const menuButton = document.querySelector(".menu-button");
    const mainMenu = document.querySelector("#main-menu");

    if (menuButton && mainMenu) {
        menuButton.addEventListener("click", function () {
            const isOpen = mainMenu.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", isOpen);
        });
    }

    document.querySelectorAll(".dropdown-toggle").forEach(function (toggleButton) {
        toggleButton.addEventListener("click", function () {
            const isOpen = toggleButton.parentElement.classList.toggle("open");
            toggleButton.setAttribute("aria-expanded", isOpen);
        });
    });


    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") { return; }
        document.querySelectorAll(".has-dropdown.open").forEach(function (item) {
            item.classList.remove("open");
            item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
        });
    });
})();
