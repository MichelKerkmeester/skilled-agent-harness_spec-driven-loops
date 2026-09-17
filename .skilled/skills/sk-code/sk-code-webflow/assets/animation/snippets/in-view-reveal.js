/**
 * @title In-View Reveal
 * @description Use inView() to trigger entrance animations when elements enter the viewport.
 * @source https://motion.dev/docs/inview
 * @example Add data-motion-reveal to elements and load this file after Motion.
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, inView } = window.Motion || {};
  if (typeof animate !== "function" || typeof inView !== "function") return;

  inView("[data-motion-reveal]", (element) => {
    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animation = animate(
      element,
      reduce_motion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [16, 0] },
      { duration: reduce_motion ? 0.01 : 0.35, ease: "easeOut" },
    );

    return () => animation.stop?.();
  }, { amount: 0.25 });
})();
