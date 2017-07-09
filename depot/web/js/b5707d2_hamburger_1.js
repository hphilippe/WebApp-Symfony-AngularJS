$(document).ready(function () {
    var trigger = $('.hamburger, .overlay'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"], .overlay').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
});

// Kick off the jQuery with the document ready function on page load
$(document).ready(function(){
    imagePreview();
});

// Configuration of the x and y offsets
this.imagePreview = function(){
    xOffset = 20;
    yOffset = 20;

    $("a.preview").hover(function(e){
            this.t = this.title;
            this.title = "";
            var c = (this.t != "") ? "<br/>" + this.t : "";
            $("body").append("<p id='preview'><img src='"+ this.href +"' alt='Image preview' />"+ c +"</p>");
            $("#preview")
                .css("top",(e.pageY - xOffset) + "px")
                //.css("top", "0px")
                .css("left",(e.pageX + yOffset) + "px")
                //.css("right", "0px")
                .fadeIn("slow");
        },

        function(){
            this.title = this.t;
            $("#preview").remove();

        });

    $("a.preview").mousemove(function(e){
        $("#preview")
            .css("top",(e.pageY - xOffset) + "px")
            //.css("top", "0px")
            .css("left",(e.pageX + yOffset) + "px");
            //.css("right", "0px")
    });
};
