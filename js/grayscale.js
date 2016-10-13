/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */


//  //helper function
// function $$(selector, context) {
//     context = context || document;
//     var elements = context.querySelectorAll(selector);
//     return Array.prototype.slice.call(elements);
// }

// window.addEventListener("scroll", function() {
//     var scrolledHeight= window.pageYOffset;
//     $$(".parallax").forEach(function(el,index,array) {
//         var limit= el.offsetTop+ el.offsetHeight;
//         if(scrolledHeight > el.offsetTop && scrolledHeight <= limit) {
//             el.style.backgroundPositionY= (scrolledHeight - el.offsetTop) /1.5+ "px";
//         } 
//         else {
//             el.style.backgroundPositionY= "0";
//         }
//     });
// });


$(document).ready(function(){
    $(window).scroll(function(){
        $top = $(window).scrollTop();
        $('#myImg').css('-webkit-transform', 'translateY('+ ($top/0.5) +'px)');
        $('#myImg').css('-moz-transform', 'translateY('+ ($top/0.5) +'px)');
        $('#myImg').css('-ms-transform', 'translateY('+ ($top/0.5) +'px)');

        $('#intro').css('-webkit-transform', 'translateY('+ ($top/3) +'px)');
        $('#intro').css('-moz-transform', 'translateY('+ ($top/3) +'px)');
        $('#intro').css('-ms-transform', 'translateY('+ ($top/3) +'px)');

        // $('#skills').css('-webkit-transform', 'translateY('+ ($top/2.5) +'px)');
        // $('#skills').css('-moz-transform', 'translateY('+ ($top/2.5) +'px)');
        // $('#skills').css('-ms-transform', 'translateY('+ ($top/2.5) +'px)');

        // $('#other').css('-webkit-transform', 'translateY('+ ($top/1) +'px)');
        // $('#other').css('-moz-transform', 'translateY('+ ($top/1) +'px)');
        // $('#other').css('-ms-transform', 'translateY('+ ($top/1) +'px)');
    });
});



// // Create cross browser requestAnimationFrame method:
// window.requestAnimationFrame = window.requestAnimationFrame
//  || window.mozRequestAnimationFrame
//  || window.webkitRequestAnimationFrame
//  || window.msRequestAnimationFrame
//  || function(f){setTimeout(f, 1000/60)}

// // var parallax = document.getElementById('parallax')
 
// var container = document.getElementById('container')
// var skills = document.getElementById('skills')
 
// function parallaxsections(){
//  var scrolltop = window.pageYOffset // get number of pixels document has scrolled vertically 
//  parallax.style.top = -scrolltop * .4 + 'px'
//  container.style.top = -scrolltop * .2 + 'px' // move bubble1 at 20% of scroll rate
//  skills.style.top = -scrolltop * .5 + 'px' // move bubble2 at 50% of scroll rate
// }
 
// window.addEventListener('scroll', function(){ // on page scroll
//  requestAnimationFrame(parallaxsections) // call parallaxbubbles() on next available screen paint
// }, false)



// var parallax= document.querySelector(".parallax");
// window.addEventListener("scroll", function() {
//     var scrolledHeight= window.pageYOffset,
//     limit= parallax.offsetTop+ parallax.offsetHeight;
//     if(scrolledHeight > parallax.offsetTop && scrolledHeight <= limit) {
//         parallax.style.backgroundPositionY= (scrolledHeight - parallax.offsetTop) /4+ "px";
//     } 
//     else {
//         parallax.style.backgroundPositionY= "0";
//     }
// });



// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Google Maps Scripts
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(40.6700, -73.9400), // New York

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.png';
    var myLatLng = new google.maps.LatLng(40.6700, -73.9400);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });
}
