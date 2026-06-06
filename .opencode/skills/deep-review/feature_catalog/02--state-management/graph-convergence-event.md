---
title: "Graph convergence event"
description: "First-class deep-review-state.jsonl event that records the graph-assisted STOP decision (STOP_ALLOWED / STOP_BLOCKED / CONTINUE) and the signals behind it before the inline vote can finalize STOP."
trigger_phrases:
  - "graph convergence event"
  - "graph_convergence"
  - "STOP_ALLOWED STOP_BLOCKED"
  - "graph-assisted stop decision"
  - "combined-stop rule"
---

# Graph convergence event

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Records the graph-assisted convergence verdict for a review lineage as a persisted event, so the final STOP decision combines the inline 3-signal vote with an independent graph-derived decision.

The graph convergence event is the gate between "convergence math says STOP" and "the loop actually stops". It carries a typed decision enum and the signal snapshot that produced it, which makes the combined-stop rule auditable and replayable from state alone.

## 2. HOW IT WORKS

Before the inline 3-signal review vote is allowed to finalize STOP, the workflow appends a `graph_convergence` event for the current review lineage. The event carries a `decision` enum (`STOP_ALLOWED`, `STOP_BLOCKED`, or `CONTINUE`), a `signals` object (dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation), a `blockers` array, and the standard run/timestamp/session/generation lineage fields.

The combined-stop rule is strict: final STOP is legal only when the inline review convergence decision says STOP and the latest `graph_convergence.decision == "STOP_ALLOWED"`. A latest decision of `STOP_BLOCKED` sets `stop_blocked=true`, emits a `blocked_stop` event, and continues recovery. A latest decision of `CONTINUE` downgrades the inline STOP candidate to CONTINUE. The reducer rolls these events up into the findings-registry graph-convergence history.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state/state_format.md` | Schema | Graph Convergence Event schema, decision enum, and combined-stop rule. |
| `references/convergence/convergence.md` | Protocol | How the graph decision interacts with the inline vote and the legal-stop bundle. |
| `scripts/reduce-state.cjs` | Reducer | `buildGraphConvergenceRollup` and `computeGraphConvergenceScore` roll events into registry history. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/graph-convergence-review.md` | Manual scenario | Verifies the graph convergence event gates the STOP decision. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/graph-events-review.md` | Manual scenario | Verifies graph events are emitted and consumed for review-aware coverage. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/graph-convergence-event.md`
- Primary sources: `references/state/state_format.md`, `references/convergence/convergence.md`, `scripts/reduce-state.cjs`
Related references:
- [dashboard.md](dashboard.md) — Dashboard
- [pause-sentinel.md](pause-sentinel.md) — Pause sentinel
