var active_id = "b1"

function buttonClick(id) {
    if (active_id != id) {
        document.getElementById(active_id).className = "inactive";
        document.getElementById(id).className = "active";

        document.getElementById(active_id).firstChild.className = "inactive-icon";
        document.getElementById(id).firstChild.className = "active-icon";

        document.getElementById(active_id+"-view").hidden = true;
        document.getElementById(id+"-view").hidden = false;

        document.getElementById("mobile-menu-open-icon").hidden = false;
        document.getElementById("mobile-menu-close-icon").hidden = true;
        document.getElementById("mobile-menu-button").className = "mobile-menu-button-inactive";
        document.getElementById("header-view").className = "header-parent-inactive";
        document.getElementById("main-view").className = "main-parent";

        active_id = id;
    }
}

function mobileMenuButtonClick(id) {
    for (const element of document.getElementById(id).children) {
        element.hidden = !(element.hidden);
    }
    if (document.getElementById(id).className == "mobile-menu-button-inactive") {
        document.getElementById(id).className = "mobile-menu-button-active";
        document.getElementById("header-view").className = "header-parent";
        document.getElementById("main-view").className = "main-parent-inactive";
    }
    else {
        document.getElementById(id).className = "mobile-menu-button-inactive";
        document.getElementById("header-view").className = "header-parent-inactive";
        document.getElementById("main-view").className = "main-parent";
    }
}

/* MAIN */
$(document).ready(function() {
    /* Intro text animation */
    let introText = "ASI KARIKAS ON VÕISTKONDLIK PROGRAMMEERIMISVÕISTLUS KOOLIÕPILASTELE.";
    let introTextbox = $("#intro");

    fitTextboxToText(introTextbox, introText, true, $("section:not(#introduction), #organizers"));
    revealText(introTextbox, introText, 36);

    /* Smooth navigation scrolling */
    $(".nav-link").click(navScroll);
});
