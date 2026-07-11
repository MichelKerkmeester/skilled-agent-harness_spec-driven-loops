---
title: "Motion.dev Playbook Entries"
description: "Scenario-ready entries for Packet 1's motion.dev and animation regression playbook category."
trigger_phrases:
  - "motion dev playbook entries"
  - "animation regression playbook"
  - "motion api smoke test"
  - "prefers reduced motion scenario"
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Motion.dev Playbook Entries

Scenario-ready entries for Packet 1's motion.dev and animation regression playbook category.

---

## 1. OVERVIEW

### Purpose

These entries can be lifted into `.opencode/skills/sk-code/manual_testing_playbook/motion-dev-and-animation-regression/` or used standalone. They expand Packet 1's MR-001 through MR-004 scenarios with API context from `references/animation/`.

### Usage

Copy the relevant scenario entry into the manual testing playbook, then update artifact paths, browser setup notes, and API context links for the current test run.

## 2. SCENARIO ENTRIES

### MR-001 - Motion.dev API Smoke

Prompt:

```text
Create a sandboxed Webflow-style Motion smoke page that imports animate, inView, and spring from a pinned motion CDN URL. Run it in Chrome, verify exports are functions, run one animate() call, trigger one inView() callback, and return PASS/FAIL with console evidence.
```

Expected signals:
- CDN URL uses a concrete version, not `@latest`.
- `animate`, `inView`, and `spring` are functions.
- `animate()` completes without an uncaught exception.
- `inView()` fires after the target enters the viewport.

Evidence:
- `/tmp/skc-MR001-console.txt`
- screenshot or short video of the animated element
- exact CDN URL used

API context:
- `references/animation/quick_start.md`
- `references/animation/animate_and_timelines.md`
- `references/animation/scroll_and_gestures.md`

### MR-002 - CDN Bundle Version Pin

Prompt:

```text
Audit the repo for Motion CDN URLs. Confirm no production Motion URL uses @latest, record the pinned version(s), and verify the pinned ESM bundle exposes animate, inView, scroll, and motionValue for the testimonial slider pattern.
```

Expected signals:
- Production CDN URLs are version-pinned.
- Documentation/example hits are classified separately from production loaders.
- Required exports for `testimonial.js` are present: `animate`, `inView`, `scroll`, and `motionValue`.

Evidence:
- `/tmp/skc-MR002-version-pin.txt`
- `/tmp/skc-MR002-export-probe.txt`

API context:
- `references/animation/quick_start.md`
- `references/animation/integration_patterns.md`
- `assets/animation/install_card.md`

### MR-003 - Prefers Reduced Motion

Prompt:

```text
Enable prefers-reduced-motion: reduce in Chrome DevTools, exercise the Motion testimonial slider and nav dropdown, and verify transform-heavy movement is disabled, shortened to instant state changes, or replaced with opacity-only changes. Return PASS/FAIL with before/after evidence.
```

Expected signals:
- Browser reports `matchMedia("(prefers-reduced-motion: reduce)").matches === true`.
- Large transform or parallax-style motion is removed, instant, or replaced with opacity-only behavior.
- UI remains usable and reaches correct final states.

Evidence:
- `/tmp/skc-MR003-normal.mp4`
- `/tmp/skc-MR003-reduced.mp4`
- console transcript

API context:
- `references/animation/performance_and_pitfalls.md`
- `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js`

### MR-004 - Animation Regression Baseline

Prompt:

```text
Record baseline videos for the Motion nav dropdown open/close flow and testimonial slider next/previous/drag flow. Compare the run against the current baseline, note any visual drift, console errors, or timing regressions, and return PASS/FAIL with artifact paths.
```

Expected signals:
- Dropdown opens and closes with correct height/opacity/final hidden state.
- Slider next/previous/drag flows snap to expected slides and update indicators.
- Console has no Motion import/runtime error.

Evidence:
- `/tmp/skc-MR004-nav-dropdown.mp4`
- `/tmp/skc-MR004-testimonial.mp4`
- `/tmp/skc-MR004-console.txt`
- `/tmp/skc-MR004-verdict.md`

API context:
- `references/animation/animate_and_timelines.md`
- `references/animation/scroll_and_gestures.md`
- `references/animation/performance_and_pitfalls.md`
- `assets/animation/snippets/stagger_animation.js`

## 3. CONTRACT REGRESSION EXAMPLES

Use these examples to prevent snippet and caveat drift in cross-stack routing checks.

| Query | Expected Surface | Expected Outputs |
|-------|------------------|------------------|
| `Show me a motion.dev animate-on-scroll example for any stack.` | N/A or UNKNOWN | `assets/animation/snippets/animate_on_scroll.js`, `references/animation/scroll_and_gestures.md`, `references/animation/quick_start.md` |
| `Give me a Webflow-safe Motion.dev in-view reveal snippet.` | WEBFLOW | `assets/animation/snippets/in_view_reveal.js`, `references/implementation/animation_workflows/overview-decision-tree-and-css.md`, `references/animation/scroll_and_gestures.md`, plus the Webflow `snake_case` naming caveat |
| `Reuse the Motion.dev stagger snippet in a stack-agnostic example, not Webflow.` | UNKNOWN or N/A | `assets/animation/snippets/stagger_animation.js`, `references/animation/animate_and_timelines.md`; no `references/*` surface resources for a non-Webflow task |

Expected response shape: name the exact snippet asset, include the relevant Motion.dev reference file, and only add the Webflow `snake_case` caveat when the prompt is Webflow-owned.

## 4. CROSS-LINKS

- Packet 1 root playbook: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md`
- Packet 1 MR category: `.opencode/skills/sk-code/manual_testing_playbook/motion-dev-and-animation-regression/`
- Motion quick start: `references/animation/quick_start.md`
- Motion integration patterns: `references/animation/integration_patterns.md`
- Motion performance guidance: `references/animation/performance_and_pitfalls.md`
- Motion stagger snippet: `assets/animation/snippets/stagger_animation.js`

## 5. RELATED RESOURCES

- Motion install/API smoke: https://motion.dev/docs/quick-start, https://motion.dev/docs/animate, https://motion.dev/docs/inview, https://motion.dev/docs/spring
- Motion scroll/gesture context: https://motion.dev/docs/scroll, https://motion.dev/docs/hover, https://motion.dev/docs/press
- Motion accessibility context: https://motion.dev/docs/react-accessibility, https://motion.dev/docs/react-use-reduced-motion
- Local dropdown anchor: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- Local slider anchor: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
