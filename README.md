jPlus
======

jPlus is a lightweight, easy to use, slightly responsive image slideshow plugin with built in lightbox for use with jQuery. It comes with buttons to go back and forth between images, a simple "bullet"-navigation for image control and a +... just like the name - used to show a bigger version of your image.

All you need to use it is a little basic HTML and CSS know-how.


What is needed?
------
To use the plugin you will need 3 key components. The first and most important thing you'll need is jQuery, which you can download [here](https://jquery.com/) or by simply adding this line of code:
```html
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
```

The second thing you'll need is the CSS, either by copying it and pasting it into your own stylesheet or simply just linking to the file like so:
```html
<link rel="stylesheet" href="css/jplus.css">
```

The third and most important piece is the plugin script itself, like before, link to it and do so after jQuery since the plugin needs it to function.
```html
<script src="js/jplus.js"></script>
```


How to set it up
------
To actually use the slideshow, you'll need a wrapper of sorts, preferably a DIV. Set the height and width in your stylesheet and the size you choose for it will be the size of the slideshow itself.

The slideshow structure itself then basically consists of images inside said wrapper, like this:
```html
<div id="mySlider">
	<img src="image1.jpg">
	<img src="image2.jpg">
	<img src="image3.jpg">
</div>
```

Since there's only one image source linked, the same image will be used for the slideshow itself as for the lightbox, just scaled down in the slides.

If you want a separate image for the lightbox then you can put that in an "src1"-attribute and the regular "src" will be used for the slides itself, like this:
```html
<img src="image1.jpg" src1="image1-XL.jpg">
```

The last thing you need for the slideshow to actually initiate is to call for it on document load. To do so, you'll have to connect it to your wrapper and put a code like below somewhere in your code, preferably at the end of the page. Above and below I used the ID "mySlider" as an example, you can name it whatever you like.

```html
<script>
	$(document).ready(function(){
		$('#mySlider').jplus();
	});
</script>
```


Changeable options
------
There are a few values you can change while calling the slideshow script (the last thing above).
The values below are the defaults:

```javascript
duration: 3000, //in milliseconds, default is thus 3 seconds
auto: true, //set to false for a static slideshow
opacity: 0.8, //the default means 80% visibility
color: '#ffffff' //change to any 6 digit hexcolour of your choosing
```

And below is how you use them, it's important to note that you need a comma after the value if there's more than one.

```html
<script>
	$(document).ready(function(){
		$('#mySlider').jplus({
		  duration: 3000,
		  auto: true,
		  opacity: 0.8,
		  color: '#ffffff'
		});
	});
</script>
```

You can also have multiple slideshows on one page, to do that you basically just do the same thing as normal, but with different IDs for each.

And then you simply call the slideshow for each ID like below and you can change the options for each one. For example if you have only very light coloured images and want dark buttons for that slideshow, but another one could just be the default white.

```html
<script>
	$(document).ready(function(){
		$('#mySlider').jplus({
		  auto: false
		});

		$('#mySlider2').jplus({
		  auto: false,
		  color: '#000000'
		});
	});
</script>
```