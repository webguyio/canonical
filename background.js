'use strict';

browser.runtime.onMessage.addListener(({method, url}, {tab}) => {
	if (method === 'is-canonical') {
		browser.pageAction.setIcon({
			tabId: tab.id,
			path: {
				16: 'icons/gray/16.png',
				32: 'icons/gray/32.png'
			}
		});
	}
	else if (method === 'offer-canonical') {
		browser.pageAction.setIcon({
			tabId: tab.id,
			path: {
				16: 'icons/blue/16.png',
				32: 'icons/blue/32.png'
			}
		});
	}
	else if (method === 'suggest-url') {
		browser.pageAction.setIcon({
			tabId: tab.id,
			path: {
				16: 'icons/purple/16.png',
				32: 'icons/purple/32.png'
			}
		});
	}
	browser.pageAction.setTitle({
		tabId: tab.id,
		title: url
	});
	browser.pageAction.show(tab.id);
});

browser.pageAction.onClicked.addListener(tab => {
	browser.tabs.executeScript(tab.id, {
		code: `{
			const canonical = document.querySelector('link[rel="canonical"]');
			if (canonical && canonical.href) {
				location.replace(canonical.href);
			} else {
				const cleanUrl = location.href.replace(/[#?&].*$/, '');
				location.replace(cleanUrl);
			}
		}`
	});
});

browser.contextMenus.create({
	id: 'copy-canonical',
	title: 'Copy canonical link',
	contexts: ["page_action"]
});

browser.contextMenus.create({
	id: 'open-canonical',
	title: 'Open canonical link',
	contexts: ["page_action"]
});

browser.contextMenus.onClicked.addListener(({menuItemId}, tab) => {
	if (menuItemId === 'copy-canonical') {
		browser.tabs.executeScript(tab.id, {
			code: `{
				const canonical = document.querySelector('link[rel="canonical"]');
				if (canonical && canonical.href) {
					navigator.clipboard.writeText(canonical.href);
				} else {
					const cleanUrl = location.href.replace(/[#?&].*$/, '');
					navigator.clipboard.writeText(cleanUrl);
				}
			}`
		});
	}
	else if (menuItemId === 'open-canonical') {
		browser.tabs.executeScript(tab.id, {
			code: `{
				const canonical = document.querySelector('link[rel="canonical"]');
				if (canonical && canonical.href) {
					canonical.href;
				} else {
					location.href.replace(/[#?&].*$/, '');
				}
			}`
		}).then((results) => {
			if (results && results[0]) {
				browser.tabs.create({
					url: results[0],
					active: true
				});
			}
		});
	}
});