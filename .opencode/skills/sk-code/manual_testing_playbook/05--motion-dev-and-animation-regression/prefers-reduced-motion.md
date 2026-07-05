---
title: "MR-003: Prefers Reduced Motion"
description: "Verify Motion-driven interactions respect prefers-reduced-motion by disabling transform-heavy motion or replacing it with instant or opacity-only state changes."
version: 3.5.0.3
---

# MR-003: Prefers Reduced Motion

## 1. OVERVIEW

This scenario verifies accessibility behavior for Motion-driven UI. Operators enable `prefers-reduced-motion: reduce`, exercise Motion-powered interactions, and confirm transform-heavy movement is disabled or replaced with an instant/opacity-only state change.

References:
- `https://motion.dev/docs/react-accessibility`
- `https://motion.dev/docs/react-use-reduced-motion`
- `https://motion.dev/docs/vue-motion-config`

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MR-003` and compare normal-motion and reduced-motion evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `MR-003` | Prefers Reduced Motion | Verify Motion interactions respect reduced-motion preference | `Test reduced-motion mode on the Motion slider and nav dropdown; return PASS/FAIL with before/after evidence.` | capture normal baseline -> enable DevTools Rendering reduced-motion emulation -> reload -> exercise interactions -> save video and console | media query matches reduce; testimonial slider avoids animated slide travel; nav/dropdown has no motion-sickness-inducing transform; no console errors | `/tmp/skc-MR003-normal.mp4`, `/tmp/skc-MR003-reduced.mp4`, `/tmp/skc-MR003-console.txt` | PASS iff reduced-motion mode visibly removes or neutralizes large transform motion and preserves usable state changes | If animation still travels, inspect source for `matchMedia('(prefers-reduced-motion: reduce)')` or equivalent guard |

## 3. TEST EXECUTION

### Prompt

```text
Test reduced-motion mode on the Motion slider and nav dropdown; return PASS/FAIL with before/after evidence.
```

### Commands

1. Open the target Webflow page containing the testimonial slider and nav dropdown.
2. Capture normal-motion baseline video to `/tmp/skc-MR003-normal.mp4`.
3. In Chrome DevTools, open Rendering and enable `Emulate CSS media feature prefers-reduced-motion: reduce`.
4. Reload the page.
5. In Console, run:
   ```js
   console.log("MR-003 reduced", window.matchMedia("(prefers-reduced-motion: reduce)").matches);
   ```
6. Exercise the same slider and dropdown interactions.
7. Save reduced-motion video to `/tmp/skc-MR003-reduced.mp4` and console transcript to `/tmp/skc-MR003-console.txt`.

### Expected

- Console logs `MR-003 reduced true`.
- Slider movement is instant or substantially neutralized under reduce mode.
- Any preserved transition is opacity-only or short enough not to create large spatial movement.
- UI remains usable: controls respond, active state updates, and no console errors appear.

### Evidence

- Before/after videos.
- Console transcript showing the media query is active.
- A short note naming whether the reduced alternative was instant, opacity-only, or disabled.

### Pass / Fail

- **Pass**: reduced-motion mode removes large transform/layout travel while preserving interaction state.
- **Fail**: reduced-motion mode still performs the same transform-heavy animation as normal mode, or the interaction becomes unusable.

### Failure Triage

1. Verify DevTools reduced-motion emulation is actually enabled.
2. Inspect `testimonial.js` for `matchMedia('(prefers-reduced-motion: reduce)')` guards.
3. Inspect whether dropdown code uses Motion `animate()` without a reduced-motion branch.
4. Compare expected accessibility behavior with Motion accessibility docs before filing remediation.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../code-animation/references/performance_and_pitfalls.md` | Local reduced-motion and performance pitfalls reference |
| `../../code-animation/references/quick_start.md` | Local cross-stack Motion setup reference |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | In-repo reduced-motion media query and slider behavior |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | Motion-driven dropdown behavior to check under reduced motion |
| `https://motion.dev/docs/react-accessibility` | Official reduced-motion accessibility guidance |
| `https://motion.dev/docs/react-use-reduced-motion` | Official reduced-motion hook behavior for Motion React |
| `https://motion.dev/docs/vue-motion-config` | Official reduced-motion configuration options for Motion Vue |

---

## 5. SOURCE METADATA

- Group: Motion.dev And Animation Regression
- Playbook ID: MR-003
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-MR003-normal.mp4`, `/tmp/skc-MR003-reduced.mp4`, `/tmp/skc-MR003-console.txt`
- Concurrent-safe: No; requires focused browser session
- Last validated: pending first manual run
