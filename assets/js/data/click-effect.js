(() => {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const MAX_RIPPLES = 30;
  let activeRipples = 0;

  function shouldIgnoreTarget(target) {
    if (!(target instanceof Element)) return false;
    if (target.closest('[data-click-effect="off"]')) return true;
    return false;
  }

  function spawnRipple(x, y) {
    if (activeRipples >= MAX_RIPPLES) return;
    activeRipples += 1;

    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    const cleanup = () => {
      ripple.removeEventListener('animationend', cleanup);
      ripple.remove();
      activeRipples = Math.max(0, activeRipples - 1);
    };

    ripple.addEventListener('animationend', cleanup);
    setTimeout(cleanup, 1200);
  }

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0) return;
      if (event.isPrimary === false) return;
      if (shouldIgnoreTarget(event.target)) return;
      spawnRipple(event.clientX, event.clientY);
    },
    { passive: true }
  );
})();
