/**
 * @title Layout Transition
 * @description Use Motion+ animateLayout for layout animations. This API is early access and requires Motion+ per the docs.
 * @source https://motion.dev/docs/layout-animations
 * @example Load Motion+ animateLayout, add data-layout to the moving child, then call window.MotionLayout.toggle().
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const animate_layout = window.MotionPlus?.animateLayout || window.Motion?.animateLayout;
  if (typeof animate_layout !== "function") return;

  function toggle_layout() {
    const container = document.querySelector("[data-motion-layout-container]");
    if (!container) return null;

    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return animate_layout(
      () => {
        container.toggleAttribute("data-expanded");
      },
      reduce_motion ? { duration: 0.01 } : { type: "spring" },
    );
  }

  window.MotionLayout = { toggle: toggle_layout };
})();
