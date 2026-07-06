---
title: "CB-002: Core Web Vitals Gates"
description: "Measure LCP, CLS, and INP on a page with Motion animations and verify the configured performance thresholds."
version: 3.5.0.3
---

# CB-002: Core Web Vitals Gates

## 1. OVERVIEW

This scenario verifies that Motion-driven pages stay inside Core Web Vitals gates. Operators measure Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint with Chrome DevTools or PageSpeed Insights and apply fixed thresholds.

Thresholds:
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

References:
- `https://motion.dev/docs/performance`
- `https://web.dev/articles/vitals`

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CB-002` and capture numeric evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `CB-002` | Core Web Vitals Gates | Verify Motion-heavy page stays under CWV thresholds | `Measure LCP, CLS, and INP on the Motion-heavy page; return PASS/FAIL against CWV thresholds.` | open target -> run Lighthouse/PageSpeed or DevTools Performance -> interact with slider/dropdown -> export report -> record metrics | metrics captured; thresholds evaluated; animation-related layout shifts or long interactions identified | `/tmp/skc-CB002-report.json` or `.html`, `/tmp/skc-CB002-verdict.md` | PASS iff LCP, CLS, and INP all meet thresholds and no animation-specific regression is present | If CLS fails, inspect layout-affecting animation; if INP fails, inspect event handlers and long tasks |

## 3. TEST EXECUTION

### Prompt

```text
Measure LCP, CLS, and INP on the Motion-heavy page; return PASS/FAIL against CWV thresholds.
```

### Commands

1. Open the target page in Chrome stable.
2. Use one approved measurement path:
   - Chrome DevTools Performance panel with Web Vitals enabled.
   - PageSpeed Insights report for the deployed URL.
3. Exercise the Motion interactions during measurement:
   - open and close nav dropdown
   - click testimonial next/previous
   - drag testimonial slide if available
4. Export the report to `/tmp/skc-CB002-report.json` or `/tmp/skc-CB002-report.html`.
5. Write `/tmp/skc-CB002-verdict.md` with measured LCP, CLS, INP, threshold comparison, and failure triage notes.

### Expected

- LCP is below `2.5s`.
- CLS is below `0.1`.
- INP is below `200ms`.
- Report identifies no layout shift caused by Motion animations.
- Interactions do not create long tasks that explain INP failure.

### Evidence

- Exported DevTools/PageSpeed report.
- Verdict Markdown with metric table and PASS/FAIL.
- Screenshot of the Web Vitals section if report export is unavailable.

### Pass / Fail

- **Pass**: all three metrics are below threshold.
- **Fail**: any metric misses threshold, or the report attributes a meaningful regression to Motion-driven layout/interaction work.

### Failure Triage

1. If LCP fails, verify animation code is not delaying hero content visibility.
2. If CLS fails, inspect animations of `height`, layout-affecting properties, or late-injected styles.
3. If INP fails, inspect slider drag/click handlers, long tasks, and main-thread blocking.
4. Compare failure patterns with Motion performance guidance before deciding remediation.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/performance_and_pitfalls.md` | Local Motion performance and reduced-jank guidance |
| `../../code-webflow/references/animation/animate_and_timelines.md` | Local animation property and sequence guidance |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | Dropdown interaction and height animation anchor |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | Slider interaction and transform animation anchor |
| `https://motion.dev/docs/performance` | Official Motion performance guidance |
| `https://web.dev/articles/vitals` | Core Web Vitals metric definitions and thresholds reference |

---

## 5. SOURCE METADATA

- Group: Cross-Browser And Performance Gates
- Playbook ID: CB-002
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-CB002-report.json`, `/tmp/skc-CB002-report.html`, `/tmp/skc-CB002-verdict.md`
- Concurrent-safe: No; performance runs require isolated browser state
- Last validated: pending first manual run
