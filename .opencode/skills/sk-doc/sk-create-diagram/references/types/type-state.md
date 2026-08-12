---
title: "State Machine"
description: "Layout conventions for finite state logic — rounded state rects, start/end dots, labeled transition arrows, self-loops, and single focal state accent."
trigger_phrases:
  - "state machine diagram"
  - "finite state logic"
  - "state transition diagram"
  - "order status flow"
  - "state machine layout"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# State Machine

**Best for:** finite state logic — order status, auth state, connection lifecycle, form wizard, job queue status.

## 1. Layout conventions
- States are rounded rectangles (`rx=8`), labeled in Geist.
- **Start**: filled ink dot (`r=6`). **End**: ringed dot (outer `r=8` outline, inner filled `r=5`).
- Transitions: curved arrows labeled in Geist Mono as `event [guard] / action` (omit sections you don't need).
- Self-loops curve above the state.
- Orient along the dominant flow direction (left→right or top→down); rearrange before crossing transitions.
- Coral on the state the reader should notice — typically the error state, or "happy completion".

## 2. Anti-patterns
- More transitions than states × 2 → likely two state machines.
- "From any state" transitions drawn from every state — use a single annotation (`* → Error on timeout`) instead.
- Unlabeled transitions (the whole point is *what triggers this*).

## 3. Examples
- `assets/examples/example-state.html` — minimal light
- `assets/examples/example-state-dark.html` — minimal dark
- `assets/examples/example-state-full.html` — full editorial
