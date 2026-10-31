// Limit a value to the given range.
function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

// Adds gliding to the logo
function initializeGlidingLogo() {
    const layout = document.querySelector(".round-page .round-layout");
    const brand = layout?.querySelector(".round-brand");

    if (!layout || !brand) return;

    const desktop = window.matchMedia("(min-width: 601px)");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Larger values produce a slower, floatier movement.
    const catchUpTime = 300;

    // Limit how far the logo can trail behind its target.
    const maximumLag = 500;

    let enabled = false;
    let currentPosition = 0;
    let frameId = null;
    let previousTime = null;

    function getPositionLimits() {
        const layoutRect = layout.getBoundingClientRect();
        const brandHeight = brand.offsetHeight;

        // Available travel distance within the article.
        const maximum = Math.max(0, layoutRect.height - brandHeight);

        // Center the complete logo + year within the viewport.
        const centeredPosition =
            (window.innerHeight - brandHeight) / 2 - layoutRect.top;

        return {
            target: clamp(centeredPosition, 0, maximum),
            maximum,
        };
    }

    function paintPosition() {
        brand.style.setProperty(
            "--brand-offset",
            `${currentPosition.toFixed(2)}px`
        );
    }

    function animate(time) {
        frameId = null;

        if (!enabled) return;

        const { target, maximum } = getPositionLimits();
        const elapsed = previousTime === null
            ? 16
            : Math.min(time - previousTime, 64);

        previousTime = time;

        // Prevent large wheel movements from leaving the logo far behind.
        currentPosition = clamp(
            currentPosition,
            Math.max(0, target - maximumLag),
            Math.min(maximum, target + maximumLag)
        );

        // Time-based easing behaves consistently across refresh rates.
        const progress = 1 - Math.exp(-elapsed / catchUpTime);

        currentPosition += (target - currentPosition) * progress;

        if (Math.abs(target - currentPosition) < 0.1) {
            currentPosition = target;
            previousTime = null;
            paintPosition();
            return;
        }

        paintPosition();
        frameId = window.requestAnimationFrame(animate);
    }

    function requestUpdate() {
        if (!enabled || frameId !== null) return;

        frameId = window.requestAnimationFrame(animate);
    }

    function updateMode() {
        enabled = desktop.matches && !reducedMotion.matches;

        if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
        }

        previousTime = null;
        brand.classList.toggle("is-gliding", enabled);

        if (!enabled) {
            brand.style.removeProperty("--brand-offset");
            return;
        }

        // Start centered instead of flying down from the top on page load.
        currentPosition = getPositionLimits().target;
        paintPosition();
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    desktop.addEventListener("change", updateMode);
    reducedMotion.addEventListener("change", updateMode);

    // Recalculate when images, fonts, or article content change size.
    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(layout);
    resizeObserver.observe(brand);

    updateMode();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGlidingLogo);
} else {
    initializeGlidingLogo();
}