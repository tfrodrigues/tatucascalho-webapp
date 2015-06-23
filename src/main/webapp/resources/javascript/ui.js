	var UI = {};

	UI.init = function() {
		if (!Utils.isMobile()) {
			UI.addBackToTop();
			UI.addWindowResize();
		}
		UI_DEPRECATED.refreshMenu();
	};

	UI.bind = function(model) {
		$(function() {
			var $innerContent = $('#innerContent');
			UI.block($innerContent);
			UI.showContent();
			ko.applyBindings(model, $innerContent[0]);
			UI.unblock($innerContent);
			UI.setFocusOnFirstValidElement();
		});
	};

	UI.setFocusOnFirstValidElement = function() {
		UI_UTILS.setFocusOnFirstValidElement();
	};

	UI.block = function($element) {
		$element.block({
			message: null,
			fadeIn: 0,
			overlayCSS: {
				backgroundColor: '#fff',
				opacity: 1,
				cursor: 'default'
			}
		});
	};

	UI.unblock = function($element) {
		$element.unblock();
	};

	UI.scrollTo = function(selector, speed, margin) {
		speed = speed || 1000;
		margin = margin || 0;
		$('html, body').animate({
			scrollTop: $(selector).offset().top + margin
		}, speed);
	};

	UI.addBackToTop = function() {
		var $backToTop = $('#back-to-top');
		$backToTop.hide();
		var timer = undefined;
		$(window).scroll(function() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				if ($(window).scrollTop() > 100) {
					$backToTop.fadeIn();
				} else {
					$backToTop.fadeOut();
				}
			}, 200);
		});
		$backToTop.click(function() {
			var headerHeight = $('.navbar').outerHeight(true);
			UI.scrollTo('html', undefined, headerHeight);
			return false;
		});
		$backToTop.removeClass('hidden-desktop');
	};

	UI.addWindowResize = function() {
		var timer = undefined;
		$(window).resize(function() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				refreshContentHeight();
			}, 50);
		});
		refreshContentHeight();
	};

	UI.showContent = function() {
		$('#content').removeClass('hide');
		$('footer').removeClass('hide');
	};

	function refreshContentHeight() {
		var $content = $('#content');
		$content.css({
			'min-height': getContentHeight()
		});
	}

	function getContentHeight() {
		var headerHeight = $('.navbar').outerHeight(true);
		var footerHeight = $('footer').outerHeight(true);;
		var bodyHeight = $('body').height() - (headerHeight + footerHeight);
		var sidebarHeight = $('#sidebar-left').height() - 1;
		if (sidebarHeight > bodyHeight) {
			return sidebarHeight;
		} else {
			return bodyHeight;
		}
	}

	if (typeof $.fn.datepicker.dates !== 'undefined') {
		$.fn.datepicker.dates['en'] = Messages['dates'];
	}