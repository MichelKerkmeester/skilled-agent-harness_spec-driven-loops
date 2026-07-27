---
title: Performance And Reduced Motion Scenario
description: Manual scenario verifying performance-safe property choice and reduced-motion alternatives.
trigger_phrases:
  - "test motion performance"
  - "test reduced motion"
  - "animation jank scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_PERFORMANCE
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/performance-reduced-motion.md
  - assets/motion/motion-performance-failure-card.md
---

# MOTION-REDUCED-001 | Performance And Reduced Motion

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-REDUCED-001`.

**Exact prompt**

```text
Plan a drawer animation with blur and layout change, but make sure it performs on mobile and respects reduced motion.
```

---

## 1. OVERVIEW

This scenario validates performance-safe property choice and reduced-motion alternatives for a drawer animation that involves blur and a layout change — the two most expensive things to animate.

### Why This Matters

Blur and layout animation are where mobile frame budgets die, and they are exactly what a "premium drawer" brief tends to ask for. Choosing transform/opacity or FLIP, bounding the paint-heavy effects, and defining the reduced-motion state is what makes the animation shippable on real devices.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a drawer animation involving blur and layout change is planned with performance-safe properties, bounded paint-heavy effects, and an explicit reduced-motion equivalent.
- Real user request: `We want a drawer that blurs the background and reflows the layout — but it has to be smooth on mobile and work with reduced motion on.`
- Prompt: `Plan a drawer animation with blur and layout change, but make sure it performs on mobile and respects reduced motion.`
- Expected execution process: Load `../../references/motion/performance-reduced-motion.md` and `../../references/motion/motion-strategy.md`; prefer transform/opacity or FLIP for layout-like motion; bound blur/filter use and define reduced-motion behavior.
- Expected signals: Continuous layout animation is avoided in favor of transform/opacity or FLIP; every paint-heavy effect is named and bounded; the reduced-motion path still delivers equivalent state feedback; mobile verification risk is called out explicitly.
- Desired user-visible outcome: A drawer animation plan that holds frame rate on mobile and degrades cleanly for users who reduce motion.
- Pass/fail: PASS if layout-like motion uses transform/opacity or FLIP, paint-heavy effects are named and bounded, reduced-motion feedback is equivalent, and mobile risk is stated; FAIL if continuous layout animation is planned, blur is unbounded, reduced motion drops state feedback, or mobile verification is not raised.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `references/motion/performance-reduced-motion.md` and `references/motion/motion-strategy.md`.
2. Prefer transform/opacity or FLIP for layout-like motion.
3. Bound blur/filter use and define reduced-motion behavior.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-REDUCED-001 | Performance and reduced motion | Confirm layout-like motion uses transform/opacity or FLIP, paint-heavy effects are bounded, and reduced motion keeps state feedback | `Plan a drawer animation with blur and layout change, but make sure it performs on mobile and respects reduced motion.` | bash: rg -n "reduced motion" ../../references/motion/performance-reduced-motion.md -> bash: rg -n "easing" ../../references/motion/motion-strategy.md -> agent: produce the drawer animation plan | Step 1: performance and reduced-motion rules found; Step 2: timing bands found; Step 3: plan uses transform/opacity or FLIP, bounds the blur, and defines the reduced-motion state | Terminal transcript, the drawer animation plan, the named paint-heavy effects with bounds, the reduced-motion path, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically continuous layout animation or unbounded blur | 1. Re-read `../../references/motion/performance-reduced-motion.md` for the property cost floor; 2. Confirm no continuous `width`/`height`/`top`/`left` animation remains; 3. Re-run with reduced motion enabled and confirm state feedback is still delivered |

### Pass Criteria

- Avoids continuous layout animation.
- Names any paint-heavy effect and bounds it.
- Includes reduced-motion equivalent state feedback.
- Calls out mobile verification risk.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/performance-reduced-motion.md` | Property cost floor and reduced-motion rules |
| `../../assets/motion/motion-performance-failure-card.md` | Build-side failure signatures for the same surface |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Reduced Motion
- Playbook ID: MOTION-REDUCED-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `reduced-motion/performance-and-reduced-motion.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
