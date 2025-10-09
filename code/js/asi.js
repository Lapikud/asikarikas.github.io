var active_id = "b1"

function buttonClick(id) {
    // If the clicked tab is already active, just close the mobile nav (if open)
    if (active_id == id) {
        closeMobileNav();
        return;
    }
    if (active_id != id) {
        document.getElementById(active_id).className = "inactive";
        document.getElementById(id).className = "active";

        document.getElementById(active_id).firstChild.className = "inactive-icon";
        document.getElementById(id).firstChild.className = "active-icon";

        document.getElementById(active_id+"-view").hidden = true;
        document.getElementById(id+"-view").hidden = false;

        // ensure mobile menu icons and classes are reset and close the nav UI
        document.getElementById("mobile-menu-open-icon").hidden = false;
        document.getElementById("mobile-menu-close-icon").hidden = true;
        document.getElementById("mobile-menu-button").className = "mobile-menu-button-inactive";
        document.getElementById("header-view").classList.remove("nav-open");
        document.getElementById("header-view").className = "header-parent-inactive";
        document.getElementById("main-view").className = "main-parent";

        active_id = id;
    }
}

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

// Closes mobile nav (used when user taps the already-active tab)
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