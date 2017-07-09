(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });
    
    var currentClass;

    window.setInterval(function(){

        $(".cube-image").each(function(index) {
            //console.log( index + ": " + $( this ).text() );
            if($(this).hasClass('active')){
                //console.log($(this));
                var $anchor = $(this);
                 if($anchor.attr('href') != currentClass){
                     currentClass = $anchor.attr('href')
                    //console.log($anchor.attr('href'));
                    $('html, body').stop().animate({
                        scrollTop: ($($anchor.attr('href')).offset().top - 50)
                    }, 1250, 'easeInOutExpo');
                 }
                //event.preventDefault();
            }
            
        });

    }, 1000);

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize and Configure Scroll Reveal Animation
    window.sr = ScrollReveal();
    sr.reveal('.sr-icons', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 200);
    sr.reveal('.sr-button', {
        duration: 1000,
        delay: 200
    });
    sr.reveal('.sr-contact', {
        duration: 600,
        scale: 0.3,
        distance: '0px'
    }, 300);

    // Initialize and Configure Magnific Popup Lightbox Plugin
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        }
    });

})(jQuery); // End of use strict

(function( $ ) {
    "use strict";

    $(function() {

        $( window ).konami({

            cheat: function() {
                //alert( 'Cheat code activated!' );
                $('#homeHeading').text('DarkCube');
                $('#home-href').text('Télécharger la démo du jeu');
                $('#home-description').text("Il y a fort longtemps dans l'univers, après le déclin de humanité. . .");

                $('#about-title').text('DarkCube Histoire');
                $('#about-description').text("L'avenir de la race humaine, dépend du dernier fragment de la plus haute technologie laissé par la civilisation, appelez DarkCube")

                $('#menu-game').text('TECHNOLOGIES');
                $('#home-href').attr('href','upload/DarkCube.7z');

                $('#service-title1').text('Customisations');
                $('#service-desc1').text('Tous les sorts sont customisable');
                $('#service-title2').text('Compétences');
                $('#service-desc2').text('De nombreux points de compétences attribuables aux sorts comme au personnage');
                $('#service-title3').text('Alliés');
                $('#service-desc3').text('Allies personnalisables et Upgrapables');
                $('#service-title4').text('Procedural');
                $('#service-desc4').text('Carte généré procéduralement');

                $('#portfolio-img1').attr("src","images/index/portfolio/fullsize/menu.png");
                $('#portfolio-link1').attr("href","images/index/portfolio/fullsize/menu.png");
                $('#portfolio-title1').text("Menu");
                $('#portfolio-des1').text("Game menu");

                $('#portfolio-img2').attr("src","images/index/portfolio/fullsize/jeu.png");
                $('#portfolio-link2').attr("href","images/index/portfolio/fullsize/jeu.png");
                $('#portfolio-title2').text("Jeu");
                $('#portfolio-des2').text("Panorama de la salle de personnalisation");


                $('#portfolio-img3').attr("src","images/index/portfolio/fullsize/skin.png");
                $('#portfolio-link3').attr("href","images/index/portfolio/fullsize/skin.png");
                $('#portfolio-title3').text("Skin");
                $('#portfolio-des3').text("Skin du cube modifiable");


                $('#portfolio-img4').attr("src","images/index/portfolio/fullsize/custom.png");
                $('#portfolio-link4').attr("href","images/index/portfolio/fullsize/custom.png");
                $('#portfolio-title4').text("Personnalisation");
                $('#portfolio-des4').text("Personnalisation des sorts et attribution des points");


                $('#portfolio-img5').attr("src","images/index/portfolio/fullsize/planete.png");
                $('#portfolio-link5').attr("href","images/index/portfolio/fullsize/planete.png");
                $('#portfolio-title5').text("Mission");
                $('#portfolio-des5').text("Choisir une des missions sur la carte de l'univers");


                $('#portfolio-img6').attr("src","images/index/portfolio/fullsize/tir.png");
                $('#portfolio-link6').attr("href","images/index/portfolio/fullsize/tir.png");
                $('#portfolio-title6').text("Jeu");
                $('#portfolio-des6').text("Gameplay");

                var randomNumber = Math.random();
                if(randomNumber >0.5){
                    $('#header').attr("class","headerback");
                } else {
                    $('#header').attr("class","headerback2");
                }
                

            } // end cheat

        });

    });
}(jQuery));