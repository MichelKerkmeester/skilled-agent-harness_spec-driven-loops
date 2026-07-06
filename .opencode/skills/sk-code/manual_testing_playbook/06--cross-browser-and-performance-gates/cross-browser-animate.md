---
title: "CB-001: Cross-Browser Motion Animate"
description: "Verify Motion animations render correctly in Chrome, Safari, and Firefox latest stable and record any browser-specific quirks."
version: 3.5.0.3
---

# CB-001: Cross-Browser Motion Animate

## 1. OVERVIEW

This scenario verifies that Motion-driven UI behaves consistently across Chrome, Safari, and Firefox latest stable. It focuses on observable animation behavior, final visual states, and browser-specific console or rendering quirks.

References:
- `https://motion.dev/docs/quick-start`
- `https://motion.dev/docs/animate`
- `https://motion.dev/docs/performance`

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CB-001` in three browsers and capture comparable evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `CB-001` | Cross-Browser Motion Animate | Verify Motion UI behavior in Chrome, Safari, and Firefox latest stable | `Test the Motion dropdown and slider in Chrome, Safari, and Firefox; return per-browser PASS/FAIL and an aggregate verdict.` | open target in Chrome -> run interactions -> save evidence -> repeat in Safari -> repeat in Firefox -> write matrix | same final states in all browsers; no uncaught Motion errors; quirks documented if non-blocking | `/tmp/skc-CB001-{browser}.txt`, `/tmp/skc-CB001-{browser}.mp4`, `/tmp/skc-CB001-matrix.md` | PASS iff all browsers reach correct final states and no browser has a blocking console/runtime error | If one browser fails, isolate import support, WAAPI support, CSS/media query differences, or reduced-motion settings |

## 3. TEST EXECUTION

### Prompt

```text
Test the Motion dropdown and slider in Chrome, Safari, and Firefox; return per-browser PASS/FAIL and an aggregate verdict.
```

### Commands

1. For each browser (`chrome`, `safari`, `firefox`), open the same target URL at `1440x900`.
2. Record browser and version in `/tmp/skc-CB001-{browser}.txt`.
3. Clear console and run the nav dropdown sequence from MR-004.
4. Run the testimonial slider sequence from MR-004.
5. Save video to `/tmp/skc-CB001-{browser}.mp4`.
6. Save console transcript to `/tmp/skc-CB001-{browser}.txt`.
7. Write `/tmp/skc-CB001-matrix.md` with columns: browser, version, dropdown verdict, slider verdict, console verdict, quirks, final verdict.

### Expected

- Chrome, Safari, and Firefox all render the same final visible/hidden dropdown states.
- Slider advances and snaps correctly in all browsers.
- Browser-specific quirks are documented without silently downgrading failures.
- No uncaught module import, `animate()`, `motionValue`, or event-handler errors appear.

### Evidence

- One transcript per browser.
- One video per browser.
- Aggregate matrix with PASS/PARTIAL/FAIL for each browser and one aggregate verdict.

### Pass / Fail

- **Pass**: all three browsers pass the dropdown, slider, and console checks.
- **Partial**: a non-blocking visual quirk is documented but final state and interaction remain correct.
- **Fail**: any browser has broken final state, blocked interaction, or uncaught Motion runtime error.

### Failure Triage

1. If Safari fails, confirm module/CDN import behavior and autoplay/security settings.
2. If Firefox differs visually, inspect CSS transform/filter support and DevTools warnings.
3. If only one browser reports reduced motion, check OS/browser accessibility settings.
4. If all browsers fail, run MR-001 before browser-specific debugging.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/quick_start.md` | Local Motion install/import reference |
| `../../code-webflow/references/animation/animate_and_timelines.md` | Local `animate()` and sequence guidance |
| `../../code-webflow/references/animation/performance_and_pitfalls.md` | Local browser/performance risk guidance |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | Dropdown behavior under browser comparison |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | Slider behavior under browser comparison |
| `https://motion.dev/docs/quick-start` | Official Motion install reference |
| `https://motion.dev/docs/animate` | Official animation reference |
| `https://motion.dev/docs/performance` | Official performance and browser-testing guidance |

---

## 5. SOURCE METADATA

- Group: Cross-Browser And Performance Gates
- Playbook ID: CB-001
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-CB001-{browser}.txt`, `/tmp/skc-CB001-{browser}.mp4`, `/tmp/skc-CB001-matrix.md`
- Concurrent-safe: No; requires browser-by-browser visual capture
- Last validated: pending first manual run
