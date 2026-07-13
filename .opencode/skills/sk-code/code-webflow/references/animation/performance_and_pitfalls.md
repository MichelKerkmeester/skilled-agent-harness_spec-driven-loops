---
title: "Motion.dev Performance and Pitfalls"
description: "Performance guidance for Motion animations, bundle sizing, reduced-motion compliance, and Core Web Vitals risk."
trigger_phrases:
  - "motion dev performance pitfalls"
  - "gpu composited animation properties"
  - "animation layout thrashing"
  - "reduced motion compliance"
  - "animation bundle size"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Motion.dev Performance and Pitfalls

Performance guidance for Motion animations, bundle sizing, reduced-motion compliance, and Core Web Vitals risk.


---

## 1. OVERVIEW

### Core Principle

Motion improves control, but animation still has to protect compositing, reduced-motion preferences, and interaction latency.

### Purpose

This reference keeps Motion-specific performance choices aligned with local Webflow performance rules and browser Core Web Vitals risk.

### When to Use

- You are choosing animation properties, import size, or reduced-motion behavior.
- You need to identify layout-thrashing Motion anti-patterns.
- You are assessing LCP, CLS, or INP risk from animation work.

### Key Sources

- Official: https://motion.dev/docs/quick-start
- Official: https://motion.dev/docs/animate
- Official: https://motion.dev/docs/scroll
- In-repo: `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/overview_and_checklist.md`

---

## 2. GPU-COMPOSITED PROPERTIES

