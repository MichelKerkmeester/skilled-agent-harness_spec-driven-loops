/**
 * @title Timeline Sequence
 * @description Sequence multiple animations using animate(sequence), including parallel and relative timing.
 * @source https://motion.dev/docs/animate
 * @example Add data-motion-panel, data-motion-backdrop, and data-motion-item elements, then call window.MotionSequence.play().
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate } = window.Motion || {};
  if (typeof animate !== "function") return;

  function play_sequence() {
    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sequence = reduce_motion
      ? [
          ["[data-motion-backdrop]", { opacity: [0, 1] }, { duration: 0.01 }],
          ["[data-motion-panel]", { opacity: [0, 1] }, { at: "<", duration: 0.01 }],
        ]
      : [
          ["[data-motion-backdrop]", { opacity: [0, 1] }, { duration: 0.2 }],
          ["[data-motion-panel]", { x: ["100%", "0%"] }, { at: "<", duration: 0.35 }],
          ["[data-motion-item]", { opacity: [0, 1], y: [8, 0] }, { at: "-0.1", duration: 0.2 }],
        ];

    return animate(sequence, { defaultTransition: { ease: "easeOut" } });
  }

  window.MotionSequence = { play: play_sequence };
})();
