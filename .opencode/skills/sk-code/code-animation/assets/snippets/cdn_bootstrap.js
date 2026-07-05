// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CDN Bootstrap                                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * @title CDN Bootstrap
 * @description Skeleton for window.Motion CDN-bundle initialization with safety guards, mirroring the repo's guarded Webflow pattern.
 * @source https://motion.dev/docs/quick-start
 * @example Load https://cdn.jsdelivr.net/npm/motion@12.38.0/dist/motion.js before this file.
 */
(() => {

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const INIT_FLAG = "__motionExampleCdnInit";
  const INIT_DELAY_MS = 50;

  function init_motion_example() {
    const { animate } = window.Motion || {};
    if (typeof animate !== "function") return;

    const target = document.querySelector("[data-motion-cdn-target]");
    if (!target) return;

    animate(target, { opacity: [0, 1] }, { duration: 0.25, ease: "easeOut" });
  }

  function start() {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => window.setTimeout(init_motion_example, INIT_DELAY_MS),
        { once: true },
      );
      return;
    }

    window.setTimeout(init_motion_example, INIT_DELAY_MS);
  }

  if (window.Webflow?.push) window.Webflow.push(start);
  else start();
})();
