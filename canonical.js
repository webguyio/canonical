'use strict';

document.addEventListener('DOMContentLoaded', () => {
	let debounceTimer;
	let observer;
	canon();
	observer = new MutationObserver(() => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			canon();
		}, 300);
	});
	observer.observe(document.head, {childList: true, subtree: true});
	function canon() {
		const canonical = document.querySelector('link[rel="canonical"]');
		if (!canonical || !canonical.href) {
			const cleanUrl = getSuggestedUrl();
			if (cleanUrl && cleanUrl !== location.href) {
				browser.runtime.sendMessage({
					method: 'suggest-url',
					url: cleanUrl
				});
			}
			return;
		}
		if (observer) {
			observer.disconnect();
			observer = null;
		}
		browser.runtime.sendMessage({
			method: `${location.href === canonical.href ? 'is' : 'offer'}-canonical`,
			url: canonical.href
		});
	}
	function getSuggestedUrl() {
		try {
			let cleanUrl = location.href.replace(/[#?&].*$/, '');
			return cleanUrl;
		} catch (e) {
			return null;
		}
	}
});