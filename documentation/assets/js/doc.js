// We're attempting to read and update hashes from the top frame.
// This is here to avoid cross-origin JS errors when the documentation
// embedded on a 3rd party site.

var targetWindow = window;
try {
	targetWindow = top.window;
} catch(err) {
	// Do nothing
}


$(document).ready(function() {

	var $mobileMenu = $('#mobile-menu select');

	// Check user OS
	if(navigator.appVersion.indexOf('Mac') != -1) {
		$('body').addClass('mac');
	}

	// Init syntax highlighter
	SyntaxHighlighter.defaults.toolbar = false;
	SyntaxHighlighter.all();

	// Init sidebar
	$('#sidebar li').click(function(e) {

		var $li = $(this);

		// Do nothing if it's the active menu
		if( $li.hasClass('active') ) { return false; }

		// Highlight the menu item
		$li.addClass('active').siblings().removeClass('active');

		// Show new section
		$('#content > div > section').removeClass('active').eq( $li.index() ).addClass('active');

		// Scroll to top
		$('#content').scrollTop(0);

		// Filter out triggered events
		if( ! e.isTrigger ) {

			// Update hash
			if( $li.data('hash') ) {
				targetWindow.location.hash = $li.data('hash');
			}
		}
	});



	$('.img-holder img').each(function() {

		var $img 	= $(this),
			width 	= parseInt( $img.attr('width') ),
			height 	= parseInt( $img.attr('height') ),
			ratio 	= 1;

		if( width && height ) {
			$img.parent().css('padding-bottom', (height / width * 100)+'%' );

		// Fallback if no sizes specified
		} else {
			$img.parent().removeClass('img-holder');
		}
	});


	// Fix clicking on the active menu item
	$('section a[href^="#"]').click(function( e ) {

		e.preventDefault();
		targetWindow.location.hash = $(this).attr('href');
	});


	var hashNavFunc = function( winObj ) {

		var hash 		= winObj.location.hash.substr(1),
			$target 	= $('[data-target="'+hash+'"]'),
			$section 	= $target.closest('section');

		if( $target.length && $section.length ) {

			$('#sidebar li').eq( $section.index() ).trigger('click');

			var scrollTop = $('#content').scrollTop() + $target.offset().top;
				scrollTop = scrollTop < 50 ? 0 : scrollTop;

			if( $('#mobile-menu:visible').length ) {
				scrollTop -= 60;
			}

			$('#content').stop(true, true).animate({ scrollTop: scrollTop }, 500);
		}
	};


	// JumpTo functionality
	$(targetWindow).on('hashchange', function( e ) {

		e.preventDefault();
		hashNavFunc( targetWindow );

	}).trigger('hashchange');

	if( targetWindow !== window ) {
		if( window.location.hash.length > 1 ) {
			hashNavFunc( window );
		}
	}


	// Mobile menu: header
	$('aside header small').clone().appendTo('#mobile-menu header');


	// Mobile menu: fill dropdown select field
	var mobileMenuOptions = '';
	$('#sidebar > li').each(function( mainIndex ) {

		var mainTitle 	= $(this).children('span').text(),
			subTitle 	= $(this).children('small').text();

		mobileMenuOptions += '<option disabled>'+mainTitle+' – '+subTitle+'</option>';


		$('#content section').eq( mainIndex ).each(function() {

			$('nav li a', this).each(function() {

				var itemName 	= $(this).text();
					itemKey 	= $(this).attr('href');

				mobileMenuOptions += '<option data-hash="'+itemKey+'">'+itemName+'</option>';
			});

		});

	});

	$mobileMenu.append(mobileMenuOptions);


	// Mobile menu: tablet navigation
	$('#mobile-menu .dashicons-menu').click(function() {

		var $menu = $('aside');

		if( ! $menu.hasClass('opened') ) {
			$menu.addClass('opened');
		}
	});

	// Mobile menu: dismiss the menu when clicking away
	$('#content, aside').click( function() {
		$('aside').removeClass('opened');
	});


	// Mobile menu: mobile navigation
	$('#mobile-menu select').change(function() {

		var $selectedOption = $(this).children(':selected'),
			selectedHash 	= $selectedOption.data('hash');

		if( selectedHash ) {
			targetWindow.location.hash = selectedHash;
		}
	});
});