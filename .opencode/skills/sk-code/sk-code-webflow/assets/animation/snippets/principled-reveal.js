/**
 * @title Principled Reveal
 * @description Compose anticipation, timing vocabulary, and stagger direction with Motion.dev.
 * @source Adapted from Schmandarine/web-motion-skill (MIT) and https://motion.dev/docs/stagger
 * @example Add data-motion-principled-reveal around data-motion-principled-item nodes, then call window.MotionPrincipledReveal.play().
 */
(() => {
  "use strict";

  // Webflow convention: snake_case names. Other stacks may use their local convention.
  const { animate, stagger } = window.Motion || {};
  if (typeof animate !== "function" || typeof stagger !== "function") return;

  const EASINGS = {
    natural_in_out: [0.4, 0, 0.2, 1],
    smooth_out: [0.22, 1, 0.36, 1],
    emphatic_out: [0.16, 1, 0.3, 1],
  };

  const TIMING = {
    feedback: 0.12,
    standard: 0.28,
    meaningful: 0.45,
    emphasis: 0.65,
  };

  function resolve_scope(root) {
    if (root instanceof Element && root.matches("[data-motion-principled-reveal]")) {
      return root;
    }

    return root?.querySelector?.("[data-motion-principled-reveal]") || null;
  }

  function play_principled_reveal(root = document) {
    const scope = resolve_scope(root);
    if (!scope) return null;

    const items = scope.querySelectorAll("[data-motion-principled-item]");
    if (!items.length) return null;

    const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce_motion) {
      return animate(items, { opacity: [0, 1] }, { duration: 0.01, delay: 0 });
    }

    const direction = scope.dataset.motionStaggerDirection === "reverse" ? "last" : "first";
    const stagger_offset = Number(scope.dataset.motionStaggerOffset || 0.08);

    const sequence = [
      [scope, { scale: [0.98, 1] }, { duration: TIMING.feedback, ease: EASINGS.smooth_out }],
      [
        items,
        { opacity: [0, 1], y: [18, 0], scale: [0.98, 1] },
        {
          at: "-0.04",
          delay: stagger(stagger_offset, { from: direction, ease: EASINGS.smooth_out }),
          duration: TIMING.meaningful,
          ease: EASINGS.natural_in_out,
        },
      ],
    ];

    return animate(sequence, { defaultTransition: { ease: EASINGS.smooth_out } });
  }

  window.MotionPrincipledReveal = {
    easings: EASINGS,
    play: play_principled_reveal,
    timing: TIMING,
  };
})();
