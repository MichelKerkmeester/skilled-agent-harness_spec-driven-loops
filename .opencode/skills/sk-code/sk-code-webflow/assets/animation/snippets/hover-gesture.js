/**
 * @title Hover Gesture
 * @description Use Motion hover() with animate() for hover start/end without touch-emulated sticky hover. Assumes Motion is loaded as window.Motion.
 * @source https://motion.dev/docs/hover
 * @example Add data-motion-hover-card to one or more elements and load this file after Motion.
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, hover } = window.Motion || {};
  if (typeof animate !== "function" || typeof hover !== "function") return;

  hover("[data-motion-hover-card]", (element) => {
    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enter_animation = animate(
      element,
      reduce_motion ? { opacity: [0.85, 1] } : { scale: 1.025, opacity: 1 },
      { duration: 0.18, ease: "easeOut" },
    );

    return () => {
      enter_animation.stop?.();
      animate(element, reduce_motion ? { opacity: 1 } : { scale: 1 }, {
        duration: 0.16,
        ease: "easeOut",
      });
    };
  });
})();
