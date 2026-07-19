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
expected_intent: MICRO_INTERACTIONS
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/motion-strategy.md
  - assets/motion-pattern-cards.md
---

**Exact prompt**

```
Spec the upload flow for a file importer with pending, success, error, retry, cancel, and disabled states so the build team can implement it.
```

# MOTION-STRATEGY-003 | Async State-Machine Card

## Prompt

`Spec the upload flow for a file importer with pending, success, error, retry, cancel, and disabled states so the build team can implement it.`

## Expected Process

1. Run the restraint gate in `references/animation-decision-framework.md` first, then select the async state-machine card in `assets/motion-pattern-cards.md`.
2. Replace every blank cell, pulling timing and easing from `references/motion-strategy.md` rather than inventing numbers.
3. Model the branching async behavior before any animation handoff: states, events, transitions, guards, impossible states, entry actions, exit actions, and visible UI per state.
4. Tick the per-card checks and confirm no cell is left as a placeholder before handoff.

## Pass Criteria

- Names the owner, purpose, and complete async state set, including idle, pending, success, error, retrying, cancelled, and disabled where relevant.
- Lists events and transition paths so every event resolves from a source state to a target state.
- Defines guards, impossible states, entry actions, and exit actions, including control disabling, announcements, focus movement, timer cleanup, input preservation, and loop shutdown where relevant.
- Specifies visible UI per state: copy, control state, affordance, and feedback location.
- Cites timing and easing from `motion-strategy.md`, defines the reduced-motion equivalent, and leaves no blank cell.
