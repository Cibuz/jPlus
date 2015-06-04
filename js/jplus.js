//	jPlus - jQuery slideshow + lightbox
//	Author: Pontus Pettersson
//	Version 1.0

(function($) {
     
      $.fn.jplus = function(options) {
        var defaults = {
            'duration' : 3000,
            'speed' : 1000,
            'auto' : true,
            'overlay' : 0.8,
            'color' : '#ffffff'
        },

        options = $.extend(defaults, options);
        
        return this.each(function(){

          var $this = $(this),
              $images = $this.children('img'),
              loop = null;

          $this.addClass('jplus');

            // Create list to display bullets based on the amoung of images.
          var output = '<ul class="topper">';
            // Create bullets and give them and the images classes, first in the list get current/selected classes.
            for (var i = 0; i < $images.length; i++) {
              if (i === 0) {
                $images.eq(i).addClass('current');
                output += '<li class="selected 0">';
              } else {
              	// bullets receive a numeral class
                output += '<li class="'+[i]+'">';
              }
              output += '</li>';
            }
            output += '</ul>';
            // Create next and previous buttons and a + for the lightbox.
            output += '<span id="prev"></span>';
            output += '<span id="next"></span>';
            output += '<span class="resize">+</span>';

            // Add the elements to the top of the slider DIV.
            $this.prepend(output);

            // Set up the listeners for button and bullet-clicks.
            $this.children('#prev').click(newImg);
            $this.children('#next').click(newImg);
            $this.children().children('.topper li').click(selectImg);

          // Starting an interval for the slider.
          function startSlider(){
           loop = setInterval(function(){moveImg()}, options.duration);
          }
          // Clearing the interval to stop it from just multiplying when manually changing images.
          function stopSlider(){
            window.clearInterval(loop);
          }

          // Function for changing images when clicking on a bullet.
          // It moves around a "selected"-class based on what bullet is clicked.
          function selectImg() {
          	if (options.auto == true) stopSlider();

          	var bullet, currentImg, nextImg;

            // Remove the "selected"-class and then grab the remaining numeral class.
            $this.children().children('.topper li.selected').removeClass('selected');
            bullet = this.className;

            // Set the current image and bullet.
            currentImg = $this.children('img.current');
            nextImg = $images.eq(bullet);
            $(this).addClass('selected');

            // Change the current image to the selected one and animate it in.
            // Also add and then remove a "previous"-class to make sure last image is shown behind the new image in transition.
            currentImg.removeClass('current').addClass('previous');
            nextImg.css({opacity: 0.0}).addClass('current').animate({opacity: 1.0}, 1000,
              function(){ currentImg.removeClass('previous'); });

            if (options.auto == true) startSlider();
          }

          function newImg() {
            if (options.auto == true) stopSlider();
          
            // Get the ID of the button pressed and the current image/bullet. 
            var changeImg = this.id,
            	currentBull = $this.children().children('.topper li.selected').removeClass('selected'),
            	currentImg = $this.children('img.current');

            // Depending on button pressed show next/previous image and bullet.
            if (changeImg == 'next') {
              
              // Set the next image and bullet to the next in the list.
              	var nextImg = currentImg.next('img'),
              		nextBull = currentBull.next('li');

              // If there are no more images go to the first.
              if (nextImg.length == 0) {
                nextImg = $this.children('img:first');
                nextBull = $this.children().children('.topper li:first');
              }
            // Same deal as above, but the other way around.
            } else if (changeImg == 'prev') {
              	var nextImg = currentImg.prev('img'),
              		nextBull = currentBull.prev('li');
              
              if (nextImg.length == 0) {
                nextImg = $this.children('img:last');
                nextBull = $this.children().children('.topper li:last');
              }
            };
            
            nextBull.addClass('selected');

            currentImg.removeClass('current').addClass('previous');
            nextImg.css({opacity: 0.0}).addClass('current').animate({opacity: 1.0}, options.speed,
              function(){ currentImg.removeClass('previous'); });
            
            if (options.auto == true) startSlider();
          }

          // The main image cycle function.
          function moveImg(){
            // Get the current image and bullet and set the next in the list.
            var currentBull = $this.children().children('.topper li.selected').removeClass('selected'),
            	currentImg = $this.children('img.current'),
            	nextImg = currentImg.next(),
            	nextBull = currentBull.next();

            // If there are no more images go to the first.
            if (nextImg.length == 0) {
              nextImg = $this.children('img:first');
              nextBull = $this.children().children('.topper li:first');
            }

            nextBull.addClass('selected');
            currentImg.removeClass('current').addClass('previous');
            nextImg.css({opacity: 0.0}).addClass('current').animate({opacity: 1.0}, options.speed,
              function(){ currentImg.removeClass('previous'); });
          }

          // The lightbox function for when you click the plus.
          $this.children('.resize').click(function(){
            if (options.auto == true) stopSlider();

            var imgSrc;
            // To allow a different slider image and lightbox image.
            // If a value in the image's "src1"-attribute exists, use it for the lightbox.
            if($this.children('img.current').attr('src1') != null) {
              imgSrc = $this.children('img.current').attr('src1');
            } else {
              imgSrc = $this.children('img.current').attr('src');
            };

            // Create the lightbox and a dark dimming overlay behind it.
            $('<div id="overlay"></div>')
              .css('opacity', '0')
              .animate({'opacity': options.overlay}, 'slow')
              .appendTo('body');
            
            $('<div id="lightbox"></div>')
              .hide()
              .appendTo('body');

            $('<img>')
              .attr('src', imgSrc)
              .load(function() {
                $('#lightbox')
                  .css({
                    'top':  ($(window).height() - $('#lightbox').height()) / 2,
                    'left': ($(window).width()  - $('#lightbox').width())  / 2
                  })
                  .fadeIn();
              })
              .appendTo('#lightbox');

            // Remove the lightbox by clicking on it, around it or from pressing ESC.
            $('#overlay, #lightbox').click(function() {
              $('#overlay, #lightbox').fadeOut('slow', function(){
                $(this).remove();
              });
              if (options.auto == true) startSlider();
            });

            $(document).keyup(function(e) { 
              if (e.keyCode == 27) { // Escape keycode
                $('#overlay, #lightbox').fadeOut('slow', function(){
                  $(this).remove();
                });
                if (options.auto == true) startSlider();
              }
            });
          });

		// Changes the colour of buttons if user choses to change it.
		if(options.color != '#ffffff'){
			var thisSlider = '#'+$this.attr('id')+' ';
			// Function to convert hex values to rgb, found in random jsFiddle.
			function hex2rgb(hex) {
			    if (hex.lastIndexOf('#') > -1) {
			        hex = hex.replace(/#/, '0x');
			    } else {
			        hex = '0x' + hex;
			    }
			    var r = hex >> 16;
			    var g = (hex & 0x00FF00) >> 8;
			    var b = hex & 0x0000FF;
			    return [r, g, b];
			};
			// Set the new colours and gradients used.
			var colors = hex2rgb(options.color),
				theColor = colors[0]+","+ colors[1]+","+ colors[2];	
			var gradLeft = "linear-gradient(to right, rgba("+theColor+",0.5) 0%,rgba("+theColor+",0) 100%)!important;",
				mozLeft = "-moz-"+gradLeft,
				webLeft = "-webkit-"+gradLeft,
				oLeft = "-o-"+gradLeft,
				msLeft = "-ms-"+gradLeft,
				webkLeft = "-webkit-gradient(linear, left top, right top, color-stop(0%,rgba("+theColor+",0.5)), color-stop(100%,rgba("+theColor+",0)))!important;";
			var gradRight = "linear-gradient(to right, rgba("+theColor+",0) 0%,rgba("+theColor+",0.5) 100%)!important;",
				mozRight = "-moz-"+gradRight,
				webRight = "-webkit-"+gradRight,
				oRight = "-o-"+gradRight,
				msRight = "-ms-"+gradRight,
				webkRight = "-webkit-gradient(linear, left top, right top, color-stop(0%,rgba("+theColor+",0)), color-stop(100%,rgba("+theColor+",0.5)))!important;"
				// Append the new colour within <style>-tags in the head.
				$('head').append('<style>'+thisSlider+'.topper li{background-color:rgba('+theColor+',0.3)!important;}'+thisSlider+'.topper li:hover{background-color:rgba('+theColor+',0.7)!important;}'+thisSlider+'.topper li.selected{background-color:rgba('+theColor+',0.8)!important;}'+thisSlider+'.resize{color:rgba('+theColor+',0.5)!important;}'+thisSlider+'.resize:hover{color:rgba('+theColor+',0.8)!important;}'+thisSlider+'#prev{background:'+gradLeft+'background:'+mozLeft+'background:'+webLeft+'background:'+webkLeft+'background:'+oLeft+'background:'+msLeft+'}'+thisSlider+'#next{background:'+gradRight+'background:'+mozRight+'background:'+webRight+'background:'+webkRight+'background:'+oRight+'background:'+msRight+'}'+thisSlider+'#prev:hover,'+thisSlider+'#next:hover{background-color:rgba('+theColor+',0.7)!important;}</style>');
				console.log(thisSlider);
		};

          if (options.auto == true) startSlider();
      })
    };
     
}) (jQuery);
