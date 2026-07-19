---
title: "MR-001: Motion.dev API Smoke"
description: "Verify a sandboxed Webflow-style page can load Motion via a pinned CDN module and smoke-test animate(), inView(), and spring() without console errors."
version: 3.5.0.3
---

# MR-001: Motion.dev API Smoke

## 1. OVERVIEW

This scenario verifies the smallest useful motion.dev integration contract for sk-code Webflow work: a sandboxed page loads Motion from a pinned CDN URL, exposes the expected APIs, runs a basic `animate()` call, observes an `inView()` callback, and imports `spring()` without throwing.

The scenario uses official Motion docs as API references:
- `https://motion.dev/docs/quick-start`
- `https://motion.dev/docs/animate`
- `https://motion.dev/docs/inview`
- `https://motion.dev/docs/spring`

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MR-001` and confirm the expected signals without contradictory browser evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `MR-001` | Motion.dev API Smoke | Prove pinned CDN Motion exports and basic runtime calls work in a Webflow-style sandbox | `Create a Webflow-style Motion smoke page using pinned CDN animate, inView, and spring exports; return PASS/FAIL with console evidence.` | create `/tmp/skc-MR001-motion-smoke.html` -> open in Chrome -> inspect console -> click/run visible target -> save transcript | pinned `motion@<version>` URL; `typeof animate`, `typeof inView`, `typeof spring` are `function`; `animate()` resolves or completes; no uncaught console errors | `/tmp/skc-MR001-console.txt`, screenshot of animated element, smoke HTML path | PASS iff all exports are functions, `animate()` completes without throwing, `inView()` fires when target enters viewport, and console has no uncaught errors | If import fails, verify CDN URL and network; if export missing, compare with official Motion docs; if callback fails, verify element visibility and IntersectionObserver support |

## 3. TEST EXECUTION

### Prompt

```text
Create a Webflow-style Motion smoke page using pinned CDN animate, inView, and spring exports; return PASS/FAIL with console evidence.
```

### Commands

1. Create `/tmp/skc-MR001-motion-smoke.html` with a minimal page that imports from `https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm`.
2. In that page, run:
   ```js
   import { animate, inView, spring } from "https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm";
   console.log("MR-001 exports", typeof animate, typeof inView, typeof spring);
   const controls = animate("#mr-box", { opacity: [0.2, 1], transform: ["translateX(0px)", "translateX(24px)"] }, { duration: 0.2 });
   if (controls?.finished) controls.finished.then(() => console.log("MR-001 animate complete"));
   inView("#mr-box", () => console.log("MR-001 inView fired"));
   console.log("MR-001 spring", typeof spring);
   ```
3. Open the file in Chrome with DevTools Console visible.
4. Save the console output to `/tmp/skc-MR001-console.txt`.

### Expected

- Console includes `MR-001 exports function function function`.
- Console includes `MR-001 animate complete` or equivalent animation-completion evidence.
- Console includes `MR-001 inView fired`.
- No uncaught `TypeError`, module import error, CSP error, or network error appears.

### Evidence

- `/tmp/skc-MR001-console.txt`
- Screenshot or short recording showing the box moved and opacity changed.
- The exact CDN URL used in the sandbox file.

### Pass / Fail

- **Pass**: all expected signals appear and no uncaught console errors are present.
- **Fail**: any expected export is missing, `animate()` throws, `inView()` never fires after the element is visible, or the CDN import uses `@latest`.

### Failure Triage

1. If imports fail, verify the browser can reach `https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm`.
2. If `spring` is missing, compare the pinned version against `https://motion.dev/docs/spring`.
3. If `inView()` does not fire, confirm the target selector exists and is in the viewport.
4. If the animation throws, reduce the target to only `opacity` and `transform` and retry.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/quick-start.md` | Local Motion install and import-mode reference |
| `../../code-webflow/references/animation/animate-and-timelines.md` | Local `animate()` and sequence guidance |
| `../../code-webflow/references/animation/scroll-and-gestures.md` | Local `inView()` and viewport trigger guidance |
| `https://motion.dev/docs/quick-start` | Official install and first-animation reference |
| `https://motion.dev/docs/animate` | Official `animate()` reference |
| `https://motion.dev/docs/inview` | Official `inView()` reference |
| `https://motion.dev/docs/spring` | Official `spring()` reference |

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | In-repo pinned ESM import pattern |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | In-repo `window.Motion` runtime availability pattern |

---

## 5. SOURCE METADATA

- Group: Motion.dev And Animation Regression
- Playbook ID: MR-001
- Critical path: Yes
- Destructive: No
- Sandbox: `/tmp/skc-MR001-motion-smoke.html`
- Concurrent-safe: Yes
- Last validated: pending first manual run
