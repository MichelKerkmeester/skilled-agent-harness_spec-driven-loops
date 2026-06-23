---
title: "Deep Context: Convergence Recovery"
description: How the loop recovers from a blocked stop or a stuck state — targeting the failing gate and widening the frontier.
trigger_phrases:
  - "blocked stop recovery"
  - "stuck sweep recovery"
  - "failing guard recovery focus"
  - "widen the frontier"
  - "terminal escalation after recovery"
importance_tier: normal
contextType: implementation
version: 1.2.0.3
---

# Deep Context: Convergence Recovery

What happens after convergence blocks a STOP candidate or detects no progress: the loop sets a recovery focus and sweeps again instead of stopping. The stop contract lives in [convergence.md](./convergence.md).

---

## 1. OVERVIEW

### Purpose

Define the two recovery paths for `deep-context`: recovering from a **blocked stop** (a STOP candidate vetoed by a graph guard) and recovering from a **stuck state** (consecutive low-progress sweeps). Both keep the loop iterating with a sharpened focus rather than terminating with incomplete context.

### When to Use

Load this reference when the graph returns `STOP_BLOCKED`, when `stuck_count` reaches `stuckThreshold`, or when reading `blocked_stop` / `stuckRecovery` events in the JSONL stream.

### Core Principle

Recovery must be visible in packet state and must target the failing gate. The host records the recovery decision and a one-line recovery strategy; it never silently changes direction.

### Key Sources

- Blocked-stop persistence: `.opencode/commands/deep/assets/deep_context_auto.yaml` (`step_emit_blocked_stop`).
- Combined stop/recovery decision: same YAML (`step_check_convergence`, `step_handle_convergence`).
- Stuck tracking: same YAML (`step_update_tracking`, `step_read_state`).

---

## 2. BLOCKED-STOP RECOVERY

### Trigger

The host reaches a STOP candidate (it is saturated — see [convergence.md](./convergence.md) §1) but the graph decision is `STOP_BLOCKED`. In `step_check_convergence` this produces `decision = "BLOCKED"`, `reason = "blockedStop"`, with `blocked_by` set to the failing graph guards.

### Process

`step_emit_blocked_stop` persists a first-class event, then converts the decision back to `CONTINUE` with a recovery focus:

| Step | Action |
|------|--------|
| 1 | Append a `blocked_stop` JSONL event carrying `blockedBy`, the `signals` snapshot, and a `recoveryStrategy` one-liner |
| 2 | Log the failed blockers (`blocked_by_csv`) and the recovery strategy |
| 3 | Set `decision = CONTINUE`, `reason = blockedStop` |
| 4 | Set the next focus to `RECOVERY: {recovery_strategy}`, prioritizing the uncovered slices |

The `blocked_stop` event shape:

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "context",
  "run": 4,
  "blockedBy": ["uncovered_slices", "low_relevance_focus"],
  "signals": { "sliceCoverage": 0.55, "relevanceFloor": 0.42, "agreementRate": 0.6 },
  "recoveryStrategy": "Sweep uncovered slices; raise agreement before stopping.",
  "timestamp": "...",
  "sessionId": "...",
  "generation": 1
}
```

### Recovery Strategy by Failing Guard

`recovery_strategy` defaults to the first blocker's message, else a generic widen-and-confirm hint. Each blocking guard implies a distinct next focus:

| Failed Guard | Blocker `type` | Recovery Focus |
|--------------|----------------|----------------|
| `sliceCoverage < 0.70` | `uncovered_slices` | Sweep the SLICE nodes without an outgoing `COVERED_BY` edge (the in-scope surface is not yet swept) |
| `relevanceFloor < 0.50` | `low_relevance_focus` | Narrow the focus to high-relevance anchors; the loop is collecting tangential context |
| `agreementRate < 0.50` | `low_cross_executor_agreement` | Re-sweep low-agreement findings so more executors confirm them before STOP |

Contradictions surface as a `context_contradictions` warning (non-blocking); reconcile incompatible contracts for the same `unit_id` before STOP, but they do not by themselves force recovery.

---

## 3. STUCK RECOVERY

### Trigger

Stuck recovery starts when `stuck_count >= config.stuckThreshold` (default `2`). `stuck_count` increments in `step_update_tracking` when a sweep produces zero new agreement-eligible findings despite a non-empty merge (`new_agreement_eligible_count == 0 and merged_findings_count > 0`), and resets to `0` on any productive sweep. This is K consecutive low-progress sweeps, matching the host saturation streak.

### Process

`step_handle_convergence` handles the `STUCK_RECOVERY` branch:

| Step | Action |
|------|--------|
| 1 | Append a `stuckRecovery` JSONL event (`stopReason: "stuckRecovery"`, `outcome: "recovered"`) |
| 2 | Log the consecutive low-progress sweep count |
| 3 | Set the next focus to `RECOVERY: Widen the slice frontier`, listing the uncovered slices |
| 4 | Reset `stuck_count` to `0` so the widened sweep gets a fresh streak |

The defining recovery action is **widening the frontier**: rather than re-sweeping the same exhausted focus, the loop expands the SLICE set toward uncovered or low-agreement slices for the next shared sweep.

---

## 4. RECOVERY EVALUATION

A recovery sweep succeeds when the next iteration does at least one of:

- covers previously-uncovered slices (raises `sliceCoverage`);
- adds agreement-eligible findings (raises `agreementRate` / clears the saturation streak);
- raises `relevanceFloor` by collecting focused rather than tangential context;
- reconciles a surfaced contradiction.

Recovery fails when the widened sweep still produces no new agreement-eligible findings. Repeated failure does not loop forever: the `maxIterations` cap (`step_check_convergence` step 1) terminates with `maxIterationsReached`, and synthesis records the failed guards and blockers as evidence instead of continuing.

---

## 5. TERMINAL ESCALATION

Two conditions end the loop without a clean `converged` stop:

| Condition | Source | Outcome |
|-----------|--------|---------|
| Iteration cap reached | `step_check_convergence` step 1 | STOP with `maxIterationsReached`; synthesize partial findings, recording unmet guards |
| K consecutive empty sweeps (all seats failed) | `step_collect_seat_findings` (`if_streak_at_3`) | Skip to synthesis with `reason: "error"` after 3 consecutive empty sweeps |

Seat-level failures degrade gracefully: a single failed seat is recorded as `seatsFailed` and the merge proceeds with surviving seats (agreement degrades but the sweep is not aborted). The `error_recovery` block of the workflow defines the per-failure handling (seat timeout, code-graph unavailable, provider unauthenticated, missing state files).
