// Mobile menu functionality for multi-page navigation
function mobileMenuButtonClick(id) {
    for (const element of document.getElementById(id).children) {
        element.hidden = !(element.hidden);
    }
    const btn = document.getElementById(id);
    const header = document.getElementById("header-view");
    const main = document.getElementById("main-view");
    if (btn.className == "mobile-menu-button-inactive") {
        btn.className = "mobile-menu-button-active";
        // add nav-open to animate expansion
        header.classList.add("nav-open");
        // ensure header has visible layout
        header.classList.remove("header-parent-inactive");
        header.classList.add("header-parent");
        main.classList.remove("main-parent");
        main.classList.add("main-parent-inactive");
    } else {
        btn.className = "mobile-menu-button-inactive";
        // collapse the nav with animation
        header.classList.remove("nav-open");
        header.classList.remove("header-parent");
        header.classList.add("header-parent-inactive");
        main.classList.remove("main-parent-inactive");
        main.classList.add("main-parent");
    }
}

// Closes mobile nav (utility function)
function closeMobileNav() {
    const btn = document.getElementById("mobile-menu-button");
    const header = document.getElementById("header-view");
    const main = document.getElementById("main-view");
    if (btn) btn.className = "mobile-menu-button-inactive";
    if (document.getElementById("mobile-menu-open-icon")) document.getElementById("mobile-menu-open-icon").hidden = false;
    if (document.getElementById("mobile-menu-close-icon")) document.getElementById("mobile-menu-close-icon").hidden = true;
    if (header) {
        header.classList.remove("nav-open");
        header.classList.remove("header-parent");
        header.classList.add("header-parent-inactive");
    }
    if (main) {
        main.classList.remove("main-parent-inactive");
        main.classList.add("main-parent");
    }
}