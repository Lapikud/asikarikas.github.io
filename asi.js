/* MAIN */
$(document).ready(function() {
    /* Intro text animation */
    var intro_text = "ASI Karikas 2021 on võistkondlik programmeerimise võistlus kooliõpilastele.";
    var intro_textbox = $("#intro");

    fitTextboxToText(intro_textbox, intro_text, true, $("section:not(#introduction), #organizers"));
    revealText(intro_textbox, intro_text, 54);

    /* Smooth navigation scrolling */
    $(".nav-link").click(navScroll);

    /* Archive content selector */
    // var archive_elements = {
    //     selector: $("#archive_selector"),
    //     content: $(".archive_content"),
    //     year20: $("#archive_2020"),
    //     year21: $("#archive_2021")
    // }

    // archive_elements.selector.change(function(){
    //     showArchiveContent(archive_elements);
    // });
});

/* FUNCTIONS */
/* Intro text */
var revealText = function(textbox, text, speed, letter_position = 0){
    setTimeout(function(){
        if(letter_position < text.length){
            textbox.append(text.charAt(letter_position));

            /* Recursion until the whole text has been revelead */
            letter_position++;
            revealText(textbox, text, speed, letter_position);
        }
    }, speed);
}

var fitTextboxToText = function(textbox, text, hidden_content = false, content){
    textbox.text(text); // Add placeholder text to measure how tall the textbox has to be
    textbox.height(textbox.height()); // Save textbox current height
    textbox.text(""); // Remove placeholder text

    if(hidden_content){ // Content is previously hidden using CSS to avoid screen flickering
        content.css("visibility", "visible");
    }
}

/* Navbar */
var navScroll = function(){
    var destination_element = $($(this).data("destination")); // Navbar link points to a ceratin page element, which ID is stored in a data label

    window.scrollTo({
        top: destination_element.offset().top - 20,
        behavior: "smooth"
      });
}

/* Archive */
// var showArchiveContent = function(archive_elements){
//     archive_elements.content.hide(); // Hide previosuly shown archive

//     switch(archive_elements.selector.val()){ // Show the selected archive
//         case "2020":
//             archive_elements.year20.show();
//             break;
//         case "2021":
//             archive_elements.year21.show();
//             break;
//     }
// }