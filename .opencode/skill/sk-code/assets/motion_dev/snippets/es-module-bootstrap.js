/**
 * @title ES Module Bootstrap
 * @description Skeleton for ES module imports and initialization, matching the repo's dynamic-import testimonial pattern.
 * @source https://motion.dev/docs/quick-start
 * @example Load this file with <script type="module" src="es-module-bootstrap.js"></script>.
 */
import {
  animate,
  inView,
  motionValue,
  scroll,
} from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

// Webflow convention: snake_case names. Other stacks may use their local convention.
window.Motion = {
  ...(window.Motion || {}),
  animate: window.Motion?.animate || animate,
  inView: window.Motion?.inView || inView,
  motionValue: window.Motion?.motionValue || motionValue,
  scroll: window.Motion?.scroll || scroll,
};

window.dispatchEvent(new CustomEvent("motion:ready"));

const target = document.querySelector("[data-motion-esm-target]");
if (target) {
  animate(target, { opacity: [0, 1], y: [8, 0] }, { duration: 0.25, ease: "easeOut" });
}
