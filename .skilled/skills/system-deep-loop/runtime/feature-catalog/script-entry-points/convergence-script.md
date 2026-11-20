---
title: "convergence.cjs"
description: "Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace."
trigger_phrases:
  - "convergence.cjs"
  - "deep_loop_graph_convergence"
  - "check convergence decision"
  - "stop allowed stop blocked"
  - "graph-aware loop convergence"
version: 1.4.7.0
---

# convergence.cjs

---

## 1. OVERVIEW

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

This feature belongs to the script entry points group and is catalogued as F014 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings.

### Depth Mode

`stopDecisionConfig` reads `depthMode` from the `--depth-mode` (or `--depth_mode`) flag first, then from `antiConvergence.depthMode` in the config. It adds `depthMode: 'expansive'` to the stop-decision config only when the value is `expansive`, so a default run echoes the same config it did before.

### Frontier Facts

When the registry carries `frontier.nodes`, the research and review facts gain `frontierOpen`, the count of `open` or `active` nodes, `frontierTotal` and `frontierAnswered`. The research facts also gain `fanoutLineage: true` when the config carries `fanout_lineage_artifact_dir`, which only the fan-out runner writes.

Under expansive depth with a non-empty `registry.frontier.activeNodeId`, the stuck count passed to the decision counts only that node's passes, for research and review alike.

### Review frontier_drained Candidate

An expansive review forms the hard stop candidate `frontier_drained` when its frontier holds at least one node, none is open or active, and at least one is answered. It is the last check in the review candidate chain, after `all_dimensions_clean` and `composite_converged`. A frontier that closed with nothing answered forms no candidate. Every other legal-stop gate still applies, so a failed gate still turns it into BLOCKED.

### Research frontier_drained Candidate

An expansive research fan-out lineage (`fanoutLineage`) forms the same hard candidate `frontier_drained` when its frontier share holds at least one node, none is open or active, and at least one is answered. It comes after `all_questions_answered` and `composite_converged`. A single-executor expansive run and a default run never form it. The `minIterations` floor still applies, a failed quality guard still turns it into CONTINUE, and the graph decision still settles it.

### Minimum Iterations Floor

Once a stop candidate exists, a run below a `minIterations` above 1 returns CONTINUE with `reasonDetail` `minIterationsNotReached`. A floor of 0 or 1 does nothing. The floor applies to review as well as research. It reads `config.minIterations`, then `antiConvergence.minIterations`, and is capped at `maxIterations`.

### frontierOpen Veto

Under `depthMode: 'expansive'`, a stop candidate becomes CONTINUE with `reasonDetail` `frontierOpen` while `frontierOpen` is above 0. A research run vetoes only a soft candidate. A review run vetoes any candidate, because a review clean candidate is a hard stop. The veto never creates a stop. The cap, consecutive failures, stuck recovery, convergence mode `off` (`--convergence-mode off` or `antiConvergence.convergenceMode`), the max-iterations policy and the minimum iterations floor all decide before it.

### Source Diversity on an Empty Graph

The research quality guard `sourceDiversity` reports `insufficient` with `passed: false` when the graph reads cleanly but holds no answered QUESTION node. `notEvaluated` is kept for a graph read that failed. Only a guard whose status is `failed` blocks a stop, so `insufficient` changes no stop decision; the guard just no longer reads as a pass on evidence it never saw.

### Recording a Blocked Stop

`--record-blocked-stop` makes the command record a blocked research or review stop itself, so a leaf that reads a BLOCKED decision and skips the recording step still leaves a state row. It needs `--stop-decision` and `--iteration` as a positive integer, and it is refused with `--read-only`; each refusal is an input error. When the decision is BLOCKED, the command appends the record through `append-mode-event.cjs`, whether the graph has nodes, is empty or cannot be read. For research it builds the `blocked_stop` event row the research workflow sends, and the row's `recoveryStrategy` names, when it applies, the iterations that recorded findings but left no FINDING node in the graph, the usual sign of a graph upsert that never ran. For review it builds the `deep_review.blocked_stop_recorded` event: scope from the config `sessionId` and `generation`, one gate row per legal-stop gate plus one fail row per graph blocker, finding counts from the registry, `recoveryStrategy` as the first blocked gate in kebab form, and `targetDimensionId` as the dimension the next iteration is steered to, or `all-dimensions-covered` when none is left. The payload gains `blocked_stop_record` with `status` `recorded` (plus `eventId` when the gateway returns a receipt), `already_recorded` when the state log already holds a row for this run with the same blocker set, or `failed` with the gateway's `exitCode` and `reason`; a review record also carries `recoveryHint` and `gateResults`. A changed blocker set is a new attempt and gets its own row. A failed record exits with the gateway's code, after the decision is printed.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/convergence.cjs` | Runtime | Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings. `buildStopDecision` holds the `frontier_drained` candidate, the `minIterationsNotReached` floor and the `frontierOpen` veto; `stopDecisionConfig` reads `depthMode`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/convergence-script.vitest.ts` | Automated test | Primary regression coverage for convergence.cjs. |
| `tests/integration/review-depth-convergence.vitest.ts` | Integration | Review convergence fixture coverage. |
| `tests/integration/convergence-blocked-stop.vitest.ts` | Integration | `--record-blocked-stop`: one row per run and blocker set, a new row for a changed blocker set, a failed command when the gateway refuses, nothing without the flag, the `--read-only` refusal, and the iterations named for a missing graph upsert. |
| `tests/integration/convergence-review-blocked-stop.vitest.ts` | Integration | `--record-blocked-stop` for review: one `deep_review.blocked_stop_recorded` event the gateway accepts, no second event for the same run, a block only the graph raises with a fail row for its blocker, a block on an unreadable graph, nothing without the flag, and the target dimension order. |
| `tests/unit/stop-decision.vitest.ts` | Automated test | Source diversity reported as `insufficient` on a graph with no answered question, without blocking the stop. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/convergence-script.md`
- Primary sources: `scripts/convergence.cjs`, `tests/integration/convergence-script.vitest.ts`
Related references:
- [upsert-script.md](../../feature-catalog/script-entry-points/upsert-script.md) — upsert.cjs