Prefer `transform` and `opacity` for high-frequency or visible movement. Motion docs describe hardware acceleration for supported values and the `scroll()` page notes use of ScrollTimeline where supported for smoother browser-run scroll animations (Sources: https://motion.dev/docs/quick-start, https://motion.dev/docs/scroll).

```js
animate(".card", { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] });
```

Existing sk-code Webflow guidance gives the same local rule: animate `transform` and `opacity` first, and manage `will-change` dynamically around active animations (Repo: `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/overview_and_checklist.md`).

## 3. LAYOUT-THRASHING ANTI-PATTERNS

Avoid animating layout properties like `top`, `left`, `width`, and `height` unless the UX requires measured layout transitions. These properties can cause layout recalculation and Core Web Vitals/INP risk in the local performance guide (Repo: `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/overview_and_checklist.md`).

When height is required, use measured-height patterns and cleanup, as local dropdowns do:
- measure natural height,
- animate `height` from/to explicit pixels,
- restore `height: auto` or hidden state in `onComplete` (Repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/navigation/nav_language_selector.js`).

## 4. BUNDLE SIZE CONSIDERATIONS

Motion documents a mini `animate()` import for small HTML/SVG style animation and a larger hybrid import for independent transforms, sequence arrays, CSS variables, SVG paths, objects, and WebGL (Source: https://motion.dev/docs/animate).

Decision:
- Use `motion/mini` or `animateMini`-style guidance for small bundled interactions that only need HTML/SVG style animation (Source: https://motion.dev/docs/animate).
- Use the hybrid `motion` import when you need `x`/`y` independent transforms, sequences, motion values, or non-DOM values (Source: https://motion.dev/docs/animate).
- Use CDN globals in Webflow/no-code contexts only when bundling is not available or a project already centralizes Motion loading (Source: https://motion.dev/docs/quick-start; repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`).

## 5. PREFERS-REDUCED-MOTION COMPLIANCE

Respect OS/browser reduced-motion preferences. Motion's React/Vue docs provide framework helpers and configuration, while vanilla JavaScript can use `window.matchMedia("(prefers-reduced-motion: reduce)")` before choosing transform-heavy animations (Sources: https://motion.dev/docs/react-use-reduced-motion, https://motion.dev/docs/react-accessibility, https://motion.dev/docs/vue-motion-config).

Plain JS pattern:

```js
const reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

animate(
  element,
  reduce_motion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [16, 0] },
  { duration: reduce_motion ? 0.01 : 0.35 },
);
```

Local anchors:
- `a_nobel_en_zn/2_javascript/slider/testimonial.js` uses `matchMedia("(prefers-reduced-motion: reduce)")` to skip meaningful transition duration in snap behavior.
- `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js` includes reduced-motion/mobile detection for video behavior.

## 6. CWV IMPACT

Animation can affect Core Web Vitals indirectly:
- LCP risk: hiding hero content until animation dependencies load can delay visible content.
- CLS risk: animating or late-changing layout dimensions can shift content.
- INP risk: pointer/scroll handlers, drag loops, and long tasks can delay interaction feedback.

Mitigations:
- Keep critical content visible or ensure fallbacks set final state when Motion is missing (Repo: `a_nobel_en_zn/2_javascript/hero/hero_general.js`, `a_nobel_en_zn/2_javascript/hero/hero_cards.js`).
- Prefer transform/opacity and pre-measured layout changes (Repo: `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/overview_and_checklist.md`).
- Use `requestAnimationFrame` for render scheduling and avoid unnecessary per-frame DOM reads (Repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`).
- For scroll-linked animation, use `scroll()` where supported so the browser can use ScrollTimeline for supported animations (Source: https://motion.dev/docs/scroll).

## 7. FRAME-LEVEL VISUAL VERIFICATION

Use this only when ordinary browser verification passes but the animation still feels too fast, robotic, abrupt, clipped, or poorly staged. Existing Webflow verification remains authoritative for opening a real browser, checking console output, viewports, reduced-motion behavior, and performance metrics.

Frame-level review adds a motion-designer pass:

| Step | What to do | Evidence to record |
|---|---|---|
| Capture | Record the animation path: scroll, hover, click, or manual interaction. | Browser, viewport, interaction, and capture duration. |
| Extract | Convert the recording to evenly sampled frames, such as 25fps. | Frame rate and output frame count. |
| Contact sheet | Build a labelled grid of sampled frames before drilling into individual frames. | Contact sheet path and sampled frame range. |
| Map phases | Identify entrance, dwell, and exit windows. | Start/end frame numbers and visible duration. |
| Drill in | Read suspect frames every 2-3 frames around the issue. | Exact frame where jump, clipping, early exit, or timing mismatch appears. |
| Re-run | Apply the fix, capture again, and compare the same windows. | Before/after frame numbers and whether the issue moved or disappeared. |

Look for:
- Abrupt first/last frame movement, which usually means easing is too weak or a segment is too short.
- Dwell lasting only a handful of frames, which means the user never gets time to read the state.
- Multiple items arriving on the same frame, which usually needs stagger or reversed stagger.
- Unexpected jumps, which often come from competing controls on the same property.
- Clipping during arc, throw, or scatter movement, especially under `overflow: hidden` parents.

Do not vendor external recording scripts into sk-code for this workflow. Prefer the active project's browser automation path, such as Chrome DevTools MCP, `mcp-chrome-devtools`/`bdg`, Playwright, or a local recording tool that the project already accepts.

## 8. REFERENCES AND RELATED RESOURCES

- Motion quick start and hardware acceleration note: https://motion.dev/docs/quick-start
- Motion `animate()` mini/hybrid distinction: https://motion.dev/docs/animate
- Motion `scroll()` and ScrollTimeline note: https://motion.dev/docs/scroll
- Motion React accessibility/reduced-motion guidance: https://motion.dev/docs/react-accessibility, https://motion.dev/docs/react-use-reduced-motion
- Motion Vue reduced-motion config: https://motion.dev/docs/vue-motion-config
- Mined frame/contact-sheet workflow: `Schmandarine/web-motion-skill` (MIT), `SKILL.md`, `README.md`, and `scripts/contact-sheet.sh`
- Local Webflow performance guide: `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/overview_and_checklist.md`
- Local dropdown measured-height examples: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/navigation/nav_language_selector.js`
- Local drag/rAF/reduced-motion example: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- Local video reduced-motion/mobile guard: `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js`

---

*Attribution: Frame-level visual verification guidance in this reference adapts `Schmandarine/web-motion-skill` (MIT).*
