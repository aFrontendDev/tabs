/**
 * @file Tabs
 * @author {@link http://andyblackledge.co.uk Andy Blackledge}
 */
var bb = bb ? bb : {};
(function($) {
	$.extend(bb, {
		/**
		 * Tabs related methods.
		 * @namespace tabs
		 */
		tabs: {
			// jQuery DOM caching
			$tabs: null,
			// CSS selectors
			tabsSelector: '.tabs',
			// Classes
			activeClass: 'active',
			/**
			 * Initialises tab module. Caches jQuery DOM objects.
			 * @function init
			 * @memberof tab
			 */
			init: function() {
				var self = this;

				self.$tabs = $(self.tabsSelector);
				if (self.$tabs.length < 1) {
					console.log('No tabs on page');
					return;
				}
			}
		}
	});
	$.subscribe('pageReady', function() {
		bb.tabs.init();
	});
}(jQuery));
