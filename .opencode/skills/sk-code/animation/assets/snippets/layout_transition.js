/**
 * @title Layout Transition
 * @description Use Motion+ animateLayout via its documented early-access module import.
 * @source https://motion.dev/docs/layout-animations
 * @example The snippet dynamically imports motion-plus/animate-layout, then exposes window.MotionLayout.toggle().
 */
(async () => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  let animate_layout = null;
  try {
    ({ unstable_animateLayout: animate_layout } = await import("motion-plus/animate-layout"));
  } catch (error) {
    console.warn("[motion-layout] Motion+ animateLayout import failed:", error);
    return;
  }

  if (typeof animate_layout !== "function") {
    console.warn("[motion-layout] unstable_animateLayout export missing from motion-plus/animate-layout");
    return;
  }

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
