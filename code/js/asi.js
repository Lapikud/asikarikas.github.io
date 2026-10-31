// Navigation template (GitHub Pages compatible)
function getNavigationHTML() {
    return `
    <header>
        <div class="mobile-menu">
            <button type="button" id="mobile-menu-button" class="mobile-menu-button-inactive" aria-label="Ava menüü"
                aria-controls="header-view"
                aria-expanded="false"
                onclick="mobileMenuButtonClick()">
                <img id="mobile-menu-open-icon" src="assets/icon/menu-open.svg" alt="">
                <img id="mobile-menu-close-icon" src="assets/icon/menu-close.svg" alt="" hidden>
            </button>
        </div>
        <div class="header-parent-inactive" id="header-view">
            <a href="index.html" data-page="index.html">Mis on ASI Karikas?</a>
            <a href="miks-osaleda.html" data-page="miks-osaleda.html">Miks osaleda?</a>
            <a href="esimene-voor.html" data-page="esimene-voor.html">I voor</a>
            <a href="teine-voor.html" data-page="teine-voor.html">II voor</a>
            <a href="loppvoor.html" data-page="loppvoor.html">Lõppvoor</a>
            <a href="reeglid.html" data-page="reeglid.html">Reeglid</a>
            <a href="arhiiv.html" data-page="arhiiv.html">Arhiiv</a>
            <a href="toetajad.html" data-page="toetajad.html">Toetajad</a>
        </div>
    </header>`;
}

function loadNavigation() {
    try {
        if (!document.getElementById("header-view")) {
        document.body.insertAdjacentHTML("afterbegin", getNavigationHTML());
        }

        const currentPage = (
    window.location.pathname.split("/").findLast(Boolean) || "index"
).replace(/\.html$/, "");

        const navLinks = document.querySelectorAll("#header-view a[data-page]");
        
        navLinks.forEach((link) => {
          const linkPage = link.dataset.page.replace(/\.html$/, "");
          const isCurrentPage = linkPage === currentPage;

          link.classList.toggle("active", isCurrentPage);
          link.classList.toggle("inactive", !isCurrentPage);

          if (isCurrentPage) {
              link.setAttribute("aria-current", "page");
          } else {
              link.removeAttribute("aria-current");
          }
      });
      
        // Ensure footer is present on the page (insert once)
        if (!document.getElementById('site-footer')) {
            document.body.insertAdjacentHTML('beforeend', getFooterHTML());
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadNavigation);

// Mobile menu functionality for multi-page navigation
function setMobileNavOpen(isOpen) {
    const btn = document.getElementById("mobile-menu-button");
    const header = document.getElementById("header-view");
    const main = document.getElementById("main-view");
    const openIcon = document.getElementById("mobile-menu-open-icon");
    const closeIcon = document.getElementById("mobile-menu-close-icon");

    if (!btn || !header || !main || !openIcon || !closeIcon) {
        return;
    }

    btn.classList.toggle("mobile-menu-button-active", isOpen);
    btn.classList.toggle("mobile-menu-button-inactive", !isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.setAttribute("aria-label", isOpen ? "Sulge menüü" : "Ava menüü");

    openIcon.hidden = isOpen;
    closeIcon.hidden = !isOpen;

    header.classList.toggle("header-parent", isOpen);
    header.classList.toggle("header-parent-inactive", !isOpen);

    main.classList.toggle("main-parent-inactive", isOpen);
    main.classList.toggle("main-parent", !isOpen);
}

function mobileMenuButtonClick() {
    const btn = document.getElementById("mobile-menu-button");
    if (!btn) return;

    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setMobileNavOpen(!isOpen);
}

function closeMobileNav() {
    setMobileNavOpen(false);
}

// Restore the page when switching to desktop layout.
const mobileLayout = window.matchMedia("(max-width: 600px)");

mobileLayout.addEventListener("change", (event) => {
    if (!event.matches) {
        closeMobileNav();
    }
});

// Allow keyboard users to close the menu.
document.addEventListener("keydown", (event) => {
    const btn = document.getElementById("mobile-menu-button");

    if (
        event.key === "Escape" &&
        btn?.getAttribute("aria-expanded") === "true"
    ) {
        closeMobileNav();
        btn.focus();
    }
});

function getFooterHTML() {
    return `
            <footer id="site-footer" class="footer">
                <h1 class="footer-title">
                    Tekkisid küsimused?
                </h1>
                <p>
                    Kirjuta meile <a href="mailto:asikarikas@asikarikas.ee">asikarikas@asikarikas.ee</a> 
                    ja me vastame esimesel võimalusel.
                </p>
            </footer>
    `;
}

function initializeHeroHeight() {
    const hero = document.querySelector(".home-page .home-hero");
    if (!hero) return;

    function updateHeroHeight() {
        // Skip measuring while the mobile menu hides the main content.
        if (hero.getClientRects().length === 0) return;

        const heroTop = hero.getBoundingClientRect().top + window.scrollY;

        hero.style.setProperty("--hero-top", `${heroTop}px`);
    }

    updateHeroHeight();

    window.addEventListener("resize", updateHeroHeight);

    // Update when navigation wraps or changes height.
    const header = document.querySelector("body > header");

    if (header) {
        const observer = new ResizeObserver(updateHeroHeight);
        observer.observe(header);
    }

    // Font loading can change the navigation's height.
    document.fonts.ready
    .then(updateHeroHeight)
    .catch((error) => {
        console.error("Could not update hero height after font loading:", error);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeHeroHeight);
} else {
    initializeHeroHeight();
}