---
title: Motion Pattern Card Scenario
description: Manual scenario verifying a filled pattern card names owner, single purpose, states and reduced-motion path before handoff.
trigger_phrases:
  - "test motion pattern card"
  - "motion spec card scenario"
  - "interaction card fill-in test"
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

# MOTION-STRATEGY-002 | Motion Pattern Card

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-STRATEGY-002`.

**Exact prompt**

```text
Spec a toast notification and a settings drawer toggle so I can hand them to the build team.
```

---

## 1. OVERVIEW

This scenario validates the fill-in motion pattern card: a filled card must name the owner, exactly one purpose, the full state path, and a reduced-motion equivalent before it is handed to `sk-code`. The restraint gate runs before any card is selected.

### Why This Matters

A pattern card with blank cells pushes timing, easing, and reduced-motion decisions into implementation, where they get invented. Requiring the restraint gate first and every cell filled from the reference is what makes the card a buildable spec.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a component-spec request runs the restraint gate, selects the matching pattern cards, and returns them with every cell filled from the reference and a reduced-motion equivalent defined.
- Real user request: `I need specs for our toast notification and the settings drawer toggle so the build team can just implement them.`
- Prompt: `Spec a toast notification and a settings drawer toggle so I can hand them to the build team.`
- Expected execution process: Run the restraint gate in `../../references/motion/animation-decision-framework.md` first, then pick the matching cards in `../../assets/motion/motion-pattern-cards.md` (toast card, state transition card); replace every blank cell, pulling timing and easing from `../../references/motion/motion-strategy.md` rather than inventing numbers; tick the per-card checks and confirm no cell is left as a placeholder before handoff.
- Expected signals: The restraint gate runs before card selection; each card names one owner and exactly one purpose; the full state path is present; timing and easing cite `motion-strategy.md`; a reduced-motion equivalent is defined per card; no cell remains a placeholder.
- Desired user-visible outcome: Two completely filled pattern cards the build team can implement without re-deciding timing, easing, or reduced-motion behavior.
- Pass/fail: PASS if the restraint gate runs first and both cards are fully filled with cited timing, a single purpose, and a reduced-motion equivalent; FAIL if any cell is blank, timing or easing values are invented in the card, more than one purpose is claimed, or the reduced-motion equivalent is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the restraint gate in `references/motion/animation-decision-framework.md` first, then pick the matching cards in `assets/motion/motion-pattern-cards.md` (toast card, state transition card).
2. Replace every blank cell, pulling timing and easing from `references/motion/motion-strategy.md` rather than inventing numbers.
3. Tick the per-card checks and confirm no cell is left as a placeholder before handoff.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-STRATEGY-002 | Motion pattern card | Confirm the restraint gate runs first and both cards return fully filled with cited timing and a reduced-motion equivalent | `Spec a toast notification and a settings drawer toggle so I can hand them to the build team.` | bash: rg -n "frequency" ../../references/motion/animation-decision-framework.md -> bash: rg -n "toast" ../../assets/motion/motion-pattern-cards.md -> bash: rg -n "easing" ../../references/motion/motion-strategy.md -> agent: fill the toast and state transition cards | Step 1: restraint gate found and run; Step 2: toast and state transition cards found; Step 3: timing bands and easing curves found; Step 4: both cards returned with no placeholder cells | Terminal transcript, both filled pattern cards, the restraint-gate result, the timing citations, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically a blank cell or timing invented in the card | 1. Re-read `../../assets/motion/motion-pattern-cards.md` and confirm every cell of both cards is filled; 2. Cross-check each timing and easing value against `../../references/motion/motion-strategy.md`; 3. Re-run with reduced motion and confirm the state change still lands |

### Pass Criteria

- Names the owner, exactly one purpose and the full state path for each card.
- Cites timing and easing from `motion-strategy.md`, not new values invented in the card.
- Defines a reduced-motion equivalent that keeps the state change and removes movement (toast fades only, drawer swaps instantly).
- Leaves no blank cell, since a card with blanks is not ready to hand to `sk-code`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../assets/motion/motion-pattern-cards.md` | Fill-in pattern cards including the toast and state transition cards |
| `../../references/motion/micro-interactions.md` | Interaction state and feedback rules for the cards |
| `../../references/motion/motion-strategy.md` | Timing bands and easing curves cited by each card |
| `../../references/motion/animation-decision-framework.md` | Restraint gate run before card selection |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Strategy
- Playbook ID: MOTION-STRATEGY-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `strategy/motion-pattern-card.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
