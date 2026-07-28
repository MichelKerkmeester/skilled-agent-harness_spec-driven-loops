// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Animate On Scroll                                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * @title Animate on Scroll
 * @description Use Motion scroll() with animate() to bind transform progress to document scroll. Assumes Motion is loaded as window.Motion or imports are adapted for your bundler.
 * @source https://motion.dev/docs/scroll
 * @example Add data-motion-scroll-progress to an element and load this file after Motion.
 */
(() => {

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, scroll } = window.Motion || {};
  if (typeof animate !== "function" || typeof scroll !== "function") return;

  const progress_bar = document.querySelector("[data-motion-scroll-progress]");
  if (!progress_bar) return;

  const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animation = animate(
    progress_bar,
    reduce_motion ? { opacity: [0.4, 1] } : { scaleX: [0, 1], opacity: [0.4, 1] },
    { ease: "linear" },
  );

  scroll(animation);
})();
