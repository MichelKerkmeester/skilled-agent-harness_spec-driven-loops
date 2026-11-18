---
title: "convergence.cjs"
description: "Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace."
trigger_phrases:
  - "convergence.cjs"
  - "deep_loop_graph_convergence"
  - "check convergence decision"
  - "stop allowed stop blocked"
  - "graph-aware loop convergence"
version: 1.4.2.0
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

When the registry carries `frontier.nodes`, the research facts gain `frontierOpen`, the count of `open` or `active` nodes. The review facts gain `frontierOpen`, `frontierTotal` and `frontierAnswered`.

### Review frontier_drained Candidate

An expansive review forms the hard stop candidate `frontier_drained` when its frontier holds at least one node, none is open or active, and at least one is answered. It is the last check in the review candidate chain, after `all_dimensions_clean` and `composite_converged`. A frontier that closed with nothing answered forms no candidate. Every other legal-stop gate still applies, so a failed gate still turns it into BLOCKED.

### Minimum Iterations Floor

Once a stop candidate exists, a run below a `minIterations` above 1 returns CONTINUE with `reasonDetail` `minIterationsNotReached`. A floor of 0 or 1 does nothing. The floor now applies to review as well as research. It reads `config.minIterations`, then `antiConvergence.minIterations`, and is capped at `maxIterations`.

### frontierOpen Veto

Under `depthMode: 'expansive'`, a stop candidate becomes CONTINUE with `reasonDetail` `frontierOpen` while `frontierOpen` is above 0. A research run vetoes only a soft candidate. A review run vetoes any candidate, because a review clean candidate is a hard stop. The veto never creates a stop. The cap, consecutive failures, stuck recovery, `--convergence-mode=off`, the max-iterations policy and the minimum iterations floor all decide before it.

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

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/convergence-script.md`
- Primary sources: `scripts/convergence.cjs`, `tests/integration/convergence-script.vitest.ts`
Related references:
- [upsert-script.md](../../feature-catalog/script-entry-points/upsert-script.md) — upsert.cjs
