---
title: "Relevance Gate"
description: "Blocks a STOP decision when relevanceFloor or agreementRate fall below their thresholds, forcing STOP_BLOCKED and injecting a recovery hint for the next iteration."
trigger_phrases:
  - "relevance gate"
  - "STOP_BLOCKED"
  - "blocked stop deep context"
  - "relevanceFloor threshold"
  - "blocked_stop event"
  - "convergence blocked"
---

# Relevance Gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Blocks a STOP decision when `relevanceFloor` or `agreementRate` fall below their thresholds, even if the host saturation check nominates STOP.

The relevance gate exists because coverage saturation alone is not enough to guarantee a useful Context Report. A loop that has swept many files but accumulated low-relevance or single-executor findings has not converged — it has stalled. The gate forces additional sweeps and a recovery focus until the quality thresholds are met.

---

## 2. HOW IT WORKS

### Host Saturation Check

`step_check_convergence` first computes the per-iteration saturation check: `new_ratio = new_agreement_eligible_count / max(1, merged_findings_count)`. When `new_ratio < convergenceThreshold` for K=2 consecutive iterations, `host_saturated = true`. This is the same low-progress-streak logic as `deep-research` and `deep-review`.

### Combined Stop Rule

A STOP is only accepted when `host_saturated AND graph_decision == "STOP_ALLOWED"`. When the graph returns `STOP_BLOCKED`:
- A typed `blocked_stop` event is appended to the JSONL log with the failing blocker names and the graph signals
- `step_emit_blocked_stop` injects a recovery hint as the next iteration's focus
- The decision is forced to `CONTINUE` with `reason: "blockedStop"`

### Default Blocker Conditions

| Blocker | Condition |
|---|---|
| `sliceCoverage < 0.70` | Not enough frontier slices have been swept |
| `relevanceFloor < 0.50` | Too many surviving findings have low relevance |
| `agreementRate < 0.50` | More than half of findings are single-executor only |

### Max-Iterations Override

When `iteration_count >= max_iterations`, the loop stops regardless of the graph decision. Blocked guards and their values are recorded in the JSONL log as evidence for synthesis rather than causing the loop to keep running past the cap.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Workflow | `step_check_convergence`, `step_emit_blocked_stop`, `step_handle_convergence` — combined stop rule and blocked_stop lifecycle |
| `.opencode/skills/deep-context/references/convergence/convergence_signals.md` | Reference | Full signal table, composite weights, and the stop contract with blocker thresholds |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `evaluateContext` that returns CONTINUE / STOP_ALLOWED / STOP_BLOCKED with blockers |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-context/manual_testing_playbook/04--convergence-detection/relevance-gate.md` | Manual playbook | Verifies blocked_stop event emission, recovery hint injection, and force-CONTINUE when graph blocks stop |

---

## 4. SOURCE METADATA

- Group: Convergence Detection
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--convergence-detection/relevance-gate.md`

Related references:
- [agreement-gate.md](agreement-gate.md) — The agreementRate blocking guard companion
- [evaluate-context.md](evaluate-context.md) — convergence.cjs that computes STOP_BLOCKED with blockers
