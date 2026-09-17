/**
 * @title Stagger Animation
 * @description Animate a list of items with Motion's documented stagger() delay helper.
 * @source https://motion.dev/docs/animate
 * @example Add data-motion-stagger-item elements, load Motion, then call window.MotionStagger.play().
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, stagger } = window.Motion || {};
  if (typeof animate !== "function" || typeof stagger !== "function") return;

  function play_stagger() {
    const items = document.querySelectorAll("[data-motion-stagger-item]");
    if (!items.length) return null;

    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return animate(
      items,
      reduce_motion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [12, 0] },
      {
        delay: reduce_motion ? 0 : stagger(0.08),
        duration: reduce_motion ? 0.01 : 0.3,
        ease: "easeOut",
      },
    );
  }

  window.MotionStagger = { play: play_stagger };
})();
