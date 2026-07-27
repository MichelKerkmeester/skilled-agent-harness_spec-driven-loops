---
title: Motion Performance Failure Card Scenario
description: Manual scenario verifying the build-side failure card catches layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects and blur.
trigger_phrases:
  - "test motion performance card"
  - "animation jank card scenario"
  - "dropped frames pre-handoff test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_STRATEGY
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/motion-strategy.md
  - ../shared/sk-code-handoff.md
  - references/motion/performance-reduced-motion.md
  - assets/motion/motion-performance-failure-card.md
---

# MOTION-REDUCED-002 | Motion Performance Failure Card

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-REDUCED-002`.

**Exact prompt**

```text
Pre-flight this scroll-driven parallax header and a drag-to-reorder list for frame drops before handoff.
```

---

## 1. OVERVIEW

This scenario validates the build-side motion performance failure card read against a real build: layout thrash, scroll polling, endless `requestAnimationFrame`, mixed animation systems, layer promotion, paint-heavy effects, and blur.

### Why This Matters

Scroll-driven parallax and drag-to-reorder are the two patterns most likely to ship at 30fps on a mid-tier phone. Walking the failure signatures before handoff catches the cheap structural fixes — Scroll Timeline instead of `scrollY` polling, FLIP instead of continuous layout — while they are still cheap.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a pre-handoff performance pass reads each failure signature against the build, applies the cheaper mechanism where a failure mode is present, and clears the pre-handoff checks.
- Real user request: `Before this goes to the build team, can you check our parallax header and drag-to-reorder list for frame drops?`
- Prompt: `Pre-flight this scroll-driven parallax header and a drag-to-reorder list for frame drops before handoff.`
- Expected execution process: Load `../../assets/motion/motion-performance-failure-card.md` and read each failure signature against the build; walk the rendering cost floor, keeping motion on transform and opacity unless a stated constraint forces paint or layout; apply the cheaper mechanism where a failure mode is present, then clear the pre-handoff check boxes.
- Expected signals: Scroll-event-driven motion is replaced with a Scroll or View Timeline or `IntersectionObserver`; layout thrash and continuous `width`/`height`/`top`/`left` animation are caught and swapped for transform or FLIP; blur is bounded at or below `8px`; one animation system per surface is confirmed; every `requestAnimationFrame` loop has a stop condition; the lowest target device is checked.
- Desired user-visible outcome: A build that holds frame rate on the lowest target device, with each failure mode either absent or explicitly remediated before handoff.
- Pass/fail: PASS if every failure signature is read against the build and each present failure mode is remediated with the cheaper mechanism; FAIL if `scrollY` is still read per tick, continuous layout animation remains, blur exceeds the bound, animation systems are mixed on one surface, or a `requestAnimationFrame` loop has no stop condition.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `assets/motion/motion-performance-failure-card.md` and read each failure signature against the build.
2. Walk the rendering cost floor, keeping motion on transform and opacity unless a stated constraint forces paint or layout.
3. Apply the cheaper mechanism where a failure mode is present, then clear the pre-handoff check boxes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-REDUCED-002 | Motion performance failure card | Confirm each failure signature is read against the build and remediated with the cheaper mechanism before handoff | `Pre-flight this scroll-driven parallax header and a drag-to-reorder list for frame drops before handoff.` | bash: rg -n "blur" ../../assets/motion/motion-performance-failure-card.md -> bash: rg -n "reduced motion" ../../references/motion/performance-reduced-motion.md -> agent: pre-flight the parallax header and drag-to-reorder list | Step 1: failure signatures found; Step 2: rendering cost floor found; Step 3: each present failure mode is named and remediated, and the pre-handoff boxes are cleared | Terminal transcript, the failure-card walk, the per-signature verdict, the applied remediations, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically per-tick `scrollY` reads or an unbounded `requestAnimationFrame` loop | 1. Re-read `../../assets/motion/motion-performance-failure-card.md` and confirm every signature was checked; 2. Confirm blur is at or below `8px`; 3. Re-run the drag path on the lowest target device and confirm frame rate holds |

### Pass Criteria

- Replaces scroll-event-driven motion with a Scroll or View Timeline or `IntersectionObserver`, rather than reading `scrollY` per tick.
- Catches layout thrash and any continuous `width`, `height`, `top` or `left` animation, swapping it for transform or FLIP.
- Bounds blur at or below `8px` and keeps paint-heavy effects small, isolated and short-lived.
- Confirms one animation system per surface, a stop condition for every `requestAnimationFrame` loop and a check on the lowest target device.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../assets/motion/motion-performance-failure-card.md` | Build-side failure signatures and pre-handoff check boxes |
| `../../references/motion/performance-reduced-motion.md` | Rendering cost floor and property guidance |
| `../../references/motion/motion-strategy.md` | Timing bands and easing curves |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |
| `../../../shared/sk-code-handoff.md` | Handoff contract cleared before implementation |

---

## 5. SOURCE METADATA

- Group: Reduced Motion
- Playbook ID: MOTION-REDUCED-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `reduced-motion/motion-performance-failure-card.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
