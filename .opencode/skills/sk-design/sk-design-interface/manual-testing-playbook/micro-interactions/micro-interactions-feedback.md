---
title: Micro-Interactions Feedback Scenario
description: Manual scenario verifying press feedback, required active state, morphing-icon rules, and delight boundaries.
trigger_phrases:
  - "test micro-interactions"
  - "test interaction feedback"
  - "press state scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_MICRO_INTERACTIONS
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/micro-interactions.md
  - assets/motion/motion-pattern-cards.md
---

# MOTION-MICRO-001 | Micro-Interactions Feedback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-MICRO-001`.

**Exact prompt**

```text
Specify the hover, active, and loading feedback for a primary button and a menu-to-close morphing icon, with earned delight on success.
```

---

## 1. OVERVIEW

This scenario validates interaction-state feedback: a required active/pressed state on every interactive control, correct press-scale bounds, the morphing-icon rules, and the boundaries that keep delight earned rather than decorative.

### Why This Matters

The active state is the one most often skipped, and its absence makes a control feel broken on touch. Press scale that goes too far reads as a bug; delight that fires outside the success, first-time, or recovery moments reads as noise.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a feedback-specification request defines every interaction state, requires an active/pressed state, applies the correct press-scale and morphing-icon rules, and keeps delight within its boundaries.
- Real user request: `Spec the hover, pressed, and loading feedback for our primary button and the menu icon that morphs into a close icon — plus something nice when it succeeds.`
- Prompt: `Specify the hover, active, and loading feedback for a primary button and a menu-to-close morphing icon, with earned delight on success.`
- Expected execution process: Load `../../references/motion/micro-interactions.md`; define each state and confirm an active/pressed state exists for every interactive control; set press-scale and morphing-icon behavior from the reference, with reduced-motion fallbacks.
- Expected signals: An active/pressed state is present on every interactive control; press scale sits in `0.95-1.0`; the `1.05` lift stays a hover affordance rather than a press; the morphing icon follows the three-line, shared-`viewBox`, `strokeLinecap="round"` rules; delight stays within the success, first-time, and recovery boundaries.
- Desired user-visible outcome: Controls that feel responsive and correct under touch and pointer, with a success moment that feels earned rather than noisy.
- Pass/fail: PASS if every control has an active state with press scale in range, the morphing-icon rules are applied, and delight stays within its boundaries; FAIL if an active state is missing, press scale drops below `0.95`, the `1.05` lift is used as a press, or delight is blocking or fires outside its boundaries.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `references/motion/micro-interactions.md`.
2. Define each state and confirm an active/pressed state exists for every interactive control.
3. Set press-scale and morphing-icon behavior from the reference, with reduced-motion fallbacks.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-MICRO-001 | Micro-interactions feedback | Confirm every control has an active state with in-range press scale, correct morphing-icon rules, and bounded delight | `Specify the hover, active, and loading feedback for a primary button and a menu-to-close morphing icon, with earned delight on success.` | bash: rg -n "press" ../../references/motion/micro-interactions.md -> bash: rg -n "toast" ../../assets/motion/motion-pattern-cards.md -> agent: specify the button and morphing-icon feedback | Step 1: press-scale and state rules found; Step 2: pattern cards found; Step 3: output defines every state, requires the active state, and bounds the delight moment | Terminal transcript, the interaction-state specification, the press-scale values, the morphing-icon rules, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically a missing active state or a press scale below `0.95` | 1. Re-read `../../references/motion/micro-interactions.md` for the press-scale band; 2. Confirm the `1.05` lift is bound to hover, not press; 3. Re-run with reduced motion and confirm each state is still distinguishable |

### Pass Criteria

- Requires an active/pressed state, with press scale in `0.95-1.0` (commonly `0.96`) and never below `0.95`.
- Keeps the `1.05` lift as a hover affordance, not a press.
- Applies the three-line, shared-`viewBox`, `strokeLinecap="round"` morphing-icon rules.
- Keeps delight brief, contextual, non-blocking, and within the success/first-time/recovery boundaries.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/micro-interactions.md` | Interaction states, press scale, morphing icons, and delight boundaries |
| `../../assets/motion/motion-pattern-cards.md` | Fill-in pattern cards for the specified interactions |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Micro-Interactions
- Playbook ID: MOTION-MICRO-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `micro-interactions/micro-interactions-feedback.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
