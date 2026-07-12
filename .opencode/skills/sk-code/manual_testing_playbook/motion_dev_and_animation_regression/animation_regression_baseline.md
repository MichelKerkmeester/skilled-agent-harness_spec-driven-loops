---
title: "MR-004: Animation Regression Baseline"
description: "Capture visual regression baselines for key Motion-driven UI elements including the nav dropdown and testimonial slider."
version: 3.5.0.3
---

# MR-004: Animation Regression Baseline

## 1. OVERVIEW

This scenario captures repeatable visual regression evidence for Motion-driven UI elements. It focuses on the dropdown open/close flow anchored by `nav_dropdown.js` and the testimonial slider motion anchored by `testimonial.js`.

The goal is not pixel-perfect automation. The operator captures a baseline video, records timing and interaction notes, then compares future runs against the baseline for missing motion, jank, wrong end state, console errors, or accessibility regressions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MR-004` and produce a baseline bundle that future manual testers can reuse.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `MR-004` | Animation Regression Baseline | Capture reusable baseline videos for Motion dropdown and testimonial slider flows | `Record baseline videos for the Motion dropdown and slider flows; compare drift, console errors, and timing regressions.` | open target page -> clear console -> record dropdown -> record slider -> save console -> compare with previous baseline if present | dropdown opens/closes smoothly and reaches correct final state; slider advances, snaps, and updates active state; no console errors | `/tmp/skc-MR004-nav-dropdown.mp4`, `/tmp/skc-MR004-testimonial.mp4`, `/tmp/skc-MR004-console.txt`, `/tmp/skc-MR004-verdict.md` | PASS iff both flows match baseline behavior or approved first baseline, with clean console and correct final states | If drift appears, isolate whether markup, Motion API, timing constants, or reduced-motion settings changed |

## 3. TEST EXECUTION

### Prompt

```text
Record baseline videos for the Motion dropdown and slider flows; compare drift, console errors, and timing regressions.
```

### Commands

1. Open the target page at desktop width `1440x900`.
2. Clear the browser console.
3. Record the nav dropdown sequence:
   - open first dropdown
   - close it
   - open a second dropdown if present
   - press Escape
4. Save video to `/tmp/skc-MR004-nav-dropdown.mp4`.
5. Record the testimonial slider sequence:
   - click next
   - click previous
   - drag one slide if drag is supported
   - click a tab/avatar if present
6. Save video to `/tmp/skc-MR004-testimonial.mp4`.
7. Save console transcript to `/tmp/skc-MR004-console.txt`.
8. Compare with the latest approved baseline and write `/tmp/skc-MR004-verdict.md`.

### Expected

- Dropdown reaches fully visible and fully hidden states with no stuck height/opacity/visibility state.
- Testimonial slider snaps to the intended slide and updates step/active indicators.
- Motion timing feels consistent with current constants in source.
- Console has no uncaught Motion import/runtime errors.

### Evidence

- Two videos, one console transcript, and one verdict Markdown file.
- Verdict includes viewport size, browser/version, target URL, baseline date, and operator name/runtime.

### Pass / Fail

- **Pass**: baseline is captured or matched; final states are correct; console is clean.
- **Fail**: visible regression, broken final state, stuck interaction, missing Motion API, or uncaught console error.

### Failure Triage

1. If dropdown height sticks, inspect height/overflow cleanup in `nav_dropdown.js`.
2. If slider snaps incorrectly, inspect `motionValue`, wrapping, and reduced-motion branches in `testimonial.js`.
3. If Motion is unavailable, run MR-001 and MR-002 before investigating UI code.
4. If only timing changed, compare constants and record whether the change was intentional.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/animate_and_timelines.md` | Local `animate()` and sequence guidance |
| `../../code-webflow/references/animation/performance_and_pitfalls.md` | Local animation regression and performance risk guidance |
| `../../code-webflow/assets/animation/snippets/stagger_animation.js` | Local stagger example for list-style regression cases |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | Dropdown Motion animation anchor |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | Testimonial slider Motion animation anchor |
| `https://motion.dev/docs/animate` | Official `animate()` behavior reference |
| `https://motion.dev/docs/quick-start` | Official Motion install and first-animation reference |

---

## 5. SOURCE METADATA

- Group: Motion.dev And Animation Regression
- Playbook ID: MR-004
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-MR004-nav-dropdown.mp4`, `/tmp/skc-MR004-testimonial.mp4`, `/tmp/skc-MR004-console.txt`, `/tmp/skc-MR004-verdict.md`
- Concurrent-safe: No; baseline recording requires a stable browser session
- Last validated: pending first manual run
