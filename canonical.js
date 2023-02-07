'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const canonical = document.querySelector('link[rel="canonical"]');
	if (!canonical || !canonical.href) {
		return
	}
	chrome.runtime.sendMessage({
		method: `${location.href === canonical.href ? 'is' : 'offer'}-canonical`,
		url: canonical.href
	});
});
