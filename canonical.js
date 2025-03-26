'use strict';

document.addEventListener('DOMContentLoaded', () => {
	canon();
	setTimeout(canon, 5000);
	function canon() {
		const canonical = document.querySelector('link[rel="canonical"]');
		if (!canonical || !canonical.href) {
			return
		}
		chrome.runtime.sendMessage({
			method: `${location.href === canonical.href ? 'is' : 'offer'}-canonical`,
			url: canonical.href
		});
	}
});
