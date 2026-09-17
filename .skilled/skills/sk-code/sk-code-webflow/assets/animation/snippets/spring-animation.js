/**
 * @title Spring Animation
 * @description Use spring() with animate() for natural motion. Assumes Motion is loaded as window.Motion.
 * @source https://motion.dev/docs/spring
 * @example Add data-motion-spring-target to an element and call window.MotionSpring.play().
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, spring } = window.Motion || {};
  if (typeof animate !== "function" || typeof spring !== "function") return;

  function play_spring() {
    const target = document.querySelector("[data-motion-spring-target]");
    if (!target) return null;

    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce_motion) {
      return animate(target, { opacity: [0.7, 1] }, { duration: 0.01 });
    }

    return animate(target, { transform: "translateX(64px)" }, {
      type: spring,
      bounce: 0.3,
      duration: 0.8,
    });
  }

  window.MotionSpring = { play: play_spring };
})();
