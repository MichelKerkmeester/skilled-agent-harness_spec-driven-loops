---
title: "CB-003: GPU Compositing"
description: "Verify Motion animations prefer GPU-composited properties and identify layout-thrashing animations through Chrome DevTools."
version: 3.5.0.3
---

# CB-003: GPU Compositing

## 1. OVERVIEW

This scenario verifies that Motion-driven animations prefer compositor-friendly properties (`transform`, `opacity`) and that any layout-affecting animation is explicitly identified. It uses Chrome DevTools Rendering and Performance panels to detect layout thrashing, paint storms, and non-composited animations.

Reference: `https://motion.dev/docs/performance`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CB-003` and capture DevTools evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `CB-003` | GPU Compositing | Verify Motion animations use compositor-friendly properties where expected | `Inspect Motion dropdown and slider compositing in Chrome DevTools; flag layout animations and return PASS/FAIL with trace notes.` | open target -> enable paint flashing/layer borders -> record performance trace -> exercise dropdown and slider -> inspect layout/paint/composite events -> write verdict | slider transform uses compositor-friendly path; dropdown height animation is identified as layout-affecting; no unexpected repeated forced layouts | `/tmp/skc-CB003-trace.json`, `/tmp/skc-CB003-rendering.png`, `/tmp/skc-CB003-verdict.md` | PASS iff transform/opacity animations are composited where expected and any layout-affecting animation is documented with acceptable rationale | If layout thrashing appears, inspect reads/writes around `scrollHeight`, `offsetHeight`, and repeated style mutation |

## 3. TEST EXECUTION

### Prompt

```text
Inspect Motion dropdown and slider compositing in Chrome DevTools; flag layout animations and return PASS/FAIL with trace notes.
```

### Commands

1. Open the target page in Chrome stable at `1440x900`.
2. Open DevTools Rendering panel.
3. Enable Paint flashing and Layer borders.
4. Open Performance panel, enable Screenshots and Web Vitals, then start recording.
5. Exercise:
   - nav dropdown open/close
   - testimonial next/previous
   - testimonial drag if available
6. Stop recording and export trace to `/tmp/skc-CB003-trace.json`.
7. Save a Rendering panel screenshot to `/tmp/skc-CB003-rendering.png`.
8. Write `/tmp/skc-CB003-verdict.md` listing animated properties, layout/paint/composite observations, and PASS/FAIL.

### Expected

- Testimonial slide movement uses `transform: translate3d(...)` and does not repeatedly trigger layout during steady animation.
- Opacity/transform animations show compositor-friendly behavior.
- Dropdown height animation is recognized as layout-affecting and reviewed for acceptable scope.
- No unexpected repeated forced layout loop appears in the Performance trace.

### Evidence

- Chrome Performance trace.
- Rendering panel screenshot.
- Verdict Markdown with property-by-property assessment.

### Pass / Fail

- **Pass**: compositor-friendly animations are confirmed, any layout-affecting dropdown animation is bounded and documented, and no unexpected layout thrashing appears.
- **Fail**: transform/opacity animations still trigger repeated layout unexpectedly, dropdown animation causes visible jank or large layout shifts, or trace shows repeated forced layouts tied to Motion handlers.

### Failure Triage

1. If layout events cluster around dropdown open/close, inspect `scrollHeight` and `offsetHeight` reads in `nav_dropdown.js`.
2. If slider animation paints every frame, verify `translate3d` style and `willChange` handling in `testimonial.js`.
3. If INP/CWV also regressed, run CB-002 and correlate long tasks with the trace.
4. If a browser differs, run CB-001 before declaring a code-level regression.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/performance-and-pitfalls.md` | Local compositor-friendly animation guidance |
| `../../code-webflow/references/animation/animate-and-timelines.md` | Local transform/opacity animation reference |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | Dropdown height/opacity animation and forced reflow anchor |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | Slider transform/motionValue/willChange anchor |
| `https://motion.dev/docs/performance` | Official Motion performance and compositor guidance |

---

## 5. SOURCE METADATA

- Group: Cross-Browser And Performance Gates
- Playbook ID: CB-003
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-CB003-trace.json`, `/tmp/skc-CB003-rendering.png`, `/tmp/skc-CB003-verdict.md`
- Concurrent-safe: No; performance trace requires isolated browser state
- Last validated: pending first manual run
