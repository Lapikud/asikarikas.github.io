// Navigation template (GitHub Pages compatible)
function getNavigationHTML() {
    return `
    <header>
        <div class="mobile-menu">
            <button id="mobile-menu-button" class="mobile-menu-button-inactive"
                onclick="mobileMenuButtonClick(this.id)">
                <img id="mobile-menu-open-icon" src="assets/icon/menu-open.svg" class="mobile-menu-open-icon">
                <img id="mobile-menu-close-icon" src="assets/icon/menu-close.svg" class="mobile-menu-close-icon"
                    hidden="">
            </button>
        </div>
        <div class="header-parent-inactive" id="header-view">
            <a href="index.html" data-page="index.html">Mis on ASI Karikas?</a>
            <a href="miks-osaleda.html" data-page="miks-osaleda.html">Miks osaleda?</a>
            <a href="koduvoor.html" data-page="koduvoor.html">Koduvoor</a>
            <a href="loppvoor.html" data-page="loppvoor.html">Lõppvoor</a>
            <a href="reeglid.html" data-page="reeglid.html">Reeglid</a>
            <a href="arhiiv.html" data-page="arhiiv.html">Arhiiv</a>
            <a href="toetajad.html" data-page="toetajad.html">Toetajad</a>
        </div>
    </header>`;
}

function loadNavigation() {
    try {
        const navigationHTML = getNavigationHTML();
        document.body.insertAdjacentHTML('afterbegin', navigationHTML);
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('header a[data-page]');

        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
                link.classList.remove('inactive');
            } else {
                link.classList.add('inactive');
                link.classList.remove('active');
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

function getFooterHTML() {
    return `
        <div style="text-align: center">
            <footer id="site-footer" class="footer">
                <h1 style="font-size: x-large">
                    Tekkisid küsimused?
                </h1>
                <p style="font-size: small; text-align: center">
                    Kirjuta meile <a href="mailto:asikarikas@asikarikas.ee">asikarikas@asikarikas.ee</a> 
                    ja me vastame esimesel võimalusel.
                </p>
            </footer>
        </div>
    `;
}
