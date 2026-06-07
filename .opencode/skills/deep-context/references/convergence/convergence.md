---
title: "Deep Context: Convergence"
description: Live stop contract (CONTINUE/STOP_ALLOWED/STOP_BLOCKED) and navigation hub for deep-context convergence.
---

# Deep Context: Convergence

`deep-context` converges on **relevance-gated coverage saturation** with **cross-executor agreement** — distinct from `deep-research` (newInfoRatio) and `deep-review` (severity). This is the compact stop-contract hub; detailed signals, recovery, and graph behavior live in routed references.

---

## 1. OVERVIEW

### Purpose

Keep the executable `deep-context` stop contract short enough to load during a loop while pointing the detailed signal, recovery, and graph behavior to focused references. Every iteration produces signals; the convergence engine evaluates them against thresholds and returns `CONTINUE`, `STOP_ALLOWED`, or `STOP_BLOCKED`. The contract ensures the loop stops only when the gathered context is trustworthy (agreement-eligible) and complete (coverage-saturated), not just voluminous.

### When to Use

Load this hub when deciding whether a `deep-context` loop should continue, recover, or stop. Then route:

- Tuning thresholds, scoring weights, or diagnosing which signal fails → `convergence_signals.md`.
- Recovering from a blocked or stuck stop → `convergence_recovery.md`.
- Understanding how the `loop_type=context` coverage graph drives the decision → `convergence_graph.md`.

### Key Sources

- Command syntax: `.opencode/commands/deep/start-context-loop.md`
- Workflow algorithm: `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` and `_confirm.yaml`
- Signal computation: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` (`computeContextSignalsFromData`)
- Stop evaluation: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` (`evaluateContext`, `computeCompositeScore`)
- Signal details: `convergence_signals.md`
- Recovery details: `convergence_recovery.md`
- Graph stop path: `convergence_graph.md`

For iterative code review convergence, use `deep-review`; for newInfoRatio-driven research convergence, use `deep-research`. Their algorithms and thresholds are not interchangeable with this contract.

### Live Decision Model

Convergence decides whether the loop should continue, recover from a stuck state, or stop. A STOP is not legal until both halves agree: the host's per-iteration saturation check AND the graph's per-signal thresholds. Saturation alone can request STOP; the graph guards authorize or block it.

The live `deep-context` algorithm evaluates, in order:

| Stage | Outcome |
|-------|---------|
| Hard stop | STOP with `maxIterationsReached` when iteration count hits `maxIterations` |
| Stuck detection | Enter `stuckRecovery` after `stuckThreshold` consecutive low-progress sweeps |
| Host saturation | New agreement-eligible findings per iteration below `convergenceThreshold` for K consecutive iterations |
| Graph decision | `evaluateContext` returns `CONTINUE` / `STOP_ALLOWED` / `STOP_BLOCKED` from the five context signals |
| Combined rule | STOP only when host-saturated AND graph is `STOP_ALLOWED` (or absent); otherwise CONTINUE/BLOCKED |

---

## 2. STOP CONTRACT

The graph engine (`convergence.cjs#evaluateContext`) returns one of three decisions. The host combines that decision with its own saturation check (`step_check_convergence`) to reach the final loop action.

### STOP_BLOCKED

Returned when any **blocking guard** fails. The host records the blocker(s), persists a `blocked_stop` event, and continues with a recovery focus targeting the failing gate.

- `sliceCoverage < 0.70` — the defined scope has not been swept.
- `relevanceFloor < 0.50` — the loop is collecting tangential noise, not focused context.
- `agreementRate < 0.50` — findings are not yet multi-model-confirmed.

### STOP_ALLOWED

Returned when every signal passes its threshold (all blocking guards plus the weighted thresholds `reuseCatalogCoverage ≥ 0.60` and `dependencyCompleteness ≥ 0.70`). The loop may then STOP with `converged` **only if** the host saturation check has also passed.

### CONTINUE

Returned otherwise: no blocking guard failed, but at least one signal is still below threshold. The loop advances the frontier and sweeps again.

The exact signal definitions, roles (blocking guard vs weighted), composite-score weights, and the full threshold-reference table live in [convergence_signals.md](./convergence_signals.md). The stuck and blocked-stop recovery paths live in [convergence_recovery.md](./convergence_recovery.md). The coverage-graph stop path (`loop_type=context` nodes/edges) lives in [convergence_graph.md](./convergence_graph.md).

### stopReason Values

The loop normalizes terminal and lifecycle events to a frozen enum (`step_normalize_lifecycle_events`):

| Value | When It Is Used |
|-------|-----------------|
| `converged` | Host saturated and the graph allowed STOP |
| `maxIterationsReached` | The loop hit the configured iteration cap |
| `blockedStop` | A STOP candidate was blocked by a graph guard; the loop continues with recovery |
| `stuckRecovery` | Stuck detection triggered recovery |
| `userPaused` | A pause sentinel halted execution |
| `manualStop` | An operator halted outside the pause-sentinel path |
| `error` | The loop hit an unrecoverable workflow or state error (e.g. K consecutive empty sweeps) |

---

## 3. WHY AGREEMENT + RELEVANCE ARE GUARDS

By-model shared scope means N executors sweep the **same** code each iteration. Two guards make "enough, and trustworthy, context" the stop condition — not raw volume:

- **Agreement guard** (`agreementRate`): without it, the loop could stop on single-executor (low-confidence) findings. Cross-executor confirmation is the heterogeneous pool's whole point, so a finding only counts as confident when at least `agreementMin` (default 2) distinct executors emit it.
- **Relevance guard** (`relevanceFloor`): without it, small-model over-collection of tangential context would masquerade as coverage and the loop would never saturate. Findings below the relevance gate (`0.55`) are dropped to `lowConfidence` and excluded from the kept catalog.

Both are **blocking guards**, not weighted contributors: a high composite score cannot buy past a failed guard. This mirrors the sibling loops' blocking-guard pattern (`deep-research` source diversity / evidence depth; `deep-review` P0 resolution / dimension coverage). See [convergence_signals.md](./convergence_signals.md) for how each guard is computed and why agreement is measured over relevance-gated findings only.

---

## 4. ROUTED REFERENCES

| Resource | Use When |
|----------|----------|
| `convergence_signals.md` | Need the five signal definitions, blocking-vs-weighted roles, composite-score weights, or the threshold-reference table |
| `convergence_recovery.md` | Need the `blocked_stop` recovery path or stuck-recovery frontier widening |
| `convergence_graph.md` | Need the `loop_type=context` coverage-graph stop path: node kinds, relations, the FK constraint, and the upsert→convergence flow |
| `../../feature_catalog/06--coverage-graph-schema/context-convergence-signals.md` | Need the `ContextConvergenceSignals` interface and per-signal query semantics |

---

## 5. NON-GOALS

- Do not copy `deep-research` (newInfoRatio) or `deep-review` (severity) convergence into this contract; their thresholds and signals are not interchangeable.
- Do not treat the composite score as a stop gate — it is telemetry. STOP is decided by the per-signal thresholds plus host saturation.
- Do not change the YAML workflow by editing this document. This document describes and routes the live contract; workflow changes require command/YAML work.
