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
			$tabContainer: null,
			$panelContainer: null,
			// CSS selectors
			tabContainerSelector: '.tab-container',
			tabSelector: '.tab',
			panelContainerSelector: '.tab-panel-container',
			panelSelector: '.tab-panel',
			// Classes
			activeClass: 'active',
			// Misc
			/**
			 * Initialises tab module. Caches jQuery DOM objects.
			 * @function init
			 * @memberof tab
			 */
			init: function() {
				var self = this;

				// check for tabs on page, return out if not
				self.$tabContainer = $(self.tabContainerSelector);
				if (self.$tabContainer.length < 1) {
					console.log('No tabs on page');
					return;
				}

				// check for tab panels on page, return out if not
				self.$panelContainer = $(self.panelContainerSelector);
				if (self.$panelContainer.length < 1) {
					console.log('No tab panel container on page');
					return;
				}

				self.getFirstTab();

				// check for hash value in url and if exists pass to tab open func
				var hashVal = window.location.hash;
				if (hashVal && hashVal.length > 0) {
					self.tabOpen(hashVal);
				} else {
					console.log('No active panel');
					self.tabOpen();
				}
			},
			getFirstTab: function() {
				var self = this;

				self.$tabContainer.each(function() {
					var $this = $(this);
					var $tab = $this.find(self.tabSelector);
					var $firstTab = $tab.first();
					var href = $firstTab.attr('href');
					var dataRelatedPanels = $this.data('tabs-target');
					var $relatedPanel = $(dataRelatedPanels);

					$this.data('first-tab', href);
					$relatedPanel.data('first-tab', href);
				});
			},
			tabOpen: function(hashVal) {
				var self = this;

				if (!hashVal) {
					self.$panelContainer.each(function() {
						var $this = $(this);
						var $panels = $this.find(self.panelSelector);
						var dataFirstPanel = $this.data('first-tab');
						var $firstPanel = $this.find(dataFirstPanel);

						$panels.removeClass(self.activeClass);
						$firstPanel.addClass(self.activeClass);
					});

					self.$tabContainer.each(function() {
						var $this = $(this);
						var $tab = $this.find(self.tabSelector);
						var dataFirstTab = $this.data('first-tab');
						var $firstTab = $this.find(dataFirstTab);

						$tab.removeClass(self.activeClass);
						$firstTab.addClass(self.activeClass);
					});
				} else {
					var $activePanel = $(hashVal);
					var $activeTab = $('a[href' + hashVal + ']');

					if ($activePanel && $activePanel.length > 0) {
						var $activePanelContainer = $activePanel.closest(self.panelContainerSelector);
					}

					if ($activeTab && $activeTab.length > 0) {
						var $activeTabContainer = $activeTab.closest(self.tabContainerSelector);
					}

					self.$panelContainer.each(function() {
						var $this = $(this);
						var $panels = $this.find(self.panelSelector);
						var dataFirstPanel = $this.data('first-tab');
						var $firstPanel = $this.find(dataFirstPanel);

						$panels.removeClass(self.activeClass);
						$firstPanel.addClass(self.activeClass);
					});

					self.$tabContainer.each(function() {
						var $this = $(this);
						var $tab = $this.find(self.tabSelector);
						var dataFirstTab = $this.data('first-tab');
						var $firstTab = $this.find(dataFirstTab);

						$tab.removeClass(self.activeClass);
						$firstTab.addClass(self.activeClass);
					});
				}
			}
		}
	});
	$.subscribe('pageReady', function() {
		bb.tabs.init();
	});
}(jQuery));
