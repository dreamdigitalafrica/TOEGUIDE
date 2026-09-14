var THEMEMASCOT = {};
(function($) {

	"use strict";


  /* ---------------------------------------------------------------------- */
  /* --------------------------- Start Demo Switcher  --------------------- */
  /* ---------------------------------------------------------------------- */
  var showSwitcher = true;
  var $body = $('body');
  var $style_switcher = $('#style-switcher');
  if( !$style_switcher.length && showSwitcher ) {
      $.ajax({
          url: "color-switcher/style-switcher.html",
          success: function (data) { $body.append(data); },
          dataType: 'html'
      });
  }
  /* ---------------------------------------------------------------------- */
  /* ----------------------------- En Demo Switcher  ---------------------- */
  /* ---------------------------------------------------------------------- */


  THEMEMASCOT.isRTL = {
    check: function() {
      if( $( "html" ).attr("dir") === "rtl" ) {
        return true;
      } else {
        return false;
      }
    }
  };

  THEMEMASCOT.isLTR = {
    check: function() {
      if( $( "html" ).attr("dir") !== "rtl" ) {
        return true;
      } else {
        return false;
      }
    }
  };

	//Hide Loading Box (Preloader)
	function handlePreloader() {
		if($('.preloader').length){
			$('.preloader').delay(200).fadeOut(500);
		}
	}
	$(document).ready(function () {
    $(".preloader-loaded").addClass("loaded");
    if ($(".preloader-loaded").hasClass("loaded")) {
      $("#preloader").delay(750).queue(function () {
        $(this).remove();
      });
    }
  });

	//Update Header Style and Scroll to Top
	function headerStyle() {
		if($('.main-header').length){
			var windowpos = $(window).scrollTop();
			var siteHeader = $('.header-style-one');
			var scrollLink = $('.scroll-to-top');
			var sticky_header = $('.main-header .sticky-header');
			if (windowpos > 100) {
				sticky_header.addClass("fixed-header animated slideInDown");
				scrollLink.fadeIn(300);
			}else {
				sticky_header.removeClass("fixed-header animated slideInDown");
				scrollLink.fadeOut(300);
			}
			if (windowpos > 1) {
				siteHeader.addClass("fixed-header");
			}else {
				siteHeader.removeClass("fixed-header");
			}
		}
	}
	headerStyle();

	//Submenu Dropdown Toggle
	if($('.main-header li.dropdown ul').length){
		$('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><i class="fa fa-angle-down"></i></div>');
	}

	//Mobile Nav Hide Show
	if($('.mobile-menu').length){

		var mobileMenuContent = $('.main-header .main-menu .navigation').html();

		$('.mobile-menu .navigation').append(mobileMenuContent);
		$('.sticky-header .navigation').append(mobileMenuContent);
		$('.mobile-menu .close-btn').on('click', function() {
			$('body').removeClass('mobile-menu-visible');
		});

		//Dropdown Button
		$('.mobile-menu li.dropdown .dropdown-btn').on('click', function() {
			$(this).prev('ul').slideToggle(500);
			$(this).toggleClass('active');
		});

		//Menu Toggle Btn
		$('.mobile-nav-toggler').on('click', function() {
			$('body').addClass('mobile-menu-visible');
		});

		//Menu Toggle Btn
		$('.mobile-menu .menu-backdrop, .mobile-menu .close-btn').on('click', function() {
			$('body').removeClass('mobile-menu-visible');
		});

	}

	//Header Search
	if($('.search-btn').length) {
		$('.search-btn').on('click', function() {
			$('.main-header').addClass('moblie-search-active');
		});
		$('.close-search, .search-back-drop').on('click', function() {
			$('.main-header').removeClass('moblie-search-active');
		});
	}

	//service-carousel One
	if ($('.banner-slider-one').length) {
		var swiper = new Swiper(".banner-slider-one", {
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 600,
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
	}

	//service-carousel One
	if ($('.work-carousel').length) {
		var swiper = new Swiper(".work-carousel", {
			slidesPerView: 6,
			spaceBetween: 0,
			speed: 5000,
			autoplay: true,
			loop: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				0: {
					spaceBetween: 30,
					slidesPerView: 1,
				},
				476: {
					spaceBetween: 30,
					slidesPerView: 2,
				},
				768: {
					spaceBetween: 30,
					slidesPerView: 3,
				},
				991: {
					spaceBetween: 30,
					slidesPerView: 4,
				},
				1200: {
					spaceBetween: 30,
					slidesPerView: 5,
				},
				1500: {
					spaceBetween: 50,
					slidesPerView: 6,
				},
			},
		});
	}

	//service-carousel One
	if ($('.clients-swiper').length) {
		var swiper = new Swiper(".clients-swiper", {
			slidesPerView: 5,
			spaceBetween: 0,
			speed: 500,
			loop: true,
			autoplay: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				0: {
					slidesPerView: 1,
				},
				476: {
					slidesPerView: 2,
				},
				768: {
					slidesPerView: 3,
				},
				991: {
					slidesPerView: 4,
				},
				1200: {
					slidesPerView: 5,
				}
			},
		});
	}

	//testimonial-carousel One
	if ($('.testimonial-swiper-one').length) {
		var swiper = new Swiper(".testimonial-swiper-one", {
			slidesPerView: 1,
			spaceBetween: 10,
			loop: true,
			speed: 2000,
      		freeMode: true,
			navigation: {
				nextEl: ".testimonial-arry-next",
				prevEl: ".testimonial-arry-prev",
			},
		});
	}

	//testimonial-carousel Two
	if ($('.testimonial-swiper-two').length) {
		var swiper = new Swiper(".testimonial-swiper-two", {
			slidesPerView: 4,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			navigation: {
				nextEl: ".testimonial-arry-next",
				prevEl: ".testimonial-arry-prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				991: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 2,
				},
				1400: {
					slidesPerView: 3,
				},
				1600: {
					slidesPerView: 4,
				},
			},
		});
	}

	//Testimonial Swiper Three
	if ($('.testimonial-swiper-three').length) {
		var slider = new Swiper(".testimonial-swiper-three", {
			slidesPerView: 1,
			navigation: true,
			centeredSlides: true,
			loop: true,
			loopedSlides: 3,
			navigation: {
				nextEl: ".testimonial-arry-next",
				prevEl: ".testimonial-arry-prev",
			},
		});
		var thumbs = new Swiper ('.testimonial-thumbs', {
			slidesPerView: 'auto',
			spaceBetween: 0,
			centeredSlides: true,
			loop: true,
			slideToClickedSlide: true,
		});
		slider.controller.control = thumbs;
		thumbs.controller.control = slider;
	}

	//Projects Swiper One
	if ($('.projects-swiper-one').length) {
		var swiper = new Swiper(".projects-swiper-one", {
			slidesPerView: 3,
			spaceBetween: 40,
			speed: 600,
			loop: true,
			navigation: {
				nextEl: ".swiper-arry-next",
				prevEl: ".swiper-arry-prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 3,
				},
			},
		});
	}

	//Projects Swiper One
	if ($('.services-swiper').length) {
		var swiper = new Swiper(".services-swiper", {
			slidesPerView: 3,
			spaceBetween: 0,
			speed: 600,
			loop: true,
			autoplay: true,
			navigation: {
				nextEl: ".swiper-arry-next",
				prevEl: ".swiper-arry-prev",
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 3,
				},
			},
		});
	}

	//Projects Swiper One
	if ($('.services-swiper-one').length) {
		var swiper = new Swiper(".services-swiper-one", {
			slidesPerView: 3,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			autoplay: true,
			navigation: {
				nextEl: ".swiper-arry-next",
				prevEl: ".swiper-arry-prev",
			},
			pagination: {
				el: ".swiper__dots",
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 3,
				},
			},
		});
	}


	//Services Swiper Two
	if ($('.services-swiper-two').length) {
		var swiper = new Swiper(".services-swiper-two", {
			slidesPerView: 4,
			spaceBetween: 0,
			speed: 600,
			loop: true,
			autoplay: true,
			pagination: {
				el: ".swiper__dots",
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1200: {
					slidesPerView: 4,
				},
			},
		});
	}

	//service-carousel One
	if ($('.service-one-slider').length) {
		var swiper = new Swiper(".service-one-slider", {
			slidesPerView: 4,
			spaceBetween: 24,
			speed: 600,
			loop: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1023: {
					slidesPerView: 4,
				},
			},
		});
	}

	//service-carousel Two
	if ($('.service-two-slider').length) {
		var swiper = new Swiper(".service-two-slider", {
			slidesPerView: 3,
			spaceBetween: 24,
			speed: 600,
			loop: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1023: {
					slidesPerView: 3,
				},
			},
		});
	}

	//service-carousel
	if ($('.service-three-slider').length) {
		var swiper = new Swiper(".service-three-slider", {
			slidesPerView: 3,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 3,
				},
			},
		});
	}

	//service-carousel
	if ($('.service-four-slider').length) {
		var swiper = new Swiper(".service-four-slider", {
			slidesPerView: 3,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			navigation: {
				nextEl: '.swiper-service-four-button-next',
				prevEl: '.swiper-service-four-button-prev',
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1023: {
					slidesPerView: 3,
				},
			},
		});
	}

	// Project Image Slider
	if ($('.project-image-slider').length) {
		var swiper = new Swiper(".project-image-slider", {
			slidesPerView: 2,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 1,
				},
				992: {
					slidesPerView: 2,
				},
				1023: {
					slidesPerView: 2,
				},
			},
		});
	}

	//service-carousel
	if ($('.service-five-slider').length) {
		var swiper = new Swiper(".service-five-slider", {
			slidesPerView: 3.35,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2,
				},
				1200: {
					slidesPerView: 3.35,
				},
			},
		});
	}


	// Testimonial Carousel
	if ($('.testimonial-carousel-one').length) {
		$('.testimonial-carousel-one').owlCarousel({
			rtl: THEMEMASCOT.isRTL.check(),
			loop: true,
			margin: 30,
			nav: true,
			items: 1,
			smartSpeed: 700,
			autoplay: false,
			navText: ['<span class="icon-arrow-left"></span>', '<span class="icon-arrow-right"></span>'],
		});
	}

	// Clients Carousel
	if ($('.clients-carousel').length) {
		var swiper = new Swiper(".clients-carousel", {
			slidesPerView: 5,
			spaceBetween: 30,
			speed: 600,
			loop: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				576: {
					slidesPerView: 2,
				},
				768: {
					slidesPerView: 3,
				},
				992: {
					slidesPerView: 4,
				},
				1200: {
					slidesPerView: 5,
				},
			},
		});
	}

  function show_secondary_price(pricing_tables){
    pricing_tables.addClass('show-secondary-price');
    var pricing_btn = pricing_tables.find('.btn');
    var secondary_btn_url = pricing_btn.data("secondary-link");
    pricing_btn.attr("href", secondary_btn_url);
  }
  function hide_secondary_price(pricing_tables){
    pricing_tables.removeClass('show-secondary-price');
    var pricing_btn = pricing_tables.find('.btn');
    var normal_btn_url = pricing_btn.data("normal-link");
    pricing_btn.attr("href", normal_btn_url);
  }

  //smart btn
  var TM_Pricing_Switcher_Smart = function ($scope) {
    var pricing_smart_switcher = $('.tm-pricing-smart-switcher, .tm-pricing-plan-switcher');
    if( pricing_smart_switcher.length > 0 ) {
      pricing_smart_switcher.find("[data-pricing-trigger]").on("click", function (e) {
        var $self = $(e.target);
        $self.toggleClass("secondary-active");
        var pricing_tables = $self.parents("section").find(".tm-pricing-table");

        if( $self.hasClass( 'secondary-active' ) ) {
          show_secondary_price(pricing_tables);
        } else {
          hide_secondary_price(pricing_tables);
        }
      });
    }
  };

  //round, flat btn
  var TM_Pricing_Switcher_Btn = function ($scope) {
    var pricing_btn_switcher = $('.tm-pricing-smart-switcher-button');
    if( pricing_btn_switcher.length > 0 ) {
      pricing_btn_switcher.find("[data-pricing-trigger]").on("click", function (e) {
        var target_id = $(this).data('show');
        var $self = $(e.target);
        pricing_btn_switcher.find("[data-pricing-trigger]").removeClass("active");
        $(this).addClass("active");
        var pricing_tables = $self.parents("section").find(".tm-pricing-table");

        if( target_id == "year" ) {
          show_secondary_price(pricing_tables);
        } else {
          hide_secondary_price(pricing_tables);
        }
      });
    }
  };
	

	//Service Block Hover
	if ($('.srvice-block-eleeven222').length) {
		var $service_block = $('.service-block-eleven .inner-box');
		$($service_block).on('mouseenter', function (e) {
			$(this).find('.info-box .text').stop().slideDown(400);
			return false;
		});
		$($service_block).on('mouseleave', function (e) {
			$(this).find('.info-box .text').stop().slideUp(400);
			return false;
		});
  	}

	// Team Award Content Active
	if($('.team-award-block-two .inner-box').length) {
		$('.team-award-block-two .inner-box').on('mouseenter', function() {
		$(this).addClass('active');
		$('.inner-box').removeClass('active');
		});
		$('.team-award-block-two .inner-box').on('mouseleave', function() {
		$(this).addClass('active');
		});
	}

	// Team Award Content Active
	if($('.work-block .inner-box').length) {
		$('.work-block .inner-box').on('mouseenter', function() {
		$(this).addClass('active');
		$('.inner-box').removeClass('active');
		});
		$('.work-block .inner-box').on('mouseleave', function() {
		$(this).addClass('active');
		});
	}

  if($('.service-block-three .inner-box').length) {
  const $boxes = $('.service-block-three .inner-box');

  if ($boxes.length) {
    // Activate the first box on load
    // const $firstBox = $boxes.first();
    // $firstBox.addClass('active');
    // $firstBox.find('.content-box').addClass('active').slideDown();

    // Click logic
    $boxes.on('click', function () {
      $boxes.removeClass('active');
      $('.service-block-three .content-box').slideUp().removeClass('active');

      $(this).addClass('active');
      $(this).find('.content-box').slideDown().addClass('active');
    });
  }
}


 // Project Content Active
 if($('.service-block-seven .inner-box').length) {
    $('.service-block-seven .inner-box').on('click', function() {
       $('.inner-box').removeClass('active');
       $(this).addClass('active');
    });
  }

  if ($('.services-section-eight .outer-box').length) {
    const serviceImage = document.getElementById('service-image');
    const serviceItems = document.querySelectorAll('.services-list .service-block-eight');
    // Set the default active item
    const defaultItem = document.querySelector('.services-list .service-block-eight.active');
    if (defaultItem) {
        const defaultImage = defaultItem.getAttribute('data-image');
        if (defaultImage) {
            serviceImage.src = defaultImage;
        }
    }
    // Handle hover effect and active state change
    serviceItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const newImage = item.getAttribute('data-image');
            if (newImage) {
                serviceImage.src = newImage;
            }
            // Remove active class from all items and add to the hovered one
            serviceItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

  // Project Content Active
	if ($('.service-block-eleven').length) {
		var $service_block = $('.service-block-eleven .inner-box');
		$($service_block).on('mouseenter', function (e) {
			$(this).parent().parent().find('.inner-box').removeClass('active');
			$(this).addClass('active');
			$(this).parent().parent().find('.info-box .text').stop().slideUp(200);
			$(this).find('.info-box .text').stop().slideDown(200);
			return false;
		});
		$($service_block).on('mouseleave', function (e) {
			return false;
		});
	}

	if ($('.product-details .bxslider').length) {
		$('.product-details .bxslider').bxSlider({
        nextSelector: '.product-details #slider-next',
        prevSelector: '.product-details #slider-prev',
        nextText: '<i class="fa fa-angle-right"></i>',
        prevText: '<i class="fa fa-angle-left"></i>',
        mode: 'fade',
        auto: 'true',
        speed: '700',
        pagerCustom: '.product-details .slider-pager .thumb-box'
    });
	};

	//Distance Range Slider
	if ($('.distance-range-slider').length) {
		$(".distance-range-slider").slider({
			range: true,
			min: 0,
			max: 2000,
			values: [0, 1500],
			slide: function (event, ui){
				$("input.range-amount").val(ui.values[0] + " - " + ui.values[1]);
			}
		});
		$("input.range-amount").val($(".distance-range-slider").slider("values", 0) + " - " + $(".distance-range-slider").slider("values", 1));
	}

  $(".quantity-box .add").on("click", function () {
    if ($(this).prev().val() < 999) {
      $(this)
        .prev()
        .val(+$(this).prev().val() + 1);
    }
  });
  $(".quantity-box .sub").on("click", function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1)
        $(this)
        .next()
        .val(+$(this).next().val() - 1);
    }
  });

	//Price Range Slider
	if($('.price-range-slider').length){
		$( ".price-range-slider" ).slider({
			range: true,
			min: 10,
			max: 99,
			values: [ 10, 60 ],
			slide: function( event, ui ) {
			$( "input.property-amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			}
		});

		$( "input.property-amount" ).val( $( ".price-range-slider" ).slider( "values", 0 ) + " - $" + $( ".price-range-slider" ).slider( "values", 1 ) );
	}

	//Accordion Box
	if ($('.accordion-box').length) {
		$(".accordion-box").on('click', '.acc-btn', function () {

			var outerBox = $(this).parents('.accordion-box');
			var target = $(this).parents('.accordion');

			if ($(this).hasClass('active') !== true) {
				$(outerBox).find('.accordion .acc-btn').removeClass('active ');
			}

			if ($(this).next('.acc-content').is(':visible')) {
				return false;
			} else {
				$(this).addClass('active');
				$(outerBox).children('.accordion').removeClass('active-block');
				$(outerBox).find('.accordion').children('.acc-content').slideUp(300);
				target.addClass('active-block');
				$(this).next('.acc-content').slideDown(300);
			}
		});
	}

	//Jquery Knob animation  // Pie Chart Animation
	if ($('.dial').length) {
		$('.dial').appear(function () {
			var elm = $(this);
			var color = elm.attr('data-fgColor');
			var perc = elm.attr('value');

			elm.knob({
				'value': 0,
				'min': 0,
				'max': 100,
				'skin': 'tron',
				'readOnly': true,
				'thickness': 0.15,
				'dynamicDraw': true,
				'displayInput': false
			});

			$({ value: 0 }).animate({ value: perc }, {
				duration: 2000,
				easing: 'swing',
				progress: function () {
					elm.val(Math.ceil(this.value)).trigger('change');
				}
			});

			//circular progress bar color
			$(this).append(function () {
				// elm.parent().parent().find('.circular-bar-content').css('color',color);
				//elm.parent().parent().find('.circular-bar-content .txt').text(perc);
			});

		}, { accY: 20 });
	}


	//Fact Counter + Text Count
	if($('.count-box').length){
		$('.count-box').appear(function(){

			var $t = $(this),
				n = $t.find(".count-text").attr("data-stop"),
				r = parseInt($t.find(".count-text").attr("data-speed"), 10);

			if (!$t.hasClass("counted")) {
				$t.addClass("counted");
				$({
					countNum: $t.find(".count-text").text()
				}).animate({
					countNum: n
				}, {
					duration: r,
					easing: "linear",
					step: function() {
						$t.find(".count-text").text(Math.floor(this.countNum));
					},
					complete: function() {
						$t.find(".count-text").text(this.countNum);
					}
				});
			}

		},{accY: 0});
	}

	//Tabs Box
	if ($('.tabs-box').length) {
		$('.tabs-box .tab-buttons .tab-btn').on('click', function (e) {
			e.preventDefault();
			var target = $($(this).attr('data-tab'));

			if ($(target).is(':visible')) {
				return false;
			} else {
				target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
				$(this).addClass('active-btn');
				target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
				target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab animated fadeIn');
				$(target).fadeIn(300);
				$(target).addClass('active-tab animated fadeIn');
			}
		});
	}

	//Progress Bar
	if ($('.progress-line').length) {
		$('.progress-line').appear(function () {
			var el = $(this);
			var percent = el.data('width');
			$(el).css('width', percent + '%');
		}, { accY: 0 });
	}

	//LightBox / Fancybox
	if($('.lightbox-image').length) {
		$('.lightbox-image').fancybox({
			openEffect  : 'fade',
			closeEffect : 'fade',
			helpers : {
				media : {}
			}
		});
	}

	// Scroll to a Specific Div
	if($('.scroll-to-target').length){
		$(".scroll-to-target").on('click', function() {
			var target = $(this).attr('data-target');
		   // animate
		   $('html, body').animate({
			   scrollTop: $(target).offset().top
			});
		});
	}

	// Aos Animation
	AOS.init();

	// Elements Animation
	if($('.wow').length){
		var wow = new WOW(
		  {
			boxClass:     'wow',      // animated element css class (default is wow)
			animateClass: 'animated', // animation css class (default is animated)
			offset:       0,          // distance to the element when triggering the animation (default is 0)
			mobile:       false,       // trigger animations on mobile devices (default is true)
			live:         true       // act on asynchronously loaded content (default is true)
		  }
		);
		wow.init();
	}

	// count Bar
	if ($(".count-bar").length) {
		$(".count-bar").appear(
			function () {
					var el = $(this);
					var percent = el.data("percent");
					$(el).css("width", percent).addClass("counted");
				}, {
					accY: -50
			}
		);
	}


	//Image Reveal Animation
	if($('.reveal').length){
		gsap.registerPlugin(ScrollTrigger);
		let revealContainers = document.querySelectorAll(".reveal");
		revealContainers.forEach((container) => {
			let image = container.querySelector("img");
			let tl = gsap.timeline({
				scrollTrigger: {
				trigger: container,
				toggleActions: "play none none none"
				}
			});
			tl.set(container, { autoAlpha: 1 });
			tl.from(container, 1.5, {
				xPercent: -100,
				ease: Power2.out
			});
			tl.from(image, 1.5, {
				xPercent: 100,
				scale: 1.3,
				delay: -1.5,
				ease: Power2.out
			});
		});
	}

	document.querySelectorAll(".scroll-text").forEach((section) => {
		let tl = gsap.timeline({
			scrollTrigger: {
			trigger: section,
			start: "top 100%",
			end: "bottom top",
			scrub: 1,
			markers: false,
			},
		});
		tl.from(section.querySelector(".text1"), { xPercent: 20 })
		.from(section.querySelector(".text2"), { xPercent: -20 }, 0);
		tl.from(section.querySelector(".scroll-anim-top"), { yPercent: 10 }, 0)
		.from(section.querySelector(".scroll-anim-bottom"), { yPercent: -10 }, 0);
	});

	//Bg Parallax
	if($('.bg-parallax').length){
		gsap.to(".bg-parallax", {
			backgroundPosition: "70% 75%",
			ease: "ease1",
			scrollTrigger: {
			trigger: ".bg-parallax",
			start: "top bottom",
			end: "bottom top",
			scrub: 1
			}
		});
	}

		// Select2 Dropdown
	$('.custom-select').select2({
		minimumResultsForSearch: 7,
	});

	//Gallery Filters
	 if($('.filter-list').length){
	 	 $('.filter-list').mixItUp({});
	 }

	//Custom Data Attributes
	if($('[data-tm-bg-color]').length){
		$('[data-tm-bg-color]').each(function() {
		  $(this).css("cssText", "background-color: " + $(this).data("tm-bg-color") + " !important;");
		});
	}

	if($('.scroll-to-fixed-parent').length){
	  var scroll_childs = $('.scroll-to-fixed-child');
	  for (var i = 0, length = scroll_childs.length; i < length; i++) {
	    var scroll_child = $(scroll_childs[i]);
	    scroll_child.scrollToFixed({
	      marginTop: $('header').outerHeight(true) + 10,
	      zIndex: 2,
	      spacerClass: 'd-none',
	      removeOffsets: true,
	      limit: function() {
	        var parent = this.parents('.scroll-to-fixed-parent');
	        return parent.offset().top + parent.outerHeight(true) - this.outerHeight(true) - 20;
	      }
	    });
	  }
	 }

  /* ---------------------------------------------------------------------- */
  /* ----------- Activate Menu Item on Reaching Different Sections ---------- */
  /* ---------------------------------------------------------------------- */
  var $onepage_nav = $('.onepage-nav');
  var $sections = $('section');
  var $window = $(window);
  function TM_activateMenuItemOnReach() {
	  if( $onepage_nav.length > 0 ) {
	    var cur_pos = $window.scrollTop() + 2;
	    var nav_height = $onepage_nav.outerHeight();
	    $sections.each(function() {
	      var top = $(this).offset().top - nav_height - 80,
	        bottom = top + $(this).outerHeight();

	      if (cur_pos >= top && cur_pos <= bottom) {
	        $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
	        $sections.removeClass('current').removeClass('active');
	        $onepage_nav.find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('current').addClass('active');
	      }

	      if (cur_pos <= nav_height && cur_pos >= 0) {
	        $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
	        $onepage_nav.find('a[href="#header"]').parent().addClass('current').addClass('active');
	      }
	    });
	  }
	}


/* ==========================================================================
   When document is Scrollig, do
   ========================================================================== */

	$(window).on('scroll', function() {
		headerStyle();
		TM_activateMenuItemOnReach();
	});

/* ==========================================================================
   When document is loading, do
   ========================================================================== */

	$(window).on('load', function() {
		handlePreloader();
		TM_Pricing_Switcher_Smart();
  	TM_Pricing_Switcher_Btn();
	});

})(window.jQuery);