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
			$tabContainer: null,
			$panelContainer: null,
			// CSS selectors
			tabsSelector: '.tabs',
			tabContainerSelector: '.tab-container',
			tabSelector: '.tab',
			panelContainerSelector: '.tab-panel-container',
			panelSelector: '.tab-panel',
			// Classes
			activeClass: 'active',
			// Misc
			hashVal: '',
			/**
			 * Initialises tab module. Caches jQuery DOM objects.
			 * @function init
			 * @memberof tab
			 */
			init: function() {
				var self = this;

				// check for tabs on page, return out if not
				self.$tabs = $(self.tabsSelector);
				if (self.$tabs.length < 1) {
					console.log('No tabs on page');
					return;
				}

				self.getFirstTab();

				// check for hash value in url and if exists pass to tab open func
				self.hashVal = window.location.hash;
				if (self.hashVal && self.hashVal.length > 0) {
					self.tabOpen(self.hashVal);
				} else {
					console.log('No active panel');
					self.tabOpen();
				}

				window.addEventListener('hashchange', function() {
					console.log('hash changed');
					self.hashVal = window.location.hash;
					if (self.hashVal && self.hashVal.length > 0) {
						self.tabUpdate(self.hashVal);
					}
				});
			},
			getFirstTab: function() {
				var self = this;

				self.$tabs.each(function() {
					var $this = $(this);
					var $tab = $this.find(self.tabSelector);
					var $firstTab = $tab.first();
					var href = $firstTab.attr('href');

					$this.data('first-tab', href);
				});
			},
			tabOpen: function(hashVal) {
				var self = this;

				if (hashVal) {
					var $activePanel = $(hashVal);
					var $activeTab = $('a[href="' + hashVal + '"]');
					var $tabParent = $activePanel.closest(self.tabsSelector);
					$tabParent.addClass('opened');
				}

				self.$tabs.each(function() {
					var $this = $(this);
					var $panels = $this.find(self.panelSelector);
					var $tab = $this.find(self.tabSelector);
					$panels.removeClass(self.activeClass);
					$tab.removeClass(self.activeClass);

					if ($this.hasClass('opened')) {
						$activePanel.addClass(self.activeClass);
						$activeTab.addClass(self.activeClass);
						$this.removeClass('opened');
					} else {
						var dataFirstTab = $this.data('first-tab');
						var $firstPanel = $this.find(dataFirstTab);
						var $firstTab = $this.find('a[href="' + dataFirstTab + '"]');

						$firstPanel.addClass(self.activeClass);
						$firstTab.addClass(self.activeClass);
					}
				});
			},
			tabUpdate: function(hashVal) {
				var self = this;

				if (!hashVal) {
					console.log('tab update - no hash val');
					return;
				}

				var $activePanel = $(hashVal);
				var $activeTab = $('a[href="' + hashVal + '"]');
				var $tabParent = $activePanel.closest(self.tabsSelector);
				var $panels = $tabParent.find(self.panelSelector);
				var $tab = $tabParent.find(self.tabSelector);

				$panels.removeClass(self.activeClass);
				$tab.removeClass(self.activeClass);
				$activePanel.addClass(self.activeClass);
				$activeTab.addClass(self.activeClass);
			}
		}
	});
	$.subscribe('pageReady', function() {
		bb.tabs.init();
	});
}(jQuery));
