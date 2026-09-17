/**
 * @title ES Module Bootstrap
 * @description Skeleton for ES module imports and initialization, matching the repo's dynamic-import testimonial pattern.
 * @source https://motion.dev/docs/quick-start
 * @example Load with <script type="module" src="es-module-bootstrap.js"></script>; it dynamically imports the pinned Motion ESM bundle.
 */
(() => {
  "use strict";

  const MOTION_IMPORT_URL = "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";
  let motion_import_promise = null;

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  function import_motion() {
    if (!motion_import_promise) {
      motion_import_promise = import(MOTION_IMPORT_URL).catch((error) => {
        motion_import_promise = null;
        throw error;
      });
    }
    return motion_import_promise;
  }

  async function ensure_motion_api() {
    if (window.Motion?.animate && window.Motion?.motionValue) return window.Motion;

    try {
      const motion = await import_motion();
      if (typeof motion.animate !== "function" || typeof motion.motionValue !== "function") {
        console.warn("[motion-esm] Required Motion exports missing from pinned ESM bundle");
        return window.Motion || null;
      }

      window.Motion = {
        ...(window.Motion || {}),
        animate: window.Motion?.animate || motion.animate,
        inView: window.Motion?.inView || motion.inView,
        motionValue: window.Motion?.motionValue || motion.motionValue,
        scroll: window.Motion?.scroll || motion.scroll,
      };

      window.dispatchEvent(new CustomEvent("motion:ready"));
    } catch (error) {
      console.warn("[motion-esm] Motion.dev import failed:", error);
    }

    return window.Motion || null;
  }

  async function bootstrap_motion_example() {
    const motion = await ensure_motion_api();
    const target = document.querySelector("[data-motion-esm-target]");
    if (!target || typeof motion?.animate !== "function") return;

    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const keyframes = reduce_motion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [8, 0] };
    const options = reduce_motion ? { duration: 0.01 } : { duration: 0.25, ease: "easeOut" };
    motion.animate(target, keyframes, options);
  }

  bootstrap_motion_example();
})();
