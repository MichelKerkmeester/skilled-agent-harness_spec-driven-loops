---
title: Purposeful Motion Plan Scenario
description: Manual scenario verifying that motion is planned around purpose, timing, easing, and one focal choreography.
trigger_phrases:
  - "test motion strategy"
  - "purposeful motion scenario"
  - "animation plan test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_STRATEGY
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/motion-strategy.md
  - ../shared/sk-code-handoff.md
---

# MOTION-STRATEGY-001 | Purposeful Motion Plan

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-STRATEGY-001`.

**Exact prompt**

```text
Design the motion for a product landing hero and pricing cards; make it feel premium without animating everything.
```

---

## 1. OVERVIEW

This scenario validates that motion is planned around purpose, timing, and easing with exactly one focal choreography, in `interface`'s temporal/motion task lane. It confirms restraint is the default and that a reduced-motion path is planned rather than retrofitted.

### Why This Matters

"Premium" motion fails when every element animates: scroll reveals scatter attention, timing drifts off the reference bands, and keyboard-driven paths become slower than the static version. Naming one focal choreography and a purpose per element is what keeps motion legible.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a landing-page motion request resolves in the motion lane with a named purpose per animated element, reference-sourced timing and easing, one focal choreography, and an explicit reduced-motion path.
- Real user request: `We want the motion on our landing hero and pricing cards to feel premium, but not have everything moving at once.`
- Prompt: `Design the motion for a product landing hero and pricing cards; make it feel premium without animating everything.`
- Expected execution process: Route to `interface` (the temporal/motion task lane); load `../../references/motion/motion-strategy.md`; pick one focal choreography and local feedback only where it clarifies state.
- Expected signals: Each animated element carries a named purpose; duration and easing tokens map to the reference timing bands and easing curves; exactly one focal choreography is nominated; a global reduced-motion override and explicit no-motion cases are named; gesture-driven interactions carry a non-gesture alternative.
- Desired user-visible outcome: A motion plan that reads as deliberate and premium because a few things move with purpose, with an accessible path for users who reduce motion.
- Pass/fail: PASS if every animated element has a named purpose, timing and easing come from the reference, one focal choreography is chosen, and reduced-motion behavior is explicit; FAIL if motion is scattershot, timing or easing values are invented, reduced-motion is omitted, or a gesture-driven interaction has no accessible alternative.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Route to `interface` (the temporal/motion task lane).
2. Load `references/motion/motion-strategy.md`.
3. Pick one focal choreography and local feedback only where it clarifies state.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-STRATEGY-001 | Purposeful motion plan | Confirm one focal choreography, a named purpose per element, reference-sourced timing, and an explicit reduced-motion path | `Design the motion for a product landing hero and pricing cards; make it feel premium without animating everything.` | bash: rg -n "easing" ../../references/motion/motion-strategy.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the motion plan | Step 1: timing bands and easing curves found; Step 2: register motion-budget dial found; Step 3: output names one focal choreography, a purpose per element, and the reduced-motion override | Terminal transcript, the produced motion plan, the per-element purpose list, the timing/easing mapping, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically scattershot scroll reveals or a missing reduced-motion path | 1. Re-read `../../references/motion/motion-strategy.md` timing bands and confirm each named duration maps to one; 2. Confirm exactly one focal choreography was nominated; 3. Re-run with reduced motion enabled and confirm the plan still communicates state |

### Pass Criteria

- Names motion purpose for each animated element.
- Uses timing and easing from the reference.
- Verifies named duration and easing tokens map to the reference timing bands and easing curves.
- Includes a global reduced-motion override and names explicit no-motion cases for high-frequency keyboard paths, repeated list/table operations, dense admin surfaces, and interactions where movement delays comprehension.
- Provides a non-gesture accessible alternative for every gesture-driven interaction.
- Avoids scattershot scroll reveals.
- Includes reduced-motion fallback.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/motion-strategy.md` | Timing bands, easing curves, and choreography rules |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |
| `../../../shared/sk-code-handoff.md` | Handoff contract for the implementation pass |

---

## 5. SOURCE METADATA

- Group: Strategy
- Playbook ID: MOTION-STRATEGY-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `strategy/purposeful-motion-plan.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
