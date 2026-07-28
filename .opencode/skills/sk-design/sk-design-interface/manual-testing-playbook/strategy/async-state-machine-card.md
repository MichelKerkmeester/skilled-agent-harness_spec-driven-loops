---
title: Async State-Machine Card Scenario
description: Manual scenario verifying branching async UI is modeled with the async state-machine card before handoff.
trigger_phrases:
  - "test async state-machine card"
  - "branching async motion scenario"
  - "async UI state card test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_MICRO_INTERACTIONS
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/motion-strategy.md
  - assets/motion/motion-pattern-cards.md
---

# MOTION-STRATEGY-003 | Async State-Machine Card

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-STRATEGY-003`.

**Exact prompt**

```text
Spec the upload flow for a file importer with pending, success, error, retry, cancel, and disabled states so the build team can implement it.
```

---

## 1. OVERVIEW

This scenario validates that branching async UI is modeled with the async state-machine card before any animation is specified. It confirms states, events, transitions, guards, impossible states, and entry/exit actions are all resolved ahead of handoff.

### Why This Matters

Branching async flows fail on the states nobody modeled: a retry that fires while a cancel is in flight, a disabled control that never re-enables, a timer that outlives its component. Modeling the state fragment first is what turns an upload flow into something implementable rather than a set of animations over undefined behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a branching async request runs the restraint gate, selects the async state-machine card, and returns a complete state model with guards, entry/exit actions, and per-state visible UI before any animation handoff.
- Real user request: `Spec out our file importer upload flow — it needs to handle pending, success, errors, retries, cancelling, and being disabled.`
- Prompt: `Spec the upload flow for a file importer with pending, success, error, retry, cancel, and disabled states so the build team can implement it.`
- Expected execution process: Run the restraint gate in `../../references/motion/animation-decision-framework.md` first, then select the async state-machine card in `../../assets/motion/motion-pattern-cards.md`; replace every blank cell, pulling timing and easing from `../../references/motion/motion-strategy.md` rather than inventing numbers; model the branching async behavior before any animation handoff — states, events, transitions, guards, impossible states, entry actions, exit actions, and visible UI per state; tick the per-card checks and confirm no cell is left as a placeholder before handoff.
- Expected signals: The complete async state set is named; every event resolves from a source state to a target state; guards, impossible states, and entry/exit actions are defined; visible UI is specified per state; timing and easing cite `motion-strategy.md`; no cell remains blank.
- Desired user-visible outcome: A complete upload-flow state model the build team can implement directly, with the animation layer sitting on top of defined behavior.
- Pass/fail: PASS if the full async state set, transitions, guards, entry/exit actions, and per-state UI are modeled with cited timing and no blank cells; FAIL if any state or transition is unmodeled, guards and impossible states are omitted, timing is invented in the card, or a cell is left as a placeholder.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the restraint gate in `references/motion/animation-decision-framework.md` first, then select the async state-machine card in `assets/motion/motion-pattern-cards.md`.
2. Replace every blank cell, pulling timing and easing from `references/motion/motion-strategy.md` rather than inventing numbers.
3. Model the branching async behavior before any animation handoff: states, events, transitions, guards, impossible states, entry actions, exit actions, and visible UI per state.
4. Tick the per-card checks and confirm no cell is left as a placeholder before handoff.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-STRATEGY-003 | Async state-machine card | Confirm the branching async behavior is fully modeled with guards and per-state UI before any animation handoff | `Spec the upload flow for a file importer with pending, success, error, retry, cancel, and disabled states so the build team can implement it.` | bash: rg -n "frequency" ../../references/motion/animation-decision-framework.md -> bash: rg -n "ASYNC STATE-MACHINE" ../../assets/motion/motion-pattern-cards.md -> bash: rg -n "easing" ../../references/motion/motion-strategy.md -> agent: fill the async state-machine card | Step 1: restraint gate found and run; Step 2: async state-machine card found; Step 3: timing bands and easing curves found; Step 4: card returned with the full state set, transitions, guards, and per-state UI | Terminal transcript, the filled async state-machine card, the state and transition list, the guard set, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically an unresolved event, a missing guard, or a blank cell | 1. Re-read `../../assets/motion/motion-pattern-cards.md` section 12 and confirm every cell is filled; 2. Walk each event and confirm it resolves source to target; 3. Re-run listing impossible states and confirm each is explicitly excluded |

### Pass Criteria

- Names the owner, purpose, and complete async state set, including idle, pending, success, error, retrying, cancelled, and disabled where relevant.
- Lists events and transition paths so every event resolves from a source state to a target state.
- Defines guards, impossible states, entry actions, and exit actions, including control disabling, announcements, focus movement, timer cleanup, input preservation, and loop shutdown where relevant.
- Specifies visible UI per state: copy, control state, affordance, and feedback location.
- Cites timing and easing from `motion-strategy.md`, defines the reduced-motion equivalent, and leaves no blank cell.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../assets/motion/motion-pattern-cards.md` | Fill-in pattern cards including the async state-machine card |
| `../../references/motion/motion-strategy.md` | Timing bands and easing curves cited by the card |
| `../../references/motion/animation-decision-framework.md` | Restraint gate run before card selection |
| `../../../shared/register.md` | Register posture that sets the motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Strategy
- Playbook ID: MOTION-STRATEGY-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `strategy/async-state-machine-card.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
