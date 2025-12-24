

// Cooperative smooth scroll
(function () {
	if (typeof window === 'undefined') return;

	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReduced) return; // don't interfere

	// tuning (slower feel, prevent overscroll at edges)
	const ease = 0.05; // lerp factor (smaller = slower)
	const speed = 0.5; // delta multiplier (slower)
	const maxDelta = 1200;

	let enabled = true;
	let targetY = window.scrollY || 0;
	let currentY = targetY;
	let ticking = false;

	function lerp(a, b, t) {
		return a + (b - a) * t;
	}

	function onWheel(e) {
		// allow native on elements that opt-out
		let node = e.target;
		while (node && node !== document.body) {
			if (node.hasAttribute && node.hasAttribute('data-no-smooth')) return;
			node = node.parentNode;
		}

		if (!enabled) return;
		e.preventDefault();
		const deltaRaw = e.deltaY || -e.wheelDelta || 0;
		const delta = Math.max(-maxDelta, Math.min(maxDelta, deltaRaw));
		const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
		const proposed = targetY + delta * speed;

		if (proposed <= 0) {
			if (targetY === 0) return; // already at top — ignore further downwards scroll
			targetY = 0;
			requestTick();
			return;
		}

		if (proposed >= maxScroll) {
			if (targetY === maxScroll) return; // already at bottom — ignore further upwards scroll
			targetY = maxScroll;
			requestTick();
			return;
		}

		targetY = proposed;
		requestTick();
	}

	function requestTick() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	}

	function update() {
		ticking = false;
		currentY = lerp(currentY, targetY, ease);
		if (Math.abs(currentY - targetY) < 0.5) currentY = targetY;
		window.scrollTo(0, Math.round(currentY));
		if (currentY !== targetY) requestTick();
	}

	function onResize() {
		targetY = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, targetY));
		currentY = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, currentY));
	}

	function onTouchStart() {
		// sync targets on user touch start
		targetY = window.scrollY || 0;
		currentY = targetY;
	}

	function enable() {
		if (enabled) return;
		enabled = true;
		targetY = window.scrollY || 0;
		currentY = targetY;
		window.addEventListener('wheel', onWheel, { passive: false, capture: {}});
	}

	function disable() {
		if (!enabled) return;
		enabled = false;
		window.removeEventListener('wheel', onWheel);
	}

	// expose sync to allow external code to resync after programmatic jumps
	window.smoothScroll = window.smoothScroll || {};
	window.smoothScroll.enable = enable;
	window.smoothScroll.disable = disable;
	window.smoothScroll.sync = function () {
		targetY = window.scrollY || 0;
		currentY = targetY;
	};

	// init
	window.addEventListener('resize', onResize);
	window.addEventListener('touchstart', onTouchStart, { passive: true });
	window.addEventListener('wheel', onWheel, { passive: false });
	// ensure internal state matches initial scroll
	targetY = currentY = window.scrollY || 0;
})();

