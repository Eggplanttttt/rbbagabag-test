

document.addEventListener("error", function (event) {
    const image = event.target;
    if (image.tagName === "IMG" && !image.dataset.usedFallback) {
        image.dataset.usedFallback = "yes";   
        image.src = "/assets/images/placeholder.svg";
    }
}, true);


document.querySelectorAll("img").forEach(function (image) {
    if (image.complete && image.naturalWidth === 0 && !image.dataset.usedFallback) {
        image.dataset.usedFallback = "yes";
        image.src = "/assets/images/placeholder.svg";
    }
});
