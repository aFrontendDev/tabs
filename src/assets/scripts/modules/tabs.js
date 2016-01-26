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
			preSelectedClass: 'pre-selected',
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

				// set data id attr on each panel to get original id
				self.setDataId();

				// Find the first tab for each tab container and record it for future use
				self.getFirstTab();

				// Bind events (click, hashchange etc)
				self.bindEvents();

				// check for hash value in url and if exists pass to tab open func
				self.hashVal = window.location.hash;
				if (self.hashVal && self.hashVal.length > 0) {
					self.tabOpen(self.hashVal);
				} else {
					console.log('No active panel');
					self.tabOpen();
				}
			},
			/**
			 * Bind event listeners
			 * @function bindEvents
			 * @memberof tab
			 */
			bindEvents: function() {
				var self = this;

				// click event handler for tab links ** essentially a hack to stop page jump
				// This is done by removing id from panel which will later be re-added (from the actions of our getFirstTab function)
				$(self.tabSelector).on('click.tabs', function() {
					var $this = $(this);
					var href = $this.attr('href');
					var $target = $(href);
					$target.removeAttr('id');
				});

				//when hash value changes update the tab to show correct panel
				window.addEventListener('hashchange', function() {
					self.hashVal = window.location.hash;

					if (self.hashVal && self.hashVal.length > 0) {
						self.tabUpdate(self.hashVal);
					}
				});
			},
			/**
			 * We will later need the id's of the tabs in data attributes
			 * Could do on click event but I'd like it to work on manual update of the url and don't want to
			 * duplicate code in both click event and hashchange event
			 * @function setDataId
			 * @memberof tab
			 */
			setDataId: function() {
				var self = this;

				$(self.panelSelector).each(function() {
					var $this = $(this);
					var id = '#' + $this.attr('id');
					$this.attr('data-id', id);
				});
			},
			/**
			 * This will find the first tab in each of the tab containers
			 * purpose of this is so that if there isn't a tab id in the url we can open each
			 * of the first panels. Also if there is more than one tab container we will still need this
			 * even if there is an id in the url, as we will only have one id in the url, the others will
			 * still need to show the first tab
			 * @function getFirstTab
			 * @memberof tab
			 */
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
			/**
			 * Open the first or selected tab on initialisation
			 * @function tabOpen
			 * @memberof tab
			 */
			tabOpen: function(hashVal) {
				var self = this;

				// If we have a hashval (which will have been passed from the url) then we want to
				// mark the container so that we don't set that container to open the first panel
				if (hashVal) {
					var $activePanel = $(hashVal);
					var $activeTab = $('a[href="' + hashVal + '"]');
					var $tabParent = $activePanel.closest(self.tabsSelector);
					$tabParent.addClass(self.preSelectedClass);
				}

				// go through each tab container
				self.$tabs.each(function() {
					// initially we want to find the tab and tab panel
					// then remove any active class to essentially 'reset'the tabs
					var $this = $(this);
					var $panels = $this.find(self.panelSelector);
					var $tab = $this.find(self.tabSelector);
					$panels.removeClass(self.activeClass);
					$panels.attr('aria-hidden', 'true');
					$tab.removeClass(self.activeClass);

					// check to see if the tab container has the 'preselected' class that we previously added
					// if we have that class then we want to open the panel matching the href from the url
					// else we just open the first tab (we got this from getFirstTab() func)
					if ($this.hasClass(self.preSelectedClass)) {
						$activePanel.addClass(self.activeClass);
						$activeTab.addClass(self.activeClass);
						$this.removeClass(self.preSelectedClass);
					} else {
						var dataFirstTab = $this.data('first-tab');
						var $firstPanel = $this.find(dataFirstTab);
						var $firstTab = $this.find('a[href="' + dataFirstTab + '"]');

						$firstPanel.addClass(self.activeClass);
						$firstPanel.attr('aria-hidden', 'false');
						$firstTab.addClass(self.activeClass);
					}
				});
			},
			/**
			 * This will do the work of opening tabs when we click on the tab anchors
			 * @function tabUpdate
			 * @memberof tab
			 */
			tabUpdate: function(hashVal) {
				var self = this;

				if (!hashVal) {
					console.log('tab update - no hash val');
					return;
				}

				// re-add the ID from the data id attr
				var $activePanel = $('*[data-id="' + hashVal + '"]');
				$activePanel.attr('id', hashVal);

				// go up from the tab to the container to then find the correct panel
				var $activeTab = $('a[href="' + hashVal + '"]');
				var $tabParent = $activePanel.closest(self.tabsSelector);
				var $panels = $tabParent.find(self.panelSelector);
				var $tab = $tabParent.find(self.tabSelector);

				// remove active class from panel and show the one selected by user
				$panels.removeClass(self.activeClass);
				$panels.attr('aria-hidden', 'true');
				$tab.removeClass(self.activeClass);
				$activePanel.addClass(self.activeClass);
				$activePanel.attr('aria-hidden', 'false');
				$activeTab.addClass(self.activeClass);
			}
		}
	});
	$.subscribe('pageReady', function() {
		bb.tabs.init();
	});
}(jQuery));
